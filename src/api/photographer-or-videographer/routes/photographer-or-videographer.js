"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/media/:type/create",
      handler: "photographer-or-videographer.createMediaPerson",
      config: {
        auth: false,
        policies: [],
        middlewares: ["api::auth.custom-auth"],
      },
    },
    {
      method: "GET",
      path: "/media/:type/get",
      handler: "photographer-or-videographer.getMediaPersons",
      config: {
        auth: false,
        policies: [],
        middlewares: ["api::auth.custom-auth"],
      },
    },
    {
      method: "PATCH",
      path: "/media/:type/update",
      handler: "photographer-or-videographer.updateMediaPerson",
      config: {
        auth: false,
        policies: [],
        middlewares: ["api::auth.custom-auth"],
      },
    },
    {
      method: "DELETE",
      path: "/media/:type/delete",
      handler: "photographer-or-videographer.deleteMediaPerson",
      config: {
        auth: false,
        policies: [],
        middlewares: ["api::auth.custom-auth"],
      },
    },
    {
      method: "PATCH",
      path: "/media/:type/pick",
      handler: "photographer-or-videographer.pickMediaPerson",
      config: {
        auth: false,
        policies: [],
        middlewares: ["api::auth.custom-auth"],
      },
    },
  ],
};
