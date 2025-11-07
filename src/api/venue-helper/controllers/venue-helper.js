"use strict";

const { TASK_CATEGORIES } = require("../../../utils/tasksConstants");

const { createVenueHelperBodySchema } = require("../validation/venue-helper");

const types = ["venue", "floral", "caterer", "food"];

module.exports = {
  async createVenueHelper(ctx) {
    try {
      const { type } = ctx.params;
      console.log(type);
      if (types.indexOf(type) === -1) {
        return ctx.badRequest(
          "Validation error - type must be one of venue, floral",
          {
            errors: "Invalid type",
          }
        );
      }
      const { error } = createVenueHelperBodySchema.validate(ctx.request.body, {
        abortEarly: false,
      });
      if (error) {
        return ctx.badRequest("Validation error", { errors: error.details });
      }

      const { roles } = ctx.request.body;

      const user = ctx.state.user;

      const existingRoles = await strapi
        .documents("api::helper-role.helper-role")
        .findMany({
          filters: { user: user, documentId: { $in: roles }, type },
        });

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user: user },
        populate: ["predefinedTasks"],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found for this user");
      }

      await strapi.db.transaction(async (trx) => {
        const newVenueHelper = await strapi
          .documents("api::venue-helper.venue-helper")
          .create({
            status: "published",
            data: {
              ...ctx.request.body,
              roles: existingRoles.map((role) => role.documentId),
              type,
              wedding: wedding.documentId,
            },
          });

        if (type === "caterer") {
          const [compare, choose] = wedding.predefinedTasks.filter(
            (task) =>
              task.name === TASK_CATEGORIES.compareCaterers ||
              task.name === TASK_CATEGORIES.chooseCaterer
          );

          await strapi.db.transaction(async (trx) => {
            if (compare && !compare.isCompleted) {
              await strapi
                .documents("api::predefined-task.predefined-task")
                .update({
                  documentId: compare.documentId,
                  data: { isCompleted: true },
                });
            }
            if (!user.isPremium) {
              await strapi.documents("api::wedding.wedding").update({
                documentId: wedding.documentId,
                data: {
                  selectedCaterer: newVenueHelper.documentId,
                },
              });

              if (choose && !choose.isCompleted) {
                await strapi
                  .documents("api::predefined-task.predefined-task")
                  .update({
                    documentId: choose.documentId,
                    data: { isCompleted: true },
                  });
              }
            }
          });
        }
      });

      return ctx.created({ message: "Helper/Caterer created successfully" });
    } catch (error) {
      return ctx.internalServerError("Error creating venue helper", { error });
    }
  },

  async getVenueHelpers(ctx) {
    try {
      const { type } = ctx.params;
      if (types.indexOf(type) === -1) {
        return ctx.badRequest(
          "Validation error - type must be one of venue, floral",
          {
            errors: "Invalid type",
          }
        );
      }
      const user = ctx.state.user;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: {
          user: user,
        },
        populate: ["helpers", "helpers.roles", "selectedCaterer"],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found for this user");
      }

      let venueHelpers =
        wedding.helpers?.filter((helper) => helper.type === type) || [];

      if (type === "caterer" && wedding.selectedCaterer) {
        venueHelpers = venueHelpers.map((helper) => ({
          ...helper,
          isPicked: helper.documentId === wedding.selectedCaterer.documentId,
        }));
      }
      // console.log(venueHelpers);

      return ctx.send({ helpers: venueHelpers });
    } catch (error) {
      return ctx.internalServerError("Error fetching venue helpers", { error });
    }
  },

  async pickCaterer(ctx) {
    try {
      const user = ctx.state.user;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user: user },
        populate: ["helpers", "selectedCaterer", "predefinedTasks"],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found for this user");
      }

      const helper = wedding.helpers.find(
        (helper) =>
          helper.type === "caterer" && helper.documentId === ctx.query.id
      );

      if (!helper) {
        return ctx.notFound("Helper not found");
      }

      await strapi.db.transaction(async (trx) => {
        await strapi.documents("api::wedding.wedding").update({
          documentId: wedding.documentId,
          data: {
            selectedCaterer: helper,
          },
        });

        const task = wedding.predefinedTasks.find(
          (task) => task.name === TASK_CATEGORIES.chooseCaterer
        );

        if (task && !task.isCompleted) {
          await strapi
            .documents("api::predefined-task.predefined-task")
            .update({
              documentId: task.documentId,
              data: { isCompleted: true },
            });
        }
      });

      return ctx.send("Caterer picked successfully");
    } catch (error) {
      return ctx.internalServerError("Error fetching venue helpers", { error });
    }
  },

  async updateVenueHelper(ctx) {
    try {
      const { type } = ctx.params;
      if (types.indexOf(type) === -1) {
        return ctx.badRequest(
          "Validation error - type must be one of venue, floral",
          {
            errors: "Invalid type",
          }
        );
      }
      const { error } = createVenueHelperBodySchema.validate(ctx.request.body, {
        abortEarly: false,
      });
      if (error) {
        return ctx.badRequest("Validation error", { errors: error.details });
      }

      const { roles } = ctx.request.body;

      const user = ctx.state.user;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user: user },
        populate: ["helpers"],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found for this user");
      }

      const venueHelper = wedding.helpers.find(
        (helper) => helper.documentId === ctx.query.id
      );
      if (!venueHelper) {
        return ctx.notFound("Venue helper not found");
      }

      const existingRoles = await strapi
        .documents("api::helper-role.helper-role")
        .findMany({
          filters: { user: user, documentId: { $in: roles } },
        });

      const updatedVenueHelper = await strapi
        .documents("api::venue-helper.venue-helper")
        .update({
          documentId: ctx.query.id,
          data: {
            ...ctx.request.body,
            roles:
              existingRoles.map((role) => role.documentId) || venueHelper.roles, // Ensure roles are stored as document IDs
          },
        });

      return ctx.send({ helper: updatedVenueHelper });
    } catch (error) {
      return ctx.internalServerError("Error updating venue helper", { error });
    }
  },

  async deleteVenueHelper(ctx) {
    try {
      const { type } = ctx.params;
      if (types.indexOf(type) === -1) {
        return ctx.badRequest(
          "Validation error - type must be one of venue, floral",
          {
            errors: "Invalid type",
          }
        );
      }
      const user = ctx.state.user;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user: user },
        populate: ["helpers", "selectedCaterer", "predefinedTasks"],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found for this user");
      }

      const helpers = await strapi
        .documents("api::venue-helper.venue-helper")
        .findMany({
          filters: {
            wedding: {
              documentId: wedding.documentId,
            },
            type,
          },
        });
      const venueHelper = helpers.find(
        (helper) => helper.documentId === ctx.query.id
      );

      if (!venueHelper) {
        return ctx.notFound("Venue helper not found");
      }
      if (type === "caterer") {
        const [compare, choose] = wedding.predefinedTasks.filter(
          (task) =>
            task.name === TASK_CATEGORIES.chooseCaterer ||
            task.name === TASK_CATEGORIES.compareCaterers
        );

        if (helpers.length === 1 && compare && compare.isCompleted) {
          await strapi
            .documents("api::predefined-task.predefined-task")
            .update({
              documentId: compare.documentId,
              data: { isCompleted: false },
            });
        }

        if (
          wedding.selectedCaterer?.documentId === venueHelper.documentId &&
          choose &&
          choose.isCompleted
        ) {
          await strapi
            .documents("api::predefined-task.predefined-task")
            .update({
              documentId: choose.documentId,
              data: { isCompleted: false },
            });
        }
      }

      await strapi.documents("api::venue-helper.venue-helper").delete({
        documentId: ctx.query.id,
      });

      return ctx.send({ message: "Venue helper removed successfully" });
    } catch (error) {
      console.error("Error removing venue helper:", error);
      ctx.internalServerError("Error removing venue helper");
    }
  },
};
