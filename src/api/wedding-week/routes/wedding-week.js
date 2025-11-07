"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/single/wedding-week/get",
      handler: "wedding-week.getWeddingWeekScreen",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
  ],
};
