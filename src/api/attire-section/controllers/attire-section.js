"use strict";

const { TASK_CATEGORIES } = require("../../../utils/tasksConstants");

const {
  createAttireSectionBodySchema,
} = require("../validation/attire-section");

module.exports = {
  async createAttireSection(ctx) {
    try {
      const section = ctx.request.query.type;

      const validSections = ["bridesMaidDresses", "groomsMenOutfits"];
      if (!validSections.includes(section)) {
        return ctx.badRequest(
          "Validation error - type must be one of bridesMaidDresses, groomsMenOutfits",
          {
            errors: "Invalid section",
          }
        );
      }

      const { error } = createAttireSectionBodySchema.validate(
        ctx.request.body,
        { abortEarly: false }
      );
      if (error) {
        return ctx.badRequest("Validation error", { errors: error.details });
      }

      const user = ctx.state.user;

      const weddings = await strapi.documents("api::wedding.wedding").findMany({
        filters: { user },
        populate: {
          [section]: true, // Ensure the section is populated
          predefinedTasks: true,
        },
      });

      const wedding = weddings.length > 0 ? weddings[0] : null;
      if (!wedding) {
        return ctx.notFound("Wedding not found for this user");
      }
      if (wedding[section]) {
        return ctx.badRequest(
          `Attire section ${section} already exists for this wedding`,
          {
            errors: `Attire section ${section} already exists`,
          }
        );
      }

      const { dresses, accessoriesPurchased } = ctx.request.body;

      // Step 1: Create the attire section
      const attireSection = await strapi
        .documents("api::attire-section.attire-section")
        .create({
          status: "published",
          data: { accessoriesPurchased, dresses },
        });

      await strapi.documents("api::wedding.wedding").update({
        documentId: wedding.documentId,
        data: {
          [section]: attireSection.documentId,
        },
      });

      await updateTasks(
        dresses,
        accessoriesPurchased,
        section,
        wedding.predefinedTasks
      );
      return ctx.created({
        attireSection,
        message: "Attire section created successfully",
      });
    } catch (error) {
      console.error("Create Attire Section Error:", error);
      return ctx.internalServerError("Error creating attire section");
    }
  },

  async getAttireSection(ctx) {
    try {
      const section = ctx.request.query.type;

      const validSections = ["bridesMaidDresses", "groomsMenOutfits"];
      if (!validSections.includes(section)) {
        return ctx.badRequest(
          "Validation error - type must be one of bridesMaidDresses, groomsMenOutfits",
          {
            errors: "Invalid section",
          }
        );
      }

      const user = ctx.state.user;

      const weddings = await strapi.documents("api::wedding.wedding").findMany({
        filters: { user },
        populate: {
          [section]: true, // Ensure the section is populated
        },
      });

      const wedding = weddings.length > 0 ? weddings[0] : null;
      if (!wedding) {
        return ctx.notFound("Wedding not found for this user");
      }
      if (!wedding[section]) {
        return ctx.send({
          data: {
            dresses: [],
          },
        });
      }
      return ctx.send({
        data: wedding[section],
        message: "Attire section retrieved successfully",
      });
    } catch (error) {
      console.error("Get Attire Section Error:", error);
      return ctx.internalServerError("Error retrieving attire section");
    }
  },

  async updateAttireSection(ctx) {
    try {
      const section = ctx.request.query.type;

      const validSections = ["bridesMaidDresses", "groomsMenOutfits"];
      if (!validSections.includes(section)) {
        return ctx.badRequest(
          "Validation error - type must be one of bridesMaidDresses, groomsMenOutfits",
          {
            errors: "Invalid section",
          }
        );
      }

      const { error } = createAttireSectionBodySchema.validate(
        ctx.request.body,
        { abortEarly: false }
      );
      if (error) {
        return ctx.badRequest("Validation error", { errors: error.details });
      }

      const user = ctx.state.user;

      const weddings = await strapi.documents("api::wedding.wedding").findMany({
        filters: { user },
        populate: {
          [section]: true, // Ensure the section is populated
          predefinedTasks: true,
        },
      });

      const wedding = weddings.length > 0 ? weddings[0] : null;
      if (!wedding) {
        return ctx.notFound("Wedding not found for this user");
      }
      if (!wedding[section]) {
        return ctx.notFound(
          `Attire section ${section} not found for this wedding`
        );
      }

      const { dresses, accessoriesPurchased } = ctx.request.body;

      // Step 1: Update the attire section
      const updatedAttireSection = await strapi
        .documents("api::attire-section.attire-section")
        .update({
          documentId: wedding[section].documentId,
          data: { accessoriesPurchased, dresses },
        });

      await updateTasks(
        dresses,
        accessoriesPurchased,
        section,
        wedding.predefinedTasks
      );

      return ctx.send({
        updatedAttireSection,
        message: "Attire section updated successfully",
      });
    } catch (error) {
      console.error("Update Attire Section Error:", error);
      return ctx.internalServerError("Error updating attire section");
    }
  },
};

async function updateTasks(dresses, accessoriesPurchased, section, tasks) {
  try {
    let purchased = dresses.length > 0 ? true : false;

    for (let dress of dresses) {
      if (!dress.isPurchased) {
        purchased = false;
        break;
      }
    }

    const [t1, t2, t3] =
      section === "bridesMaidDresses"
        ? [
            TASK_CATEGORIES.chooseBridesmaidDresses,
            TASK_CATEGORIES.bridesmaidDressesOrdered,
            TASK_CATEGORIES.bridesmaidAccesories,
          ]
        : [
            TASK_CATEGORIES.chooseGroomsmanAttire,
            TASK_CATEGORIES.groomsmenOutfitsOrdered,
            TASK_CATEGORIES.groomsmenAccesories,
          ];

    const [choose, ordered, accessories] = tasks.filter(
      (task) => task.name === t1 || task.name === t2 || task.name === t3
    );

    if (dresses && dresses?.length > 0 && !choose.isCompleted) {
      await strapi.documents("api::predefined-task.predefined-task").update({
        documentId: choose.documentId,
        data: {
          isCompleted: true,
        },
      });
    }

    if (purchased !== ordered.isCompleted) {
      await strapi.documents("api::predefined-task.predefined-task").update({
        documentId: ordered.documentId,
        data: {
          isCompleted: purchased,
        },
      });
    }

    if (accessoriesPurchased !== accessories.isCompleted) {
      await strapi.documents("api::predefined-task.predefined-task").update({
        documentId: accessories.documentId,
        data: {
          isCompleted: accessoriesPurchased,
        },
      });
    }
  } catch (err) {
    throw err;
  }
}
