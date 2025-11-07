"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/odds-and-ends/get",
      handler: "odds-and-end.getOddsAndEnds",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "PATCH",
      path: "/odds-and-ends/update",
      handler: "odds-and-end.createOrUpdateOddsAndEnds",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
  ],
};
