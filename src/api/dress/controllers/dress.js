"use strict";

const { TASK_CATEGORIES } = require("../../../utils/tasksConstants");

const {
  createDressBodySchema,
  updateDressBodySchema,
} = require("../validation/dress");

module.exports = {
  async createDress(ctx) {
    try {
      const { error } = createDressBodySchema.validate(ctx.request.body, {
        abortEarly: false,
      });
      if (error)
        return ctx.badRequest("Validation error", { errors: error.details });

      const user = ctx.state.user;

      const weddings = await strapi.documents("api::wedding.wedding").findMany({
        filters: { user: user },
        populate: ["predefinedTasks"],
      });
      const wedding = weddings.length > 0 ? weddings[0] : null;
      if (!wedding) {
        return ctx.notFound("Wedding not found for this user");
      }

      const { shopName, shopAddress, cost, isBridal, note } = ctx.request.body;

      await strapi.db.transaction(async (transaction) => {
        const [t1, t2] = isBridal
          ? [
              TASK_CATEGORIES.searchBridalDresses,
              TASK_CATEGORIES.chooseBridalDresses,
            ]
          : [
              TASK_CATEGORIES.searchGroomOutfit,
              TASK_CATEGORIES.chooseGroomOutfit,
            ];

        const [search, pick] = wedding.predefinedTasks.filter((task) => {
          return task.name === t1 || task.name === t2;
        });

        const newDress = await strapi.documents("api::dress.dress").create({
          status: "published",
          data: {
            shopName,
            shopAddress,
            cost,
            isBridal,
            note,
            wedding: wedding.documentId,
          },
        });

        if (search && !search.isCompleted) {
          await strapi
            .documents("api::predefined-task.predefined-task")
            .update({
              documentId: search.documentId,
              data: { isCompleted: true },
            });
        }

        if (!user.isPremium) {
          const data = {};
          if (isBridal) data["bridalDress"] = newDress.documentId;
          else data["groomOutfit"] = newDress.documentId;
          await strapi.documents("api::wedding.wedding").update({
            documentId: wedding.documentId,
            data,
          });
        }

        if (pick && !pick.isCompleted) {
          await strapi
            .documents("api::predefined-task.predefined-task")
            .update({
              documentId: pick.documentId,
              data: { isCompleted: true },
            });
        }
      });

      return ctx.created({
        message: "Dress created successfully",
      });
    } catch (error) {
      ctx.internalServerError("Error creating dress");
    }
  },

  async getDresses(ctx) {
    try {
      const user = ctx.state.user;
      const weddings = await strapi.documents("api::wedding.wedding").findMany({
        filters: { user: user },
        populate: ["dresses", "bridalDress", "groomOutfit"],
      });
      const wedding = weddings.length > 0 ? weddings[0] : null;
      if (!wedding) {
        return ctx.notFound("Wedding not found for this user");
      }

      if (ctx.query.type !== "bridal" && ctx.query.type !== "groom") {
        return ctx.badRequest(
          'Invalid type query parameter. Use "bridal" or "groom".'
        );
      }

      const isBridal = ctx.query.type === "bridal";
      const dresses = wedding.dresses
        .filter((dress) => dress.isBridal === isBridal)
        .map((dress) => ({
          ...dress,
          isPicked:
            (isBridal
              ? wedding?.bridalDress?.documentId
              : wedding?.groomOutfit?.documentId) === dress.documentId,
        }));

      return ctx.send({ dresses });
    } catch (error) {
      console.error("Error fetching dresses:", error);
      ctx.internalServerError("Error fetching dresses");
    }
  },

  async pickDress(ctx) {
    try {
      const user = ctx.state.user;
      const { id: outfitId, type } = ctx.query;

      // Validate type parameter
      if (!type || !["bridal", "groom"].includes(type.toLowerCase())) {
        return ctx.badRequest(
          'Type parameter is required and must be either "bridal" or "groom"'
        );
      }

      const outfitType = type.toLowerCase();
      const fieldName = outfitType === "bridal" ? "bridalDress" : "groomOutfit";
      const outfitLabel =
        outfitType === "bridal" ? "Bridal dress" : "Groom outfit";

      // Find user's wedding
      const weddings = await strapi.documents("api::wedding.wedding").findMany({
        filters: { user: user },
        populate: [fieldName, "predefinedTasks"],
      });

      const wedding = weddings.length > 0 ? weddings[0] : null;
      if (!wedding) {
        return ctx.notFound("Wedding not found for this user");
      }

      // Check if outfit is already picked
      // if (wedding[fieldName]) {
      //   return ctx.badRequest(`${outfitLabel} already picked`);
      // }

      // Validate outfit ID
      if (!outfitId) {
        return ctx.badRequest("Outfit ID is required");
      }

      // Find the outfit/dress
      const outfit = await strapi.documents("api::dress.dress").findOne({
        documentId: outfitId,
      });

      if (!outfit) {
        return ctx.notFound("Outfit not found");
      }

      // Validate outfit type matches request
      if (outfitType === "bridal" && !outfit.isBridal) {
        return ctx.badRequest("Selected dress is not a bridal dress");
      }

      if (outfitType === "groom" && outfit.isBridal) {
        return ctx.badRequest("Selected outfit is not a groom outfit");
      }

      // Update the wedding with the selected outfit
      await strapi.documents("api::wedding.wedding").update({
        documentId: wedding.documentId,
        data: { [fieldName]: outfitId },
      });

      const name = outfit.isBridal
        ? TASK_CATEGORIES.chooseBridalDresses
        : TASK_CATEGORIES.chooseGroomOutfit;

      const task = wedding.predefinedTasks?.find((t) => t.name === name);

      if (task) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: task.documentId,
          data: { isCompleted: true },
        });
      }

      return ctx.send({
        message: `${outfitLabel} picked successfully`,
        type: outfitType,
        outfitId: outfitId,
      });
    } catch (error) {
      console.error("Error picking outfit:", error);
      ctx.internalServerError("Error picking outfit");
    }
  },

  async updateDress(ctx) {
    try {
      const { error } = updateDressBodySchema.validate(ctx.request.body);

      if (error) {
        return ctx.badRequest("Validation error", { errors: error.details });
      }

      const user = ctx.state.user;

      const weddings = await strapi.documents("api::wedding.wedding").findMany({
        filters: { user: user },
        populate: ["dresses"],
      });

      const wedding = weddings.length > 0 ? weddings[0] : null;
      if (!wedding) {
        return ctx.notFound("Wedding not found for this user");
      }

      const { id } = ctx.query;
      const { shopName, shopAddress, cost, isBridal, note } = ctx.request.body;

      const dress = wedding.dresses.find((d) => d.documentId === id);
      if (!dress) {
        return ctx.notFound("Dress not found");
      }
      const updatedDress = await strapi.documents("api::dress.dress").update({
        documentId: id,
        data: {
          shopName,
          shopAddress,
          cost,
          isBridal,
          note,
        },
      });
      return ctx.send({
        message: "Dress updated successfully",
        dress: updatedDress,
      });
    } catch (error) {
      console.error("Error updating dress:", error);
      ctx.internalServerError("Error updating dress");
    }
  },

  async deleteDress(ctx) {
    try {
      const user = ctx.state.user;

      const weddings = await strapi.documents("api::wedding.wedding").findMany({
        filters: { user: user },
        populate: ["dresses", "predefinedTasks", "bridalDress", "groomOutfit"],
      });

      const wedding = weddings.length > 0 ? weddings[0] : null;
      if (!wedding) {
        return ctx.notFound("Wedding not found for this user");
      }

      const dress = wedding.dresses.find((d) => d.documentId === ctx.query.id);
      if (!dress) {
        return ctx.notFound("Dress not found");
      }

      const fieldName = dress.isBridal ? "bridalDress" : "groomOutfit";

      // Remove the dress from the wedding
      await strapi.documents("api::dress.dress").delete({
        documentId: dress.documentId,
      });

      const [t1, t2] = dress.isBridal
        ? [
            TASK_CATEGORIES.searchBridalDresses,
            TASK_CATEGORIES.chooseBridalDresses,
          ]
        : [
            TASK_CATEGORIES.searchGroomOutfit,
            TASK_CATEGORIES.chooseGroomOutfit,
          ];

      const [search, pick] = wedding.predefinedTasks.filter((task) => {
        return task.name === t1 || task.name === t2;
      });

      if (wedding.dresses.length === 1) {
        if (search && search.isCompleted) {
          await strapi
            .documents("api::predefined-task.predefined-task")
            .update({
              documentId: search.documentId,
              data: { isCompleted: false },
            });
        }
      }

      if (dress.documentId === wedding[fieldName]?.documentId && pick) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: pick.documentId,
          data: { isCompleted: false },
        });
      }

      return ctx.send({ message: "Dress removed successfully" });
    } catch (error) {
      console.error("Error removing dress:", error);
      ctx.internalServerError("Error removing dress");
    }
  },
};
