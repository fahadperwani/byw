"use strict";

module.exports = {
  routes: [
    {
      method: "PATCH",
      path: "/notes/update/:id",
      handler: "note.updateNote",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/notes/create",
      handler: "note.createNote",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/notes/get",
      handler: "note.getNotes",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "DELETE",
      path: "/notes/delete/:id",
      handler: "note.deleteNote",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
  ],
};
