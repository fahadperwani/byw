"use strict";

const {
  createVenueHelperRoleBodySchema,
} = require("../validation/helper-role");

const types = ["venue", "floral", "caterer", "food"];
module.exports = {
  async createVenueHelperRole(ctx) {
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
      const { error } = createVenueHelperRoleBodySchema.validate(
        ctx.request.body,
        { abortEarly: false }
      );
      if (error) {
        return ctx.badRequest("Validation error", { errors: error.details });
      }
      const user = ctx.state.user;
      const { name } = ctx.request.body;

      // Create the new helper role
      const newHelperRole = await strapi
        .documents("api::helper-role.helper-role")
        .create({
          status: "published",
          data: {
            name,
            user: user.documentId,
            type,
          },
        });

      return ctx.created(newHelperRole);
    } catch (error) {
      return ctx.internalServerError("Error creating venue helper role", {
        error,
      });
    }
  },

  async getVenueHelperRoles(ctx) {
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

      // Fetch the helper roles for the user
      const helperRoles = await strapi
        .documents("api::helper-role.helper-role")
        .findMany({
          filters: { user, type }, // Assuming user.documentId is the correct reference
        });

      return ctx.send({ roles: helperRoles });
    } catch (error) {
      return ctx.internalServerError("Error fetching venue helper roles", {
        error,
      });
    }
  },
};
