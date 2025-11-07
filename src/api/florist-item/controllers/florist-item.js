"use strict";

const {
  createFloristItemBodySchema,
  updateFloristItemBodySchema,
} = require("../validation/florist-item");

module.exports = {
  async getFloristItems(ctx) {
    try {
      const user = ctx.state.user;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
        populate: ["floristItems"],
      });

      if (!wedding) return ctx.notFound("Wedding not found");

      return ctx.send(wedding.floristItems || []);
    } catch (error) {
      console.error("Error getting florist items:", error);
      ctx.internalServerError("Error getting florist items");
    }
  },

  async createFloristItem(ctx) {
    try {
      const { error } = createFloristItemBodySchema.validate(ctx.request.body);
      if (error) {
        return ctx.badRequest("Invalid request body", {
          errors: error.details.map((detail) => detail.message),
        });
      }

      const user = ctx.state.user;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
      });

      if (!wedding) {
        return ctx.badRequest("Wedding not found", {
          errors: "Wedding not found",
        });
      }

      const item = await strapi
        .documents("api::florist-item.florist-item")
        .create({
          status: "published",
          data: {
            ...ctx.request.body,
            wedding: wedding.documentId,
          },
        });

      return ctx.send({
        message: "Florist item created successfully",
        floristItem: item,
      });
    } catch (error) {
      console.error("Error creating florist item:", error);
      ctx.internalServerError("Error creating florist item");
    }
  },

  async updateFloristItem(ctx) {
    try {
      const { id } = ctx.query;
      if (!id) {
        return ctx.badRequest("Invalid florist item ID", {
          errors: "Florist item ID is required",
        });
      }

      const { error } = updateFloristItemBodySchema.validate(ctx.request.body);
      if (error) {
        return ctx.badRequest("Invalid request body", {
          errors: error.details.map((detail) => detail.message),
        });
      }

      const user = ctx.state.user;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
        populate: ["floristItems"],
      });

      if (!wedding) {
        return ctx.badRequest("Wedding not found", {
          errors: "Wedding not found",
        });
      }

      const item = wedding.floristItems.find((item) => item.documentId === id);
      if (!item) {
        return ctx.badRequest("Invalid florist item ID", {
          errors: "Florist item not found",
        });
      }

      const updatedItem = await strapi
        .documents("api::florist-item.florist-item")
        .update({
          documentId: id,
          data: ctx.request.body,
        });

      return ctx.send({
        message: "Florist item updated successfully",
        floristItem: updatedItem,
      });
    } catch (error) {
      console.error("Error updating florist item:", error);
      ctx.internalServerError("Error updating florist item");
    }
  },

  async deleteFloristItem(ctx) {
    try {
      const { id } = ctx.query;
      if (!id) {
        return ctx.badRequest("Invalid florist item ID", {
          errors: "Florist item ID is required",
        });
      }

      const user = ctx.state.user;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
        populate: ["floristItems"],
      });

      if (!wedding) {
        return ctx.badRequest("Wedding not found", {
          errors: "Wedding not found",
        });
      }

      const item = wedding.floristItems.find((item) => item.documentId === id);
      if (!item) {
        return ctx.badRequest("Invalid florist item ID", {
          errors: "Florist item not found",
        });
      }

      await strapi.documents("api::florist-item.florist-item").delete({
        documentId: id,
      });

      return ctx.send({ message: "Florist item deleted successfully" });
    } catch (error) {
      console.error("Error updating florist item:", error);
      ctx.internalServerError("Error updating florist item");
    }
  },
};
