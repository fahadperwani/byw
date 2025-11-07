"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/wedding/create",
      handler: "wedding.createWedding",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/wedding/get",
      handler: "wedding.getWedding",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "PATCH",
      path: "/wedding/update",
      handler: "wedding.updateWedding",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    // {
    //   method: "PATCH",
    //   path: "/wedding/updateWedding",
    //   handler: "wedding.updateWedding",
    //   config: {
    //     auth: false,
    //     middlewares: ["api::auth.custom-auth"],
    //     policies: [],
    //   },
    // },
    {
      method: "GET",
      path: "/music/get",
      handler: "wedding.getPlaylists",
      config: {
        auth: false,
        policies: [],
        middlewares: ["api::auth.custom-auth"],
      },
    },
    {
      method: "PATCH",
      path: "/music/update",
      handler: "wedding.updatePlaylist",
      config: {
        auth: false,
        policies: [],
        middlewares: ["api::auth.custom-auth"],
      },
    },
    {
      method: "PATCH",
      path: "/others/update",
      handler: "wedding.updateSound",
      config: {
        auth: false,
        policies: [],
        middlewares: ["api::auth.custom-auth"],
      },
    },
    {
      method: "GET",
      path: "/others/get",
      handler: "wedding.getSound",
      config: {
        auth: false,
        policies: [],
        middlewares: ["api::auth.custom-auth"],
      },
    },
    {
      method: "PATCH",
      path: "/notes/update",
      handler: "wedding.updateNotes",
      config: {
        auth: false,
        policies: [],
        middlewares: ["api::auth.custom-auth"],
      },
    },
    // {
    //   method: "GET",
    //   path: "/wedding/attire",
    //   handler: "wedding.getAttireInfo",
    //   config: {
    //     auth: false,
    //     middlewares: ["api::auth.custom-auth"],
    //     policies: [],
    //   },
    // },
    // {
    //   method: "GET",
    //   path: "/wedding/venue",
    //   handler: "wedding.getVenueInfo",
    //   config: {
    //     auth: false,
    //     middlewares: ["api::auth.custom-auth"],
    //     policies: [],
    //   },
    // },
    {
      method: "GET",
      path: "/wedding/budget",
      handler: "wedding.getBudget",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "PATCH",
      path: "/wedding/budget/update",
      handler: "wedding.updateSpent",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    // {
    //   method: "GET",
    //   path: "/wedding/food",
    //   handler: "wedding.getFoodInfo",
    //   config: {
    //     auth: false,
    //     middlewares: ["api::auth.custom-auth"],
    //     policies: [],
    //   },
    // },
  ],
};
