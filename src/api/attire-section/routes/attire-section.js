"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/attire/create",
      handler: "attire-section.createAttireSection",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/attire/get",
      handler: "attire-section.getAttireSection",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "PATCH",
      path: "/attire/update",
      handler: "attire-section.updateAttireSection",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
  ],
};
