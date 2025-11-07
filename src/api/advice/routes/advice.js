"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/drawer/get",
      handler: "advice.getDrawerContent",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
  ],
};
