"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/food/:type/get",
      handler: "meal.createOrGetSection",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "PATCH",
      path: "/meal/food/update",
      handler: "meal.updateMeal",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    // {
    //   method: "PATCH",
    //   path: "/food/:type/update",
    //   handler: "meal.updateSection",
    //   config: {
    //     auth: false,
    //     middlewares: ["api::auth.custom-auth"],
    //     policies: [],
    //   },
    // },
    {
      method: "POST",
      path: "/:type/menu/create",
      handler: "meal.createMenu",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/:type/menu/get",
      handler: "meal.getMenus",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "DELETE",
      path: "/:type/menu/delete",
      handler: "meal.deleteMenu",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "PATCH",
      path: "/:type/menu/update",
      handler: "meal.updateMenu",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/:type/menu/item/create",
      handler: "meal.createMenuItem",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "PATCH",
      path: "/:type/menu/item/update",
      handler: "meal.updateMenuItem",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
    {
      method: "DELETE",
      path: "/:type/menu/item/delete",
      handler: "meal.deleteMenuItem",
      config: {
        auth: false,
        middlewares: ["api::auth.custom-auth"],
        policies: [],
      },
    },
  ],
};
