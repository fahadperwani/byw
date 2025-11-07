"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/florist/get",
      handler: "florist-item.getFloristItems",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/florist/create",
      handler: "florist-item.createFloristItem",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "PATCH",
      path: "/florist/update",
      handler: "florist-item.updateFloristItem",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "DELETE",
      path: "/florist/delete",
      handler: "florist-item.deleteFloristItem",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
  ],
};
