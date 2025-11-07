module.exports = {
  routes: [
    {
      method: "POST",
      path: "/auth/login",
      handler: "auth.login",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/auth/google-auth",
      handler: "auth.googleAuth",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/auth/signup",
      handler: "auth.signup",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/auth/verify-otp",
      handler: "auth.verifyOtp",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/auth/get-user",
      handler: "auth.getUserById",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/auth/refresh-token",
      handler: "auth.refreshToken",
      config: {
        auth: false,
      },
    },
    {
      method: "PATCH",
      path: "/auth/update-user",
      handler: "auth.updateUser",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "DELETE",
      path: "/auth/delete-user",
      handler: "auth.deleteUser",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
  ],
};
