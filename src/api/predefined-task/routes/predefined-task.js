"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/tasks/predefined/get",
      handler: "predefined-task.getPredefinedTasks",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "PATCH",
      path: "/tasks/predefined/update",
      handler: "predefined-task.updatePredefinedTask",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "PATCH",
      path: "/tasks/predefined/update",
      handler: "predefined-task.updatePredefinedTask",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "PATCH",
      path: "/subcategory/checkbox/update",
      handler: "predefined-task.updateSubCategory",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/tasks/predefined/getByNavigation",
      handler: "predefined-task.getPredefinedTasksByNavigation",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
  ],
};
