"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/helper/:type/create",
      handler: "venue-helper.createVenueHelper",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/helper/:type/get",
      handler: "venue-helper.getVenueHelpers",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "PATCH",
      path: "/helper/:type/update",
      handler: "venue-helper.updateVenueHelper",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "PATCH",
      path: "/caterer/pick",
      handler: "venue-helper.pickCaterer",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "DELETE",
      path: "/helper/:type/delete",
      handler: "venue-helper.deleteVenueHelper",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
  ],
};
