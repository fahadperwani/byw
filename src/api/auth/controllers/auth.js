"use strict";

const { updateAuthBodySchema } = require("../validation/auth");

const axios = require("axios");
const jsonwebtoken = require("jsonwebtoken");

module.exports = {
  async signup(ctx) {
    const { firstName, lastName, email, dob, termsAccepted } = ctx.request.body;

    if (!email || !firstName || !lastName || !dob || !termsAccepted) {
      return ctx.badRequest("Missing required fields");
    }

    const existingUser = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({ where: { email } });

    if (existingUser) return ctx.badRequest("Email already registered");

    const newUser = await strapi.plugins["users-permissions"].services.user.add(
      {
        email,
        username: email.split("@")[0],
        firstName,
        lastName,
        dob,
        termsAccepted,
        confirmed: false,
      }
    );

    try {
      await sendOtp(email, newUser.id);
    } catch (error) {
      console.error("SendGrid Email Error:", error);
      return ctx.internalServerError("Failed to send OTP. Please try again.");
    }

    return ctx.send({ message: "OTP sent to email", userId: newUser.id });
  },

  async googleAuth(ctx) {
    const { accessToken } = ctx.request.body;

    try {
      // Use Google People API to get user details including birthdays
      const googleUserResponse = await axios.get(
        "https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,birthdays",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      // Extract info
      const emailAddresses = googleUserResponse.data.emailAddresses || [];
      const names = googleUserResponse.data.names || [];
      const birthdays = googleUserResponse.data.birthdays || [];

      // Get primary email
      const email = emailAddresses.length > 0 ? emailAddresses[0].value : null;

      if (!email) {
        return ctx.badRequest("Email not found from Google");
      }

      // Get name details
      const firstName = names.length > 0 ? names[0].givenName : "";
      const lastName = names.length > 0 ? names[0].familyName : "";

      // Get Google ID
      const sub = names.length > 0 ? names[0].metadata.source.id : "";

      // Extract date of birth if available
      let dob = "";
      if (birthdays && birthdays.length > 0) {
        const birthday = birthdays[0].date;
        console.log(birthday);
        if (birthday) {
          // Format: YYYY-MM-DD
          dob = `${birthday.year || ""}-${String(birthday.month).padStart(2, "0") || ""}-${String(birthday.day).padStart(2, "0") || ""}`;
          // Clean up the date if any parts are missing
          dob = dob.replace(/^-|-$|--/g, "").trim();
        }
      }
      console.log(dob);

      // Check if the user exists
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { email },
        });

      if (!user) {
        // Create the new user
        const newUser = await strapi.plugins[
          "users-permissions"
        ].services.user.add({
          email,
          username: email.split("@")[0],
          firstName,
          lastName,
          googleId: sub,
          dob,
          confirmed: true,
        });

        // Generate JWT token
        const { jwt, refreshToken } = await generateTokens(newUser.documentId);

        return ctx.send({
          jwt,
          refreshToken,
          user: newUser,
        });
      } else if (user.googleId) {
        // User already exists with Google ID
        const { jwt, refreshToken } = await generateTokens(user.documentId);
        return ctx.send({
          jwt,
          refreshToken,
          user,
        });
      } else {
        return ctx.conflict(
          "Login with Google is not supported for existing users. Please use email login instead."
        );
      }
    } catch (error) {
      return ctx.internalServerError(`Authentication failed: ${error.message}`);
    }
  },

  async login(ctx) {
    const { email } = ctx.request.body;
    console.log(email);
    if (!email) return ctx.badRequest("Email required");

    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({ where: { email } });

    if (!user) return ctx.badRequest("No user with this email");

    if (user.googleId)
      return ctx.conflict(
        "Login with Google is not supported for existing users. Please use email login instead."
      );

    try {
      await sendOtp(email, user.id);
    } catch (error) {
      console.error("SendGrid Email Error:", error);
      return ctx.internalServerError("Failed to send OTP. Please try again.");
    }

    ctx.send({ message: "OTP sent to email" });
  },

  async refreshToken(ctx) {
    try {
      const { refreshToken } = ctx.request.body;
      if (!refreshToken) return ctx.badRequest("Refresh token required");

      const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
      const decoded = jsonwebtoken.verify(refreshToken, refreshSecret);

      if (!decoded) return ctx.badRequest("Invalid refresh token");

      // Find the user
      const user = await strapi
        .documents("plugin::users-permissions.user")
        .findOne({ documentId: decoded["id"] });

      if (!user) return ctx.notFound("User not found");

      // Calculate expiration in seconds from now
      const { jwt, refreshToken: newRefreshToken } = await generateTokens(
        user.documentId
      );

      ctx.send({ jwt, refreshToken: newRefreshToken });
    } catch (error) {
      console.error("Error refreshing token:", error);
      ctx.internalServerError("Error refreshing token");
    }
  },

  async verifyOtp(ctx) {
    const { email, code } = ctx.request.body;
    if (!email || !code) return ctx.badRequest("Missing email or code");

    console.log("Verifying OTP for:", email, code);

    const otpEntry = await strapi.db.query("api::otp.otp").findOne({
      where: {
        email,
        code,
        verified: false,
        expiresAt: { $gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpEntry) {
      return ctx.badRequest("Invalid or expired code");
    }

    await strapi.db.query("api::otp.otp").update({
      where: { id: otpEntry.id },
      data: { verified: true },
    });

    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({ where: { email } });

    if (!user) return ctx.badRequest("User not found");

    if (!user.confirmed) {
      await strapi.db.query("plugin::users-permissions.user").update({
        where: { id: user.id },
        data: { confirmed: true },
      });
    }

    const { jwt, refreshToken } = await generateTokens(user.documentId);

    ctx.send({ jwt, refreshToken, user });
  },

  async getUserById(ctx) {
    try {
      const { documentId } = ctx.state.user;
      const user = await strapi
        .documents("plugin::users-permissions.user")
        .findOne({ documentId });

      if (!user) return ctx.notFound("User not found");

      ctx.send(user);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      ctx.internalServerError("Error fetching user");
    }
  },

  async updateUser(ctx) {
    try {
      const { error } = updateAuthBodySchema.validate(ctx.request.body ?? {}, {
        abortEarly: false,
        allowUnknown: true,
      });
      if (error) {
        return ctx.badRequest("Validation error", { errors: error.details });
      }

      const { documentId } = ctx.state.user;

      const { firstName, lastName, termsAccepted } = ctx.request.body;

      const user = await strapi
        .documents("plugin::users-permissions.user")
        .update({
          documentId,
          data: {
            firstName: firstName || ctx.state.user.firstName,
            lastName: lastName || ctx.state.user.lastName,
            termsAccepted:
              termsAccepted !== undefined
                ? termsAccepted
                : ctx.state.user.termsAccepted,
          },
        });

      ctx.send(user);
    } catch (error) {
      console.error("Error updating user:", error);
      ctx.internalServerError("Error updating user");
    }
  },

  async deleteUser(ctx) {
    try {
      const { documentId } = ctx.state.user;

      const user = await strapi
        .documents("plugin::users-permissions.user")
        .delete({ documentId });

      ctx.send(user);
    } catch (error) {
      console.error("Error deleting user:", error);
      ctx.internalServerError("Error deleting user");
    }
  },
};

async function sendOtp(email, user) {
  console.log("Sending OTP to:", email);

  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  try {
    await strapi.db.query("api::otp.otp").deleteMany({
      where: { email, verified: false },
    });

    await strapi.db.query("api::otp.otp").create({
      data: {
        email,
        code,
        expiresAt,
        user,
        verified: false,
        publishedAt: new Date(),
      },
    });

    await strapi.plugins["email"].services.email.send({
      to: email,
      subject: "Your BYW Verification Code",
      text: `Thank you for registering with Bridal Your Way. Your verification code is ${code}, and it will expire in 5 minutes.`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header with Logo -->
                    <tr>
                      <td align="center" style="padding: 40px 20px; background-color: #f9f4f0;">
                        <img src="https://i.ibb.co/1fnPTfN9/app-icon.jpg" style="width: 150px; height: auto;" />
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="color: #3d2817; margin: 0 0 20px 0; font-size: 24px; text-align: center;">Verify Your Email</h2>
                        <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                          Thank you for registering with <strong>Bridal Your Way</strong>. Your verification code is:
                        </p>
                        
                        <!-- OTP Code Box -->
                        <div style="background-color: #f9f4f0; border: 2px dashed #3d2817; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                          <span style="font-size: 32px; font-weight: bold; color: #3d2817; letter-spacing: 8px;">${code}</span>
                        </div>
                        
                        <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0; text-align: center;">
                          This code will expire in <strong>5 minutes</strong>.
                        </p>
                        
                        <p style="color: #999999; font-size: 12px; line-height: 1.5; margin: 30px 0 0 0; text-align: center;">
                          If you didn't request this code, please ignore this email.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 20px 30px; background-color: #f9f4f0; text-align: center;">
                        <p style="color: #999999; font-size: 12px; margin: 0; line-height: 1.5;">
                          This email was sent from <strong>Bridal Your Way</strong><br/>
                          Your complete wedding planning companion
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    console.log("OTP sent and saved successfully");
  } catch (err) {
    console.error("sendOtp error:", JSON.stringify(err));
    throw err;
  }
}

async function generateTokens(documentId) {
  let expiresIn = 15 * 24 * 60 * 60; // 15 days or 30 minutes
  const jwt = strapi.plugins["users-permissions"].services.jwt.issue(
    {
      id: documentId,
    },
    {
      expiresIn,
    }
  );

  expiresIn = 30 * 24 * 60 * 60; // 30 days or 1 hour
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
  const refreshToken = jsonwebtoken.sign({ id: documentId }, refreshSecret, {
    expiresIn,
  });

  return { jwt, refreshToken };
}
