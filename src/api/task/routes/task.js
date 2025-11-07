"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/task/create",
      handler: "task.createTask",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/task/get",
      handler: "task.getTasks",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    // {
    //   method: "PATCH",
    //   path: "/task/update",
    //   handler: "task.updateTask",
    //   config: {
    //     auth: false,
    //     middlewares: ["api::auth.custom-auth"],
    //     policies: [],
    //   },
    // },
    {
      method: "PATCH",
      path: "/task/updateTask",
      handler: "task.updateTask",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
  ],
};
