"use strict";

const { TASK_CATEGORIES } = require("../../../utils/tasksConstants");

module.exports = {
  async getPredefinedTasks(ctx) {
    try {
      const user = ctx.state.user;

      // Fetch the wedding document
      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
        populate: [
          "communication",
          "musicAndSound",
          "mediaSection",
          "oddsEnds",
          "weddingWeek",
          "bridalDress",
          "groomOutfit",
          "bridesMaidDresses",
          "groomsMenOutfits",
          "selectedCaterer",
          "selectedCaterer.roles",
        ],
      });

      let map = {
        Music: "musicAndSound",
        "Wedding Week": "weddingWeek",
        "Odds & Ends": "oddsEnds",
        "Photo & Video": "mediaSection",
        Communication: "communication",
      };

      if (!wedding) {
        return ctx.notFound("Wedding not found");
      }

      const { category } = ctx.query;
      if (category) {
        let subCategories = await strapi
          .documents("api::sub-category.sub-category")
          .findMany({
            filters: {
              wedding: {
                documentId: wedding.documentId,
              },
              category,
            },
            populate: ["tasks", "notes"],
          });

        if (category === "Attire") {
          subCategories = subCategories.map((sc) => {
            if (sc.name === "Bride Outfit" && wedding.bridalDress) {
              sc["bridalDress"] = wedding.bridalDress;
            }
            if (sc.name === "Groom" && wedding.groomOutfit) {
              sc["groomOutfit"] = wedding.groomOutfit;
            }
            if (sc.name === "Bridesmaids" && wedding.bridesMaidDresses) {
              let dresses = wedding.bridesMaidDresses?.dresses;
              if (!Array.isArray(dresses)) {
                dresses = [];
              }
              sc["progress"] = {
                total: dresses.length,
                // @ts-ignore
                completed: dresses.filter((d) => d.isPurchased).length,
                label: "Dresses bought",
              };
            }
            if (sc.name === "Groomsmen" && wedding.groomsMenOutfits) {
              let outfits = wedding.groomsMenOutfits?.dresses;
              if (!Array.isArray(outfits)) {
                outfits = [];
              }
              sc["progress"] = {
                total: outfits.length,
                // @ts-ignore
                completed: outfits.filter((d) => d.isPurchased).length,
                label: "Outfits bought",
              };
            }
            return sc;
          });
        }

        if (category === "Food") {
          subCategories = subCategories.map((sc) => {
            if (sc.name === "Caterer" && wedding.selectedCaterer) {
              sc["selectedCaterer"] = wedding.selectedCaterer;
            }
            return sc;
          });
        }

        let data = { subCategories };

        if (map[category] && wedding[map[category]]) {
          data["notes"] = wedding[map[category]].notes;
        }

        return ctx.send(data);
      }

      const predefinedTasks = await strapi
        .documents("api::predefined-task.predefined-task")
        .findMany({
          filters: {
            wedding: { documentId: wedding.documentId },
            $and: [
              { priority: { $ne: null } },
              {
                $or: [
                  { subCategory: { checkBoxValue: false } },
                  { subCategory: { checkBoxValue: null } },
                ],
              },
            ],
          },
          sort: { priority: "asc" }, // Sort by priority
        });

      // Get 1/6th of the total predefined tasks
      const totalTasks = predefinedTasks.length;
      const oneSixthCount = Math.ceil(totalTasks / 6);
      let payment = user.isPremium;
      let data = payment
        ? predefinedTasks
        : predefinedTasks.slice(0, oneSixthCount);

      // Return the predefined tasks associated with the wedding
      return ctx.send(predefinedTasks?.length > 0 ? data : []);
    } catch (error) {
      strapi.log.error("Error fetching predefined tasks:", error);
      return ctx.internalServerError(
        "An error occurred while fetching predefined tasks"
      );
    }
  },

  async getPredefinedTasksByNavigation(ctx) {
    try {
      const user = ctx.state.user;
      console.log(ctx.query);

      // Fetch the wedding document
      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
        populate: ["predefinedTasks"],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found");
      }

      const { navigation } = ctx.query;
      console.log(navigation);

      const tasks = wedding.predefinedTasks.filter(
        (task) =>
          task.navigation === navigation ||
          (navigation === "orderSupplies" &&
            (task.name === "Order lighting" || task.name === "Order linens"))
      );

      let data = {};

      tasks.forEach(
        (t) =>
          (data[t.name] = {
            ...t,
          })
      );

      return ctx.send(data);
    } catch (error) {
      strapi.log.error("Error fetching predefined tasks:", error);
      return ctx.internalServerError(
        "An error occurred while fetching predefined tasks"
      );
    }
  },

  async updatePredefinedTask(ctx) {
    try {
      const { documentId, isCompleted } = ctx.request.body;

      if (typeof isCompleted !== "boolean") {
        return ctx.badRequest("isCompleted must be a boolean");
      }

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user: ctx.state.user },
        populate: ["predefinedTasks"],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found for this user");
      }

      const task = wedding.predefinedTasks.find(
        (t) => t.documentId === documentId
      );

      if (!task) {
        return ctx.notFound("Predefined task not found");
      }

      const updatedTask = await strapi
        .documents("api::predefined-task.predefined-task")
        .update({
          documentId: documentId,
          data: { isCompleted },
        });

      // if (task.name === TASK_CATEGORIES.designFloralDecor) {
      //   const task = wedding.predefinedTasks.find(
      //     (t) => t.name === TASK_CATEGORIES.makeDecorSupply
      //   );

      //   await strapi.documents("api::predefined-task.predefined-task").update({
      //     documentId: task.documentId,
      //     data: { isCompleted },
      //   });
      // }

      return ctx.send(updatedTask);
    } catch (error) {
      strapi.log.error("Error updating predefined task:", error);
      return ctx.internalServerError(
        "An error occurred while updating the predefined task"
      );
    }
  },

  async updateSubCategory(ctx) {
    try {
      const { checkBoxValue } = ctx.request.body;
      const { id } = ctx.query;

      const existingSubCategory = await strapi
        .documents("api::sub-category.sub-category")
        .findOne({
          documentId: id,
        });

      if (!existingSubCategory) {
        return ctx.notFound("Sub-category not found");
      }

      if (!existingSubCategory.checkBox) {
        return ctx.badRequest("This sub-category does not have a checkbox");
      }

      if (existingSubCategory.checkBoxValue === checkBoxValue) {
        return ctx.send({ message: "Sub-category updated successfully" });
      }

      await strapi.documents("api::sub-category.sub-category").update({
        documentId: id,
        data: {
          checkBoxValue,
        },
      });

      return ctx.send({ message: "Sub-category updated successfully" });
    } catch (error) {
      console.error("Error updating sub-category:", error);
      return ctx.internalServerError("Error updating sub-category", { error });
    }
  },
};
