"use strict";

const { TASK_CATEGORIES } = require("../../../utils/tasksConstants");

const {
  updateMealBodySchema,
  updateMenuBodySchema,
  updateMenuItemBodySchema,
} = require("../validation/meal");

const types = ["meal", "dessert"];

module.exports = {
  async createOrGetSection(ctx) {
    try {
      const user = ctx.state.user;
      const type = ctx.params.type;

      if (!types.includes(type)) {
        return ctx.badRequest("Invalid type");
      }

      const sectionType = type === "meal" ? "mealSection" : "dessertSection";

      let notes =
        type === "meal"
          ? [`${sectionType}.notes`]
          : [`${sectionType}.dessertNotes`, `${sectionType}.beverageNotes`];

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: {
          user: user,
        },
        populate: [
          sectionType,
          `${sectionType}.menus`,
          `${sectionType}.menus.items`,
          sectionType === "dessertSection"
            ? "createdBy"
            : `${sectionType}.items`,
          // @ts-ignore
          ...notes,
        ],
      });

      if (!wedding) {
        return ctx.badRequest("Wedding not found for the user.");
      }

      if (wedding[type === "meal" ? "mealSection" : "dessertSection"]) {
        return ctx.send(
          wedding[type === "meal" ? "mealSection" : "dessertSection"]
        );
      }

      const subCategory = await strapi
        .documents("api::sub-category.sub-category")
        .findFirst({
          filters: {
            wedding: {
              documentId: wedding.documentId,
            },
            name:
              type === "meal"
                ? "DIY Meals Checklist"
                : "Desserts and Beverages",
          },
          populate: ["notes"],
        });

      const documentType =
        type === "meal" ? "api::meal.meal" : "api::dessert.dessert";

      let data = {
        wedding: wedding.documentId,
      };

      if (type === "meal") {
        data["notes"] = subCategory?.notes ? subCategory.notes : "";
      } else {
        data["dessertNotes"] = subCategory?.notes ? subCategory.notes[0] : "";
        data["beverageNotes"] = subCategory?.notes ? subCategory.notes[1] : "";
      }

      const section = await strapi.documents(documentType).create({
        status: "published",
        data: data,
        // @ts-ignore
        populate:
          documentType === "api::meal.meal"
            ? ["menus", "items", "notes"]
            : ["menus", "dessertNotes", "beverageNotes"],
      });

      return ctx.send(section);
    } catch (error) {
      ctx.internalServerError(
        "An error occurred while creating or getting the section.",
        { error }
      );
    }
  },

  // async updateSection(ctx) {
  //   try {
  //     const user = ctx.state.user;

  //     const type = ctx.params.type;

  //     if (!types.includes(type)) {
  //       return ctx.badRequest("Invalid type");
  //     }

  //     const { error } = updateMealBodySchema.validate(ctx.request.body, {
  //       abortEarly: false,
  //     });
  //     if (error) {
  //       return ctx.badRequest(error.details[0].message);
  //     }

  //     const sectionType = type === "meal" ? "mealSection" : "dessertSection";

  //     const wedding = await strapi.documents("api::wedding.wedding").findFirst({
  //       filters: {
  //         user: user,
  //       },
  //       populate: [sectionType],
  //     });

  //     if (!wedding || !wedding[sectionType]) {
  //       return ctx.notFound("Section not found for the wedding.");
  //     }

  //     const documentType =
  //       type === "meal" ? "api::meal.meal" : "api::dessert.dessert";

  //     const updatedSection = await strapi.documents(documentType).update({
  //       documentId: wedding[sectionType].documentId,
  //       data: {
  //         notes: ctx.request.body.notes,
  //       },
  //     });

  //     return ctx.send(updatedSection);
  //   } catch (error) {
  //     ctx.internalServerError("An error occurred while updating the section.", {
  //       error,
  //     });
  //   }
  // },

  async createMenu(ctx) {
    try {
      const user = ctx.state.user;

      const type = ctx.params.type;
      const { name } = ctx.request.body;

      if (!types.includes(type)) {
        return ctx.badRequest("Invalid type");
      }

      if (
        type === "dessert" &&
        !name &&
        ["dessert", "beverages"].includes(name)
      ) {
        return ctx.badRequest("Invalid menu name");
      }

      const sectionType = type === "meal" ? "mealSection" : "dessertSection";

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: {
          user: user,
        },
        populate: [sectionType, "predefinedTasks", `${sectionType}.menus`],
      });

      if (!wedding) {
        return ctx.badRequest("Wedding not found for the user.");
      }

      if (!wedding[sectionType]) {
        return ctx.badRequest(`${type} section does not exist`);
      }

      let menu = null;

      await strapi.db.transaction(async (transaction) => {
        menu = await strapi.documents("api::menu.menu").create({
          status: "published",
          data: {
            [type]: wedding[sectionType].documentId,
            name,
          },
        });

        if (type === "meal") {
          const [create, organize] = wedding.predefinedTasks.filter(
            (task) =>
              task.name === TASK_CATEGORIES.createFoodMenu ||
              (task.name === TASK_CATEGORIES.organizeDiyFood &&
                !task.isCompleted)
          );

          if (create && organize) {
            await strapi
              .documents("api::predefined-task.predefined-task")
              .update({
                documentId: create.documentId,
                data: { isCompleted: true },
              });
            await strapi
              .documents("api::predefined-task.predefined-task")
              .update({
                documentId: organize.documentId,
                data: { isCompleted: true },
              });
          }
        } else if (type === "dessert") {
          const task = wedding.predefinedTasks.find(
            (task) => task.name === TASK_CATEGORIES.decideDessertsBeverages
          );
          console.log(task, wedding[sectionType].menus.length);

          if (!task.isCompleted && wedding[sectionType].menus?.length === 1) {
            await strapi
              .documents("api::predefined-task.predefined-task")
              .update({
                documentId: task.documentId,
                data: { isCompleted: true },
              });
          }
        }
      });

      return ctx.send({ message: "Menu created successfully", menu });
    } catch (error) {
      ctx.internalServerError("An error occurred while creating the menu.", {
        error,
      });
    }
  },

  async getMenus(ctx) {
    try {
      const user = ctx.state.user;

      const type = ctx.params.type;

      if (!types.includes(type)) {
        return ctx.badRequest("Invalid type");
      }

      const sectionType = type === "meal" ? "mealSection" : "dessertSection";

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: {
          user: user,
        },
        populate: [
          sectionType,
          `${sectionType}.menus`,
          `${sectionType}.menus.items`,
        ],
      });

      if (!wedding) {
        return ctx.badRequest("Wedding not found for the user.");
      }

      if (!wedding[sectionType]) {
        return ctx.badRequest("section does not exist");
      }

      const { id } = ctx.query;

      if (!id) {
        return ctx.send({ menus: wedding[sectionType].menus });
      }

      const menu =
        wedding[sectionType].menus.find((menu) => menu.documentId === id) || {};

      return ctx.send({ menus: [menu] });
    } catch (error) {
      ctx.internalServerError("An error occurred while getting the menus.", {
        error,
      });
    }
  },

  async updateMeal(ctx) {
    try {
      const user = ctx.state.user;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: {
          user: user,
        },
        populate: ["mealSection"],
      });

      if (!wedding) {
        return ctx.badRequest("Wedding not found for the user.");
      }

      if (!wedding.mealSection) {
        return ctx.badRequest("Meal section does not exist");
      }

      await strapi.documents("api::meal.meal").update({
        documentId: wedding.mealSection.documentId,
        data: {
          foodScheduled: !wedding.mealSection.foodScheduled,
        },
      });

      return ctx.send({ menu: wedding.mealSection });
    } catch (error) {
      console.log(error);
      ctx.internalServerError("An error occurred while updating the menu.", {
        error,
      });
    }
  },

  async updateMenu(ctx) {
    try {
      const type = ctx.params.type;

      if (!types.includes(type)) {
        return ctx.badRequest("Invalid type");
      }

      const { error } = updateMenuBodySchema.validate(ctx.request.body, {
        abortEarly: false,
      });

      if (error) {
        return ctx.badRequest(error.details[0].message);
      }

      const { id } = ctx.query;

      if (!id) {
        return ctx.badRequest("Invalid menu ID");
      }

      const user = ctx.state.user;

      const sectionType = type === "meal" ? "mealSection" : "dessertSection";

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: {
          user: user,
        },
        populate: [sectionType, `${sectionType}.menus`],
      });

      if (!wedding) {
        return ctx.badRequest("Wedding not found for the user.");
      }

      if (!wedding[sectionType]) {
        return ctx.badRequest("Section does not exist");
      }

      const menu = wedding[sectionType].menus.find(
        (menu) => menu.documentId === id
      );

      if (!menu) {
        return ctx.badRequest("Menu not found");
      }

      const updatedMenu = await strapi.documents("api::menu.menu").update({
        documentId: menu.documentId,
        data: {
          name: ctx.request.body.name,
        },
      });

      return ctx.send(updatedMenu);
    } catch (error) {
      ctx.internalServerError("An error occurred while updating the menu.", {
        error,
      });
    }
  },

  async deleteMenu(ctx) {
    try {
      const type = ctx.params.type;

      if (!types.includes(type)) {
        return ctx.badRequest("Invalid type");
      }

      const { id } = ctx.query;

      if (!id) {
        return ctx.badRequest("Invalid menu ID");
      }

      const user = ctx.state.user;
      const sectionType = type === "meal" ? "mealSection" : "dessertSection";

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user: user },
        populate: [
          sectionType,
          `${sectionType}.menus`,
          `${sectionType}.menus.items`,
          "predefinedTasks",
        ],
      });

      if (!wedding) {
        return ctx.badRequest("Wedding not found for the user.");
      }

      if (!wedding[sectionType]) {
        return ctx.badRequest("Section does not exist");
      }

      const menu = wedding[sectionType].menus.find(
        (menu) => menu.documentId === id
      );

      if (!menu) {
        return ctx.badRequest("Menu not found");
      }

      await strapi.db.transaction(async (transaction) => {
        await strapi.documents("api::menu.menu").delete({
          documentId: menu.documentId,
        });

        for (const item of menu.items) {
          await strapi.documents("api::menu-item.menu-item").delete({
            documentId: item.documentId,
          });
        }

        if (type === "meal" && wedding[sectionType].menus.length === 1) {
          const [create, organize] = wedding.predefinedTasks.filter(
            (task) =>
              task.name === TASK_CATEGORIES.createFoodMenu ||
              (task.name === TASK_CATEGORIES.organizeDiyFood &&
                task.isCompleted)
          );

          if (create && organize) {
            await strapi
              .documents("api::predefined-task.predefined-task")
              .update({
                documentId: create.documentId,
                data: { isCompleted: false },
              });
            await strapi
              .documents("api::predefined-task.predefined-task")
              .update({
                documentId: organize.documentId,
                data: { isCompleted: false },
              });
          }
        } else if (
          type === "dessert" &&
          wedding[sectionType].menus.length <= 1
        ) {
          const [decide, organizeBeverages, organizeDesserts] =
            wedding.predefinedTasks.filter(
              (task) =>
                task.name === TASK_CATEGORIES.decideDessertsBeverages ||
                task.name === TASK_CATEGORIES.organizeBeverages ||
                task.name === TASK_CATEGORIES.organizeDesserts
            );

          if (decide && decide.isCompleted) {
            await strapi
              .documents("api::predefined-task.predefined-task")
              .update({
                documentId: decide.documentId,
                data: { isCompleted: false },
              });
          }

          const task = menu.name.toLowerCase().includes("beverages")
            ? organizeBeverages
            : organizeDesserts;

          if (task && task.isCompleted) {
            await strapi
              .documents("api::predefined-task.predefined-task")
              .update({
                documentId: task.documentId,
                data: { isCompleted: false },
              });
          }
        }
      });

      return ctx.send({
        message: "Menu deleted successfully",
        documentId: id,
      });
    } catch (error) {
      console.log(error);
      ctx.internalServerError("An error occurred while deleting the menu.", {
        error,
      });
    }
  },

  async createMenuItem(ctx) {
    try {
      const user = ctx.state.user;

      const type = ctx.params.type;

      if (!types.includes(type)) {
        return ctx.badRequest("Invalid type");
      }

      const sectionType = type === "meal" ? "mealSection" : "dessertSection";

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: {
          user: user,
        },
        populate: [
          sectionType,
          `${sectionType}.menus`,
          type === "meal" ? `${sectionType}.items` : "createdBy",
        ],
      });

      if (!wedding) {
        return ctx.badRequest("Wedding not found for the user.");
      }

      if (!wedding[sectionType]) {
        return ctx.badRequest("Meal section does not exist");
      }

      const { id } = ctx.query;

      if (!id && type === "meal") {
        const item = await strapi.documents("api::menu-item.menu-item").create({
          status: "published",
          data: {
            ...ctx.request.body,
            section: wedding.mealSection.documentId,
          },
        });

        return ctx.send(item);
      }

      const menu = wedding[sectionType].menus.find(
        (menu) => menu.documentId === id
      );

      if (!menu) {
        return ctx.badRequest("Menu not found");
      }

      const item = await strapi.documents("api::menu-item.menu-item").create({
        status: "published",
        data: {
          ...ctx.request.body,
          menu: menu.documentId,
        },
      });

      return ctx.send(item);
    } catch (error) {
      ctx.internalServerError(
        "An error occurred while creating the menu item.",
        {
          error,
        }
      );
    }
  },

  async updateMenuItem(ctx) {
    try {
      const { error } = updateMenuItemBodySchema.validate(ctx.request.body, {
        abortEarly: false,
      });

      if (error) {
        return ctx.badRequest(error.details[0].message);
      }

      const { type } = ctx.request.params;

      const { menuId, id } = ctx.query;
      console.log({ menuId, id });

      if (!id) {
        return ctx.badRequest("Invalid menu item ID");
      }

      const user = ctx.state.user;

      const sectionType = type === "meal" ? "mealSection" : "dessertSection";

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: {
          user: user,
        },
        populate: [sectionType, "predefinedTasks"],
      });

      if (!wedding) {
        return ctx.badRequest("Wedding not found for the user.");
      }

      if (!wedding[sectionType]) {
        return ctx.badRequest("Meal section does not exist");
      }

      const item = await strapi.documents("api::menu-item.menu-item").findOne({
        documentId: id,
        populate: ["menu", "section", `menu.${type}`],
      });

      if (
        item.section?.documentId === wedding.mealSection?.documentId &&
        !menuId
      ) {
        await strapi.documents("api::menu-item.menu-item").update({
          documentId: id,
          data: {
            ...ctx.request.body,
          },
        });

        return ctx.send({
          message: "Menu item updated successfully",
          documentId: id,
        });
      }

      if (
        !item.menu ||
        !item.menu[type] ||
        item.menu?.documentId !== menuId ||
        item.menu[type]?.documentId !== wedding[sectionType]?.documentId
      ) {
        return ctx.badRequest("Menu item not found");
      }
      const updated = await strapi
        .documents("api::menu-item.menu-item")
        .update({
          documentId: id,
          data: {
            ...ctx.request.body,
          },
        });

      if (type === "dessert") {
        const [dessert, beverages] = wedding.predefinedTasks?.filter(
          (task) =>
            task.name === TASK_CATEGORIES.organizeDesserts ||
            task.name === TASK_CATEGORIES.organizeBeverages
        );
        let res = updated.isPurchased;

        if (res) {
          const items = await strapi
            .documents("api::menu-item.menu-item")
            .findMany({
              filters: {
                menu: {
                  documentId: menuId,
                },
              },
            });

          for (let item of items) {
            if (!item.isPurchased) {
              res = false;
              break;
            }
          }
        }

        console.log(
          "Dessert",
          item.menu.name.toLowerCase().includes("beverages"),
          beverages,
          !beverages.isCompleted
        );
        if (
          item.menu.name.toLowerCase().includes("dessert") &&
          dessert &&
          !dessert.isCompleted
        ) {
          console.log("updating dessert task");
          await strapi
            .documents("api::predefined-task.predefined-task")
            .update({
              documentId: dessert.documentId,
              data: {
                isCompleted: res,
              },
            });
        }

        if (
          item.menu.name.toLowerCase().includes("beverages") &&
          beverages &&
          !beverages.isCompleted
        ) {
          console.log("updating beverages task");
          await strapi
            .documents("api::predefined-task.predefined-task")
            .update({
              documentId: beverages.documentId,
              data: {
                isCompleted: res,
              },
            });
        }
      }

      return ctx.send({
        message: "Menu item updated successfully",
        documentId: id,
      });
    } catch (error) {
      console.log(error);
      ctx.internalServerError(
        "An error occurred while updating the menu item.",
        {
          error,
        }
      );
    }
  },

  async deleteMenuItem(ctx) {
    try {
      const { type } = ctx.request.params;
      const { menuId, id } = ctx.query;

      if (!id) {
        return ctx.badRequest("Invalid menu item ID");
      }

      if (!types.includes(type)) {
        return ctx.badRequest("Invalid type");
      }

      const user = ctx.state.user;
      const sectionType = type === "meal" ? "mealSection" : "dessertSection";

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user: user },
        populate: [sectionType, "predefinedTasks"],
      });

      if (!wedding) {
        return ctx.badRequest("Wedding not found for the user.");
      }

      if (!wedding[sectionType]) {
        return ctx.badRequest("Meal section does not exist");
      }

      const item = await strapi.documents("api::menu-item.menu-item").findOne({
        documentId: id,
        populate: ["menu", "section", `menu.${type}`],
      });

      if (!item) {
        return ctx.badRequest("Menu item not found");
      }

      // If it's a section item (not attached to a menu)
      if (
        item.section?.documentId === wedding.mealSection?.documentId &&
        !menuId
      ) {
        await strapi.documents("api::menu-item.menu-item").delete({
          documentId: id,
        });
        return ctx.send({
          message: "Menu item deleted successfully",
          documentId: id,
        });
      }

      // If it's a menu item, validate menu and section
      if (
        !item.menu ||
        !item.menu[type] ||
        item.menu?.documentId !== menuId ||
        item.menu[type]?.documentId !== wedding[sectionType]?.documentId
      ) {
        return ctx.badRequest("Menu item not found");
      }

      await strapi.documents("api::menu-item.menu-item").delete({
        documentId: id,
      });

      if (type === "dessert") {
        const items = await strapi
          .documents("api::menu-item.menu-item")
          .findMany({
            filters: {
              menu: {
                documentId: menuId,
              },
            },
          });

        let res = true;

        for (let item of items) {
          if (!item.isPurchased) {
            res = false;
            break;
          }
        }

        const [dessert, beverages] = wedding.predefinedTasks?.filter(
          (task) =>
            task.name === TASK_CATEGORIES.organizeDesserts ||
            task.name === TASK_CATEGORIES.organizeBeverages
        );

        const task = item.menu.name.toLowerCase().includes("beverages")
          ? beverages
          : dessert;

        console.log(res, items.length);

        if (items.length === 0) res = false;

        if (res !== task.isCompleted) {
          await strapi
            .documents("api::predefined-task.predefined-task")
            .update({
              documentId: task.documentId,
              data: {
                isCompleted: res,
              },
            });
        }
      }

      return ctx.send({
        message: "Menu item deleted successfully",
        documentId: id,
      });
    } catch (error) {
      ctx.internalServerError(
        "An error occurred while deleting the menu item.",
        { error }
      );
    }
  },
};
