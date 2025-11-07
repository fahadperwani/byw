"use strict";

const { TASK_CATEGORIES } = require("../../../utils/tasksConstants");

const { createOtherAttiresBodySchema } = require("../validation/other-attire");

module.exports = {
  async createOtherAttire(ctx) {
    try {
      const { error } = await createOtherAttiresBodySchema.validate(
        ctx.request.body,
        { abortEarly: false }
      );
      if (error) {
        return ctx.badRequest("Validation error", { errors: error.details });
      }

      const user = ctx.state.user;

      const weddings = await strapi.documents("api::wedding.wedding").findMany({
        filters: { user },
        populate: ["otherAttires", "predefinedTasks"],
      });

      const wedding = weddings.length > 0 ? weddings[0] : null;
      if (!wedding) {
        return ctx.notFound("Wedding not found for this user");
      }

      if (wedding.otherAttires) {
        return ctx.badRequest("Other attire already exists for this wedding", {
          errors: "Other attire already exists",
        });
      }

      const { childrenDresses, otherDresses } = ctx.request.body;

      const attire = await strapi
        .documents("api::other-attire.other-attire")
        .create({
          status: "published",
          data: {
            childrenDresses,
            otherDresses,
            wedding: wedding.documentId,
          },
        });

      const task = wedding.predefinedTasks.find(
        (task) => task.name === TASK_CATEGORIES.chooseOtherAttires
      );
      if (
        childrenDresses &&
        childrenDresses?.length > 0 &&
        task &&
        !task.isCompleted
      ) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: task.documentId,
          data: {
            isCompleted: true,
          },
        });
      }

      return ctx.created({
        message: "Other attire created successfully",
        data: attire,
      });
    } catch (error) {
      console.error("Error creating other attire:", error);
      ctx.internalServerError("Error creating other attire");
    }
  },

  async getOtherAttire(ctx) {
    try {
      const user = ctx.state.user;

      const weddings = await strapi.documents("api::wedding.wedding").findMany({
        filters: { user },
        populate: ["otherAttires"],
      });

      const wedding = weddings.length > 0 ? weddings[0] : null;
      if (!wedding) {
        return ctx.notFound("Wedding not found for this user");
      }

      if (!wedding.otherAttires) {
        return ctx.send({
          childrenDresses: [],
          otherDresses: [],
        });
      }

      return ctx.send(wedding.otherAttires);
    } catch (error) {
      console.error("Error retrieving other attire:", error);
      ctx.internalServerError("Error retrieving other attire");
    }
  },

  async updateOtherAttire(ctx) {
    try {
      const { error } = await createOtherAttiresBodySchema.validate(
        ctx.request.body,
        { abortEarly: false }
      );
      if (error) {
        return ctx.badRequest("Validation error", { errors: error.details });
      }

      const user = ctx.state.user;

      const weddings = await strapi.documents("api::wedding.wedding").findMany({
        filters: { user },
        populate: ["otherAttires", "predefinedTasks"],
      });

      const wedding = weddings.length > 0 ? weddings[0] : null;
      if (!wedding) {
        return ctx.notFound("Wedding not found for this user");
      }

      if (!wedding.otherAttires) {
        return ctx.notFound("Other attire not found for this wedding");
      }

      const { childrenDresses, otherDresses } = ctx.request.body;

      await strapi.documents("api::other-attire.other-attire").update({
        documentId: wedding.otherAttires.documentId,
        data: {
          childrenDresses,
          otherDresses,
        },
      });

      const task = wedding.predefinedTasks.find(
        (task) => task.name === TASK_CATEGORIES.chooseOtherAttires
      );
      console.log(task, childrenDresses, otherDresses);
      if (
        childrenDresses &&
        otherDresses &&
        otherDresses?.length > 0 &&
        childrenDresses?.length > 0 &&
        task &&
        !task.isCompleted
      ) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: task.documentId,
          data: {
            isCompleted: true,
          },
        });
      }

      return ctx.send({ message: "Other attire updated successfully" });
    } catch (error) {
      console.error("Error updating other attire:", error);
      ctx.internalServerError("Error updating other attire");
    }
  },
};
