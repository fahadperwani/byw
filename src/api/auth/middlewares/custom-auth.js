"use strict";

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    try {
      const token = ctx.request.header.authorization?.replace("Bearer ", "");

      if (!token) {
        return ctx.forbidden("No authorization token was found");
      }

      try {
        // Verify token
        const decoded =
          await strapi.plugins["users-permissions"].services.jwt.verify(token);

        // Find the user
        const user = await strapi
          .documents("plugin::users-permissions.user")
          .findOne({ documentId: decoded.id, populate: ["payment"] });

        if (!user) {
          return ctx.unauthorized("User not found");
        }

        // Set the user in the state to be accessed by policies and controllers
        ctx.state.user = user;
        ctx.state.authenticated = true;

        console.log("Custom auth middleware: User authenticated:", user.id);

        return await next();
      } catch (e) {
        return ctx.unauthorized(`Invalid token: ${e.message}`);
      }
    } catch (error) {
      return ctx.unauthorized(`Authentication error: ${error.message}`);
    }
  };
};
