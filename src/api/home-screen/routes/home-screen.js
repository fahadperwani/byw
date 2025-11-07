"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/single/home/get",
      handler: "home-screen.getHomeScreen",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
  ],
};
