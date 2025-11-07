"use strict";

const { TASK_CATEGORIES } = require("../../../utils/tasksConstants");

const {
  createVenueBodySchema,
  updateVenueItemBodySchema,
} = require("../validation/venue");

module.exports = {
  async createVenue(ctx) {
    try {
      console.log(ctx.request.body);
      // Validate the request body
      const { error } = createVenueBodySchema.validate(ctx.request.body, {
        abortEarly: false,
      });
      console.log(error);
      if (error) {
        return ctx.badRequest("Validation error", { errors: error.details });
      }

      const {
        name,
        address,
        indoor,
        outdoor,
        cost,
        occupancy,
        hoursOfUse,
        tables,
        chairs,
        linens,
        parking,
        soundEquipment,
        restrooms,
        setupCleanup,
        notes,
      } = ctx.request.body;

      const user = ctx.state.user;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
        populate: ["venues", "predefinedTasks"],
      });

      if (!wedding) {
        return ctx.badRequest("No wedding found for this user.");
      }

      const isPremium = user.isPremium;

      if (!isPremium && wedding.venues.length > 1) {
        return ctx.badRequest("You need to make a payment to add more venues");
      }

      await strapi.db.transaction(async (transaction) => {
        const venue = await strapi.documents("api::venue.venue").create({
          data: {
            name,
            address,
            indoor,
            outdoor,
            cost,
            occupancy,
            hoursOfUse,
            tables,
            chairs,
            linens,
            parking,
            soundEquipment,
            restrooms,
            setupCleanup,
            notes,
            wedding: wedding.documentId,
          },
          status: "published",
        });

        const [search, pick] = wedding.predefinedTasks.filter((task) => {
          return (
            task.name === TASK_CATEGORIES.searchAndCompareVenues ||
            task.name === TASK_CATEGORIES.chooseAndReserveLocations
          );
        });

        if (!search.isCompleted) {
          await strapi
            .documents("api::predefined-task.predefined-task")
            .update({
              documentId: search.documentId,
              data: { isCompleted: true },
            });
        }

        if (!isPremium) {
          await pickVenue(wedding.documentId, venue.documentId);
          await strapi
            .documents("api::predefined-task.predefined-task")
            .update({
              documentId: pick.documentId,
              data: { isCompleted: true },
            });
        }
      });

      return ctx.created({ message: "Venue created successfully" });
    } catch (error) {
      console.log(error);
      return ctx.internalServerError("1   Error creating venue", { error });
    }
  },

  async getVenues(ctx) {
    try {
      const user = ctx.state.user;

      const weddings = await strapi.documents("api::wedding.wedding").findMany({
        filters: { user },
        populate: ["venues", "selectedVenue"],
      });

      if (weddings.length === 0) {
        return ctx.badRequest("No wedding found for this user.");
      }

      const venues = weddings[0].venues.map((venue) => ({
        ...venue,
        isPicked:
          !!weddings[0].selectedVenue &&
          weddings[0].selectedVenue.documentId === venue.documentId,
      }));
      return ctx.send({ venues });
    } catch (error) {
      return ctx.internalServerError("Error creating venue", { error });
    }
  },

  async pickVenue(ctx) {
    try {
      const { id } = ctx.query;
      if (!id) {
        return ctx.badRequest("Venue ID is required");
      }

      const user = ctx.state.user;
      const weddings = await strapi.documents("api::wedding.wedding").findMany({
        filters: { user },
        populate: ["venues", "selectedVenue", "predefinedTasks"],
      });

      if (weddings.length === 0) {
        return ctx.badRequest("No wedding found for this user.");
      }
      // Check if the wedding already has a selected venue
      const wedding = weddings[0];
      // if (wedding.selectedVenue) {
      //   return ctx.badRequest("Venue already selected for this wedding");
      // }

      // Find the venue with the given ID
      const venue = wedding.venues.find((v) => v.documentId === id);
      if (!venue) {
        return ctx.notFound("Venue not found");
      }

      await strapi.db.transaction(async (transaction) => {
        // Update the wedding with the selected venue
        const updatedWedding = await strapi
          .documents("api::wedding.wedding")
          .update({
            documentId: wedding.documentId,
            data: {
              selectedVenue: venue.documentId,
            },
          });

        const task = wedding.predefinedTasks.find((task) => {
          return task.name === TASK_CATEGORIES.chooseAndReserveLocations;
        });
        if (task && !task.isCompleted) {
          await strapi
            .documents("api::predefined-task.predefined-task")
            .update({
              documentId: task.documentId,
              data: { isCompleted: true },
            });
        }
      });

      return ctx.send({ message: "Venue picked successfully" });
    } catch (error) {}
  },

  async deleteVenue(ctx) {
    try {
      const { id } = ctx.query;
      if (!id) {
        return ctx.badRequest("Venue ID is required");
      }

      const user = ctx.state.user;
      const weddings = await strapi.documents("api::wedding.wedding").findMany({
        filters: { user },
        populate: ["venues", "selectedVenue", "predefinedTasks"],
      });

      if (weddings.length === 0) {
        return ctx.badRequest("No wedding found for this user.");
      }

      const wedding = weddings[0];
      const venueIndex = wedding.venues.findIndex((v) => v.documentId === id);
      if (venueIndex === -1) {
        return ctx.notFound("Venue not found");
      }

      await strapi.db.transaction(async (transaction) => {
        await strapi.documents("api::venue.venue").delete({
          documentId: id,
        });
        const [search, pick] = wedding.predefinedTasks.filter((task) => {
          return (
            task.name === TASK_CATEGORIES.searchAndCompareVenues ||
            task.name === TASK_CATEGORIES.chooseAndReserveLocations
          );
        });
        if (wedding.venues.length === 1) {
          if (search.isCompleted) {
            await strapi
              .documents("api::predefined-task.predefined-task")
              .update({
                documentId: search.documentId,
                data: { isCompleted: false },
              });
          }
        }
        if (wedding.selectedVenue && wedding.selectedVenue.documentId === id) {
          await pickVenue(wedding.documentId, null);
          if (pick.isCompleted) {
            await strapi
              .documents("api::predefined-task.predefined-task")
              .update({
                documentId: pick.documentId,
                data: { isCompleted: false },
              });
          }
        }
      });

      return ctx.send({ message: "Venue deleted successfully" });
    } catch (error) {
      console.error(error);
      return ctx.internalServerError("Error deleting venue", { error });
    }
  },

  async updateVenue(ctx) {
    try {
      const { id } = ctx.query;
      if (!id) {
        return ctx.badRequest("Venue ID is required");
      }

      const user = ctx.state.user;
      const weddings = await strapi.documents("api::wedding.wedding").findMany({
        filters: { user },
        populate: ["venues"],
      });

      if (weddings.length === 0) {
        return ctx.badRequest("No wedding found for this user.");
      }

      const wedding = weddings[0];
      const venueIndex = wedding.venues.findIndex((v) => v.documentId === id);
      if (venueIndex === -1) {
        return ctx.notFound("Venue not found");
      }

      const venue = wedding.venues[venueIndex];

      const {
        name,
        address,
        indoor,
        outdoor,
        cost,
        occupancy,
        hoursOfUse,
        tables,
        chairs,
        linens,
        parking,
        soundEquipment,
        restrooms,
        setupCleanup,
        notes,
      } = ctx.request.body;

      const updatedVenue = await strapi.documents("api::venue.venue").update({
        documentId: id,
        data: {
          name: name || venue.name,
          address: address || venue.address,
          indoor: indoor !== undefined ? indoor : venue.indoor,
          outdoor: outdoor !== undefined ? outdoor : venue.outdoor,
          cost: cost || venue.cost,
          occupancy: occupancy || venue.occupancy,
          hoursOfUse: hoursOfUse || venue.hoursOfUse,
          tables: tables || venue.tables,
          chairs: chairs || venue.chairs,
          linens: linens || venue.linens,
          parking: parking !== undefined ? parking : venue.parking,
          soundEquipment:
            soundEquipment !== undefined
              ? soundEquipment
              : venue.soundEquipment,
          restrooms: restrooms !== undefined ? restrooms : venue.restrooms,
          setupCleanup:
            setupCleanup !== undefined ? setupCleanup : venue.setupCleanup,
          notes: notes || venue.notes,
        },
      });

      return ctx.send({ updatedVenue, message: "Venue updated successfully" });
    } catch (error) {
      console.error(error);
      return ctx.internalServerError("Error updating venue", { error });
    }
  },

  async updateVenueItem(ctx) {
    try {
      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user: ctx.state.user },
        populate: ["venueItems", "predefinedTasks"],
      });

      if (!wedding) {
        return ctx.badRequest("Wedding not found for this user");
      }

      const { error } = updateVenueItemBodySchema.validate(ctx.request.body, {
        abortEarly: false,
      });
      if (error) {
        return ctx.badRequest("Validation error", { errors: error.details });
      }

      await strapi.db.transaction(async (transaction) => {
        await strapi.documents("api::wedding.wedding").update({
          documentId: wedding.documentId,
          data: {
            venueItems: {
              ...wedding.venueItems,
              ...ctx.request.body,
            },
          },
        });

        const {
          tables,
          chairs,
          tents,
          danceFloor,
          soundEquipment,
          restrooms,
          delegation,
          notes,
        } = ctx.request.body;

        if (
          tables &&
          chairs &&
          tents &&
          danceFloor !== undefined &&
          soundEquipment !== undefined &&
          restrooms !== undefined &&
          delegation !== undefined
        ) {
          const task = wedding.predefinedTasks.find(
            (task) =>
              task.name === TASK_CATEGORIES.planAndArrangeVenueEssentials
          );
          if (task && !task.isCompleted) {
            await strapi
              .documents("api::predefined-task.predefined-task")
              .update({
                documentId: task.documentId,
                data: { isCompleted: true },
              });
          }
        }
      });
      return ctx.send({ message: "Venue items updated successfully" });
    } catch (error) {
      console.log(error);
      return ctx.internalServerError("Error updating venue item", { error });
    }
  },

  async getVenueItems(ctx) {
    try {
      const user = ctx.state.user;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
        populate: ["venueItems"],
      });

      if (!wedding) {
        return ctx.badRequest("Wedding not found for this user");
      }

      return ctx.send(wedding.venueItems || {});
    } catch (error) {
      return ctx.internalServerError("Error updating venue item", { error });
    }
  },
};

const pickVenue = (weddingId, venueId) => {
  try {
    return strapi.documents("api::wedding.wedding").update({
      documentId: weddingId,
      data: {
        selectedVenue: venueId,
      },
    });
  } catch (error) {
    console.error(error);
  }
};
