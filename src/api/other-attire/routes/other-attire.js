"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/attire/other/create",
      handler: "other-attire.createOtherAttire",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/attire/other/get",
      handler: "other-attire.getOtherAttire",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "PATCH",
      path: "/attire/other/update",
      handler: "other-attire.updateOtherAttire",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
  ],
};
