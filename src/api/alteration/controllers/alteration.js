"use strict";

const { TASK_CATEGORIES } = require("../../../utils/tasksConstants");

const {
  updateAlterationBodySchema,
  updateAlterationItemBodySchema,
} = require("../validation/alteration");

module.exports = {
  async getOrCreateAlteration(ctx) {
    try {
      const user = ctx.state.user;
      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found for this user");
      }

      const { type } = ctx.request.query;

      if (["bridal", "groom"].indexOf(type) === -1) {
        return ctx.badRequest("Invalid alteration type", {
          errors: "Alteration type must be either 'bridal' or 'groom'",
        });
      }

      const isBridal = type === "bridal";

      const alterationExists = await strapi
        .documents("api::alteration.alteration")
        .findFirst({
          filters: {
            isBridal,
            wedding: {
              documentId: wedding.documentId,
            },
          },
          populate: ["items"],
        });

      if (alterationExists) {
        return ctx.send({
          message: "Alteration retrieved successfully",
          data: alterationExists,
        });
      }

      const alteration = await strapi
        .documents("api::alteration.alteration")
        .create({
          status: "published",
          data: {
            scheduled: false,
            received: false,
            isBridal,
            wedding: wedding.documentId,
          },
          populate: ["items"],
        });
      return ctx.send({
        message: "Alteration item created successfully",
        data: alteration,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      ctx.internalServerError("Error updating user");
    }
  },

  async createAlterationItem(ctx) {
    try {
      const { name } = ctx.request.body;
      if (!name || name.trim().length < 3) {
        return ctx.badRequest("Invalid alteration name", {
          errors: "Alteration name is required",
        });
      }

      const user = ctx.state.user;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
        populate: ["predefinedTasks"],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found for this user");
      }

      const { id } = ctx.request.query;

      const alteration = await strapi
        .documents("api::alteration.alteration")
        .findOne({
          documentId: id,
          filters: {
            wedding: { documentId: wedding.documentId },
          },
        });

      if (!alteration) {
        return ctx.badRequest("Invalid alteration ID", {
          errors: "Alteration not found for this wedding",
        });
      }

      const item = await strapi
        .documents("api::alteration-item.alteration-item")
        .create({
          status: "published",
          data: {
            name: name.trim(),
            alteration: id,
          },
        });

      const isBridal = alteration.isBridal;
      const taskName = isBridal
        ? TASK_CATEGORIES.brideOtherClothing
        : TASK_CATEGORIES.groomOtherClothing;
      const task = wedding.predefinedTasks.find(
        (task) => task.name === taskName
      );

      if (task && task.isCompleted) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: task.documentId,
          data: {
            isCompleted: false,
          },
        });
      }

      return ctx.created({
        message: "Alteration item added successfully",
        item,
      });
    } catch (error) {
      console.error("Error adding alteration item:", error);
      return ctx.internalServerError("Error adding alteration item");
    }
  },

  async getAlterationItems(ctx) {
    try {
      const { id } = ctx.query;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user: ctx.state.user },
        populate: ["predefinedTasks"],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found for this user");
      }

      const alteration = await strapi
        .documents("api::alteration.alteration")
        .findOne({
          documentId: id,
          filters: {
            wedding: { documentId: wedding.documentId },
          },
        });

      if (!alteration) {
        return ctx.badRequest("Invalid alteration ID", {
          errors: "Alteration not found for this wedding",
        });
      }
      const items = await strapi
        .documents("api::alteration-item.alteration-item")
        .findMany({
          filters: {
            alteration: {
              documentId: id,
            },
          },
        });
      return ctx.send({
        message: "Alteration items retrieved successfully",
        items,
      });
    } catch (error) {
      console.error("Error retrieving alteration items:", error);
      return ctx.internalServerError("Error retrieving alteration items");
    }
  },

  async updateAlteration(ctx) {
    try {
      const { id } = ctx.query;
      const { scheduled, received } = ctx.request.body;

      if (!id) {
        return ctx.badRequest("Invalid alteration ID", {
          errors: "Alteration ID is required",
        });
      }

      const { error } = updateAlterationBodySchema.validate(ctx.request.body);
      if (error) {
        return ctx.badRequest("Invalid request body", {
          errors: error.details.map((detail) => detail.message),
        });
      }

      const user = ctx.state.user;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
        populate: ["predefinedTasks"],
      });

      const alterationExists = await strapi
        .documents("api::alteration.alteration")
        .findOne({
          documentId: id,
          filters: {
            wedding: { documentId: wedding.documentId },
          },
        });

      if (!alterationExists) {
        return ctx.badRequest("Invalid alteration ID", {
          errors: "Alteration not found for this wedding",
        });
      }

      const data = {};

      if (scheduled !== undefined) data.scheduled = scheduled;
      if (received !== undefined) data.received = received;

      const alteration = await strapi
        .documents("api::alteration.alteration")
        .update({
          documentId: id,
          data,
        });

      const isBridal = alteration.isBridal;

      const name = isBridal
        ? TASK_CATEGORIES.scheduleBridalAlterations
        : TASK_CATEGORIES.scheduleGroomAlterations;
      const task = wedding.predefinedTasks?.find((task) => task.name === name);

      if (scheduled !== task.isCompleted) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: task.documentId,
          data: {
            isCompleted: scheduled,
          },
        });
      }
      return ctx.send({
        message: "Alteration updated successfully",
        alteration,
      });
    } catch (error) {
      console.error("Error updating alteration:", error);
      return ctx.internalServerError("Error updating alteration");
    }
  },

  async updateAlterationItem(ctx) {
    try {
      const { id } = ctx.query;

      if (!id) {
        return ctx.badRequest("Invalid alteration item ID", {
          errors: "Alteration item ID is required",
        });
      }

      const { error } = updateAlterationItemBodySchema.validate(
        ctx.request.body
      );
      if (error) {
        return ctx.badRequest("Invalid request body", {
          errors: error.details.map((detail) => detail.message),
        });
      }

      const item = await strapi
        .documents("api::alteration-item.alteration-item")
        .findOne({
          documentId: id,
          populate: ["alteration"],
        });

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user: ctx.state.user },
        populate: ["predefinedTasks"],
      });

      if (!wedding) {
        return ctx.badRequest("Invalid wedding ID", {
          errors: "Wedding not found for this user",
        });
      }

      const alteration = await strapi
        .documents("api::alteration.alteration")
        .findOne({
          documentId: item.alteration.documentId,
          filters: {
            wedding: { documentId: wedding.documentId },
          },
        });

      if (!alteration) {
        return ctx.badRequest("Invalid alteration ID", {
          errors: "Alteration not found for this wedding",
        });
      }

      const data = ctx.request.body;
      const updatedItem = await strapi
        .documents("api::alteration-item.alteration-item")
        .update({
          documentId: id,
          data,
        });

      const items = await strapi
        .documents("api::alteration-item.alteration-item")
        .findMany({
          filters: {
            alteration: {
              documentId: item.alteration.documentId,
            },
          },
        });

      const isBridal = alteration.isBridal;

      const name = isBridal
        ? TASK_CATEGORIES.brideOtherClothing
        : TASK_CATEGORIES.groomOtherClothing;
      const task = wedding.predefinedTasks?.find((task) => task.name === name);

      let res = true;

      for (let item of items) {
        if (!item.isAcquired) {
          res = false;
          break;
        }
      }

      if (res !== task.isCompleted) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: task.documentId,
          data: {
            isCompleted: res,
          },
        });
      }

      return ctx.send({
        message: "Alteration item updated successfully",
        item: updatedItem,
      });
    } catch (e) {
      console.error("Error updating alteration item:", e);
      return ctx.internalServerError("Error updating alteration item");
    }
  },

  async deleteAlterationItem(ctx) {
    try {
      const { id } = ctx.query;

      if (!id) {
        return ctx.badRequest("Invalid alteration item ID", {
          errors: "Alteration item ID is required",
        });
      }

      const item = await strapi
        .documents("api::alteration-item.alteration-item")
        .findOne({
          documentId: id,
          populate: ["alteration"],
        });

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user: ctx.state.user },
        populate: ["predefinedTasks"],
      });

      if (!wedding) {
        return ctx.badRequest("Invalid wedding ID", {
          errors: "Wedding not found for this user",
        });
      }

      const alteration = await strapi
        .documents("api::alteration.alteration")
        .findOne({
          documentId: item.alteration.documentId,
          filters: {
            wedding: { documentId: wedding.documentId },
          },
        });

      if (!alteration) {
        return ctx.badRequest("Invalid alteration ID", {
          errors: "Alteration not found for this wedding",
        });
      }

      await strapi.documents("api::alteration-item.alteration-item").delete({
        documentId: id,
      });

      const items = await strapi
        .documents("api::alteration-item.alteration-item")
        .findMany({
          filters: {
            alteration: {
              documentId: item.alteration.documentId,
            },
          },
        });

      const isBridal = alteration.isBridal;

      const name = isBridal
        ? TASK_CATEGORIES.brideOtherClothing
        : TASK_CATEGORIES.groomOtherClothing;
      const task = wedding.predefinedTasks?.find((task) => task.name === name);

      if (items.length > 0 && task && task.isCompleted) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: task.documentId,
          data: {
            isCompleted: false,
          },
        });
      }

      return ctx.send({ message: "Alteration item deleted successfully" });
    } catch (e) {
      console.error("Error updating alteration item:", e);
      return ctx.internalServerError("Error updating alteration item");
    }
  },
};
