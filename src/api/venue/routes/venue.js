"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/venue/create",
      handler: "venue.createVenue",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/venue/get",
      handler: "venue.getVenues",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "PATCH",
      path: "/venue/pick",
      handler: "venue.pickVenue",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "DELETE",
      path: "/venue/delete",
      handler: "venue.deleteVenue",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "PATCH",
      path: "/venue/updateVenue",
      handler: "venue.updateVenue",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "PATCH",
      path: "/venue/item/update",
      handler: "venue.updateVenueItem",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/venue/item/get",
      handler: "venue.getVenueItems",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
  ],
};
