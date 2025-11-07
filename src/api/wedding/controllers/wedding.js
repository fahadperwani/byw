"use strict";

const { TASK_CATEGORIES } = require("../../../utils/tasksConstants");

const {
  createWeddingBodySchema,
  updateWeddingBodySchema,
  updateSpentBudgetBodySchema,
  updatePlaylistBodySchema,
  updateSoundSystemSchema,
} = require("../validation/wedding");

module.exports = {
  async createWedding(ctx) {
    try {
      console.log("Create Wedding");
      // Validate the request body
      const { error } = createWeddingBodySchema.validate(ctx.request.body, {
        abortEarly: false,
      });
      if (error) {
        return ctx.badRequest("Validation error", { errors: error.details });
      }

      const { guestCount, totalBudget, weddingDay, priorities } =
        ctx.request.body;
      const user = ctx.state.user;

      // Check if the user already has a wedding
      const existingWedding = await strapi
        .documents("api::wedding.wedding")
        .findFirst({
          filters: { user: user },
        });

      if (existingWedding) {
        return ctx.conflict("This user is already associated with a wedding.");
      }

      await strapi.db.transaction(async (transaction) => {
        // Create the wedding
        const newWedding = await strapi
          .documents("api::wedding.wedding")
          .create({
            status: "published",
            data: {
              weddingDay,
              totalBudget,
              guestCount,
              user,
              priorities,
            },
          });

        console.log(newWedding);

        const budgetBody = calculateBudgetAllocation(totalBudget);

        await strapi.documents("api::budget.budget").create({
          status: "published",
          data: {
            wedding: newWedding,
            total: budgetBody,
          },
        });

        await strapi.documents("plugin::users-permissions.user").update({
          documentId: user.documentId,
          data: { isOnboardingCompleted: true },
        });
      });

      return ctx.created({
        message: "Wedding created successfully",
      });
    } catch (error) {
      console.log(error);
      return ctx.internalServerError(error);
    }
  },

  async getWedding(ctx) {
    try {
      const user = ctx.state.user;

      // Fetch the wedding associated with the user
      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
      });
      if (!wedding) {
        return ctx.notFound("Wedding not found for this user.");
      }

      console.log(wedding);

      return ctx.send(wedding);
    } catch (error) {
      return ctx.internalServerError(error);
    }
  },

  async updateWedding(ctx) {
    try {
      const user = ctx.state.user;
      const { error } = updateWeddingBodySchema.validate(ctx.request.body, {
        abortEarly: false,
      });
      if (error) {
        return ctx.badRequest("Validation error", { errors: error.details });
      }

      // Fetch the wedding associated with the user
      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
        populate: ["budget"],
      });
      if (!wedding || !wedding.budget) {
        return ctx.notFound("Wedding not found for this user.");
      }

      const { guestCount, totalBudget, weddingDay, priorities } =
        ctx.request.body;

      console.log({ guestCount, totalBudget, weddingDay, priorities });

      await strapi.db.transaction(async (transaction) => {
        // Update the wedding
        const updatedWedding = await strapi
          .documents("api::wedding.wedding")
          .update({
            documentId: wedding.documentId,
            data: {
              guestCount: guestCount || wedding.guestCount,
              totalBudget: totalBudget || wedding.totalBudget,
              weddingDay: weddingDay || wedding.weddingDay,
              priorities: priorities || wedding.priorities,
            },
            populate: ["predefinedTasks"],
          });

        // Update the budget
        const budgetBody = calculateBudgetAllocation(
          totalBudget || updatedWedding.totalBudget
        );
        await strapi.documents("api::budget.budget").update({
          documentId: wedding.budget.documentId,
          data: {
            total: budgetBody,
          },
        });

        await strapi
          .service("api::predefined-task.predefined-task")
          .updatePredefinedTasks(updatedWedding);
      });

      return ctx.send({
        message: "Wedding updated successfully",
      });
    } catch (error) {
      console.log(error);
      return ctx.internalServerError(error);
    }
  },

  async getBudget(ctx) {
    try {
      const user = ctx.state.user;

      // Fetch the wedding associated with the user
      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
        populate: ["budget", "budget.total", "budget.spent"],
      });
      console.log(wedding);
      if (!wedding) {
        return ctx.notFound("Wedding not found for this user.");
      }

      return ctx.send(wedding.budget);
    } catch (error) {
      return ctx.internalServerError(error);
    }
  },

  async updateSpent(ctx) {
    try {
      const user = ctx.state.user;
      const { error } = updateSpentBudgetBodySchema.validate(ctx.request.body, {
        abortEarly: false,
      });
      if (error) {
        return ctx.badRequest("Validation error", { errors: error.details });
      }

      // Fetch the wedding associated with the user
      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
        populate: ["budget", "predefinedTasks"],
      });
      if (!wedding || !wedding.budget) {
        return ctx.notFound("Wedding not found for this user.");
      }

      await strapi.documents("api::budget.budget").update({
        documentId: wedding.budget.documentId,
        data: {
          spent: ctx.request.body,
        },
      });

      const task = wedding.predefinedTasks.find(
        (t) => t.name === TASK_CATEGORIES.spendTimeOnBudget
      );

      if (task && !task.isCompleted) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: task.documentId,
          data: {
            isCompleted: true,
          },
        });
      }

      return ctx.send({
        message: "Budget updated successfully",
      });
    } catch (error) {
      return ctx.internalServerError(error);
    }
  },

  async updateCommunication(ctx) {
    try {
      const user = ctx.state.user;
      const { notes } = ctx.request.body;

      if (!notes) {
        return ctx.badRequest("Notes is required");
      }

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
        populate: ["communication"],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found for this user.");
      }

      await strapi.documents("api::wedding.wedding").update({
        documentId: wedding.documentId,
        data: {
          communication: {
            notes,
          },
        },
      });
    } catch (error) {
      console.error("Error updating communication:", error);
      return ctx.internalServerError("Error updating communication");
    }
  },

  async getPlaylists(ctx) {
    try {
      const user = ctx.state.user;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
        populate: ["musicAndSound", "musicAndSound.playlists"],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found for this user.");
      }

      if (!wedding.musicAndSound || !wedding.musicAndSound.playlists) {
        return ctx.send({});
      }

      return ctx.send(wedding?.musicAndSound?.playlists);
    } catch (error) {
      console.log(error);
      return ctx.internalServerError(error);
    }
  },

  async updatePlaylist(ctx) {
    try {
      const user = ctx.state.user;

      const { error } = updatePlaylistBodySchema.validate(ctx.request.body, {
        abortEarly: false,
      });
      if (error) {
        return ctx.badRequest("Validation error", { errors: error.details });
      }

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
        populate: ["musicAndSound", "predefinedTasks"],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found for this user.");
      }

      const updatedWedding = await strapi
        .documents("api::wedding.wedding")
        .update({
          documentId: wedding.documentId,
          data: {
            musicAndSound: {
              playlists: ctx.request.body,
            },
          },
          populate: ["musicAndSound", "musicAndSound.playlists"],
        });

      const { playlists } = updatedWedding.musicAndSound;

      // Default assumption
      let allTrue = true;

      for (const [key, value] of Object.entries(playlists)) {
        if (typeof value === "boolean" && value === false) {
          allTrue = false;
          break; // no need to check further
        }
      }
      const [t1, t2] = wedding.predefinedTasks.filter(
        (task) =>
          task.name === TASK_CATEGORIES.decideMusic ||
          task.name === TASK_CATEGORIES.createPlaylists
      );

      if (allTrue !== t1.isCompleted) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: t1.documentId,
          data: {
            isCompleted: allTrue,
          },
        });
        if (!t1.isCompleted) {
        }

        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: t2.documentId,
          data: {
            isCompleted: allTrue,
          },
        });
      }

      return ctx.send({ message: "Playlists updated successfully" });
    } catch (error) {
      return ctx.internalServerError(error);
    }
  },

  async getSound(ctx) {
    try {
      const user = ctx.state.user;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
        populate: ["musicAndSound", "musicAndSound.sound"],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found for this user.");
      }

      return ctx.send(wedding?.musicAndSound?.sound || {});
    } catch (error) {
      console.log(error);
      return ctx.internalServerError(error);
    }
  },

  async updateSound(ctx) {
    try {
      const user = ctx.state.user;

      const { error } = updateSoundSystemSchema.validate(ctx.request.body, {
        abortEarly: false,
      });
      if (error) {
        return ctx.badRequest("Validation error", { errors: error.details });
      }

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
        populate: ["musicAndSound", "predefinedTasks"],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found for this user.");
      }

      const updatedWedding = await strapi
        .documents("api::wedding.wedding")
        .update({
          documentId: wedding.documentId,
          data: {
            musicAndSound: {
              sound: ctx.request.body,
            },
          },
          populate: ["musicAndSound", "musicAndSound.sound"],
        });

      const task = wedding.predefinedTasks.find(
        (task) => task.name === TASK_CATEGORIES.findSoundSystem
      );

      const hasSoundSystem = !!(
        updatedWedding.musicAndSound.sound &&
        updatedWedding.musicAndSound.sound.soundSystem
      );

      if (hasSoundSystem !== task.isCompleted) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: task.documentId,
          data: {
            isCompleted:
              updatedWedding.musicAndSound.sound.soundSystem !== null,
          },
        });
      }

      return ctx.send({ message: "Sound updated successfully" });
    } catch (error) {
      return ctx.internalServerError(error);
    }
  },

  async updateNotes(ctx) {
    try {
      const { notes } = ctx.request.body;

      if (!notes) {
        return ctx.badRequest("Notes is required");
      }

      const type = ctx.query.category;

      const map = {
        Music: "musicAndSound",
        Communication: "communication",
        photoVideo: "mediaSection",
        weddingWeek: "weddingWeek",
      };

      if (Object.keys(map).includes(type) === false) {
        return ctx.badRequest("Invalid type");
      }

      const user = ctx.state.user;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found for this user.");
      }

      await strapi.documents("api::wedding.wedding").update({
        documentId: wedding.documentId,
        data: {
          [map[type]]: {
            notes,
          },
        },
      });

      return ctx.send({ message: "Notes updated successfully" });
    } catch (error) {
      return ctx.internalServerError(error);
    }
  },

  // async getAttireInfo(ctx) {
  //   try {
  //     const user = ctx.state.user;

  //     // Fetch the wedding associated with the user
  //     const wedding = await strapi.documents("api::wedding.wedding").findFirst({
  //       filters: { user },
  //       populate: [
  //         "dresses",
  //         "groomOutfit",
  //         "bridalDress",
  //         "otherAttires",
  //         "bridesMaidDresses",
  //         "groomsMenOutfits",
  //         "bridalDress.alteration",
  //         "groomOutfit.alteration",
  //         "bridalDress.alteration.items",
  //         "groomOutfit.alteration.items",
  //       ],
  //     });
  //     if (!wedding) {
  //       return ctx.notFound("Wedding not found for this user.");
  //     }

  //     const bridal = {
  //       searchForDress: wedding.bridalDress
  //         ? true
  //         : wedding.dresses?.findIndex((dress) => dress.isBridal) !== -1
  //           ? true
  //           : false,
  //       chooseDress: wedding.bridalDress ? true : false,
  //       alterations: wedding.bridalDress?.alteration ? true : false,
  //       otherClothing:
  //         wedding.bridalDress?.alteration?.items &&
  //         wedding.bridalDress.alteration.items.length > 0
  //           ? true
  //           : false,
  //       dressId: wedding.bridalDress?.documentId,
  //     };

  //     const groom = {
  //       searchForDress: wedding.groomOutfit
  //         ? true
  //         : wedding.dresses?.findIndex((dress) => !dress.isBridal) !== -1
  //           ? true
  //           : false,
  //       chooseDress: wedding.groomOutfit ? true : false,
  //       alterations: wedding.groomOutfit?.alteration ? true : false,
  //       otherClothing:
  //         wedding.groomOutfit?.alteration?.items &&
  //         wedding.groomOutfit.alteration.items.length > 0
  //           ? true
  //           : false,
  //       dressId: wedding.groomOutfit?.documentId,
  //     };

  //     const bridesMaids = {
  //       chooseOutfits:
  //         wedding.bridesMaidDresses &&
  //         wedding.bridesMaidDresses?.dresses &&
  //         wedding.bridesMaidDresses.dresses["length"] &&
  //         wedding.bridesMaidDresses.dresses["length"] > 0
  //           ? true
  //           : false,
  //       outfitsPurchased:
  //         wedding.bridesMaidDresses &&
  //         // @ts-ignore
  //         wedding.bridesMaidDresses?.dresses?.findIndex(
  //           (dress) => dress.isPurchased
  //         ) !== -1
  //           ? true
  //           : false,
  //       accessories:
  //         wedding.bridesMaidDresses &&
  //         wedding.bridesMaidDresses?.accessoriesPurchased,
  //     };

  //     const groomsMen = {
  //       chooseOutfits:
  //         wedding.groomsMenOutfits &&
  //         wedding.groomsMenOutfits?.dresses &&
  //         wedding.groomsMenOutfits?.dresses["length"] &&
  //         wedding.groomsMenOutfits.dresses["length"] > 0
  //           ? true
  //           : false,
  //       outfitsPurchased:
  //         wedding.groomsMenOutfits &&
  //         // @ts-ignore
  //         wedding.groomsMenOutfits?.dresses?.findIndex(
  //           (outfit) => outfit.isPurchased
  //         ) !== -1
  //           ? true
  //           : false,
  //       accessories:
  //         wedding.groomsMenOutfits &&
  //         wedding.groomsMenOutfits?.accessoriesPurchased,
  //     };

  //     const otherAttire = {
  //       childrenDresses:
  //         wedding.otherAttires &&
  //         wedding.otherAttires.childrenDresses &&
  //         wedding.otherAttires.childrenDresses["length"] > 0
  //           ? true
  //           : false,
  //       otherDresses:
  //         wedding.otherAttires &&
  //         wedding.otherAttires.otherDresses &&
  //         wedding.otherAttires.otherDresses["length"] > 0
  //           ? true
  //           : false,
  //     };

  //     return ctx.send({
  //       bridal,
  //       groom,
  //       bridesMaids,
  //       groomsMen,
  //       otherAttire,
  //       message: "Attire info retrieved successfully",
  //     });
  //   } catch (error) {
  //     console.error("Error retrieving attire info:", error);
  //     return ctx.internalServerError("Error retrieving attire info");
  //   }
  // },

  // async getVenueInfo(ctx) {
  //   try {
  //     const user = ctx.state.user;

  //     const wedding = await strapi.documents("api::wedding.wedding").findFirst({
  //       filters: { user },
  //       populate: ["venues", "selectedVenue"],
  //     });

  //     if (!wedding) {
  //       return ctx.notFound("Wedding not found for this user.");
  //     }

  //     const venue = {
  //       searchForVenue:
  //         wedding.venues && wedding.venues.length > 0 ? true : false,
  //       decidedVenue: wedding.selectedVenue ? true : false,
  //       venueEssentials: false,
  //       venueId: wedding.selectedVenue
  //         ? wedding.selectedVenue.documentId
  //         : null,
  //     };

  //     return ctx.send(venue);
  //   } catch (error) {
  //     console.error("Error retrieving venue info:", error);
  //     return ctx.internalServerError("Error retrieving venue info");
  //   }
  // },

  // async getFoodInfo(ctx) {
  //   try {
  //     const wedding = await strapi.documents("api::wedding.wedding").findFirst({
  //       filters: { user: ctx.state.user },
  //       populate: [
  //         "helpers",
  //         "selectedCaterer",
  //         "mealSection",
  //         "dessertSection",
  //         "mealSection.menus",
  //         "dessertSection.menus",
  //         "dessertSection.menus.items",
  //         "mealSection.menus.items",
  //         "mealSection.items",
  //       ],
  //     });

  //     let meal = {
  //       decidedMenus: wedding.mealSection?.menus?.length > 0 ? true : false,
  //       // @ts-ignore
  //       menuItems: false,
  //       itemPurchased:
  //         wedding.mealSection?.items?.length > 0 &&
  //         wedding.mealSection?.items?.findIndex((item) => !item.isPurchased) ===
  //           -1,
  //       foodScheduled: wedding.mealSection?.foodScheduled,
  //     };

  //     for (let menu of wedding.mealSection?.menus || []) {
  //       if (menu?.items?.length > 0) {
  //         meal.menuItems = true;
  //         break;
  //       }
  //     }

  //     let desserts = {
  //       decidedMenus: wedding.dessertSection?.menus?.length > 0 ? true : false,
  //       dessert: false,
  //       beverages: false,
  //     };

  //     for (let menu of wedding.dessertSection?.menus || []) {
  //       if (menu?.items?.length <= 0) continue;
  //       for (let item of menu.items) {
  //         if (!item.isPurchased) {
  //           desserts[menu.name] = false;
  //           break;
  //         }
  //       }
  //       desserts[menu.name] = true;
  //     }

  //     let caterers = {
  //       compareCaterers:
  //         wedding.helpers?.filter((helper) => helper.type === "caterer")
  //           .length > 0
  //           ? true
  //           : false,
  //       chooseCaterer: wedding.selectedCaterer ? true : false,
  //     };

  //     return ctx.send({
  //       meal,
  //       desserts,
  //       caterers,
  //       message: "Food info retrieved successfully",
  //     });
  //   } catch (error) {
  //     console.error("Error retrieving food info:", error);
  //     return ctx.internalServerError("Error retrieving food info");
  //   }
  // },
};

function calculateBudgetAllocation(totalBudget) {
  // Budget ranges and their corresponding percentages from the spreadsheet
  const budgetRanges = [
    {
      max: 375,
      location: 26,
      floral: 13,
      attire: 26,
      photo: 0,
      food: 25,
      communication: 0,
      miscellaneous: 10,
    },
    {
      max: 750,
      location: 25,
      floral: 12,
      attire: 26,
      photo: 0,
      food: 23,
      communication: 0,
      miscellaneous: 14,
    },
    {
      max: 1000,
      location: 24,
      floral: 11,
      attire: 23,
      photo: 8,
      food: 21,
      communication: 0,
      miscellaneous: 13,
    },
    {
      max: 1500,
      location: 22,
      floral: 10,
      attire: 17,
      photo: 10,
      food: 19,
      communication: 3,
      miscellaneous: 19,
    },
    {
      max: 2000,
      location: 20,
      floral: 10,
      attire: 17,
      photo: 13,
      food: 19,
      communication: 3,
      miscellaneous: 18,
    },
    {
      max: 3000,
      location: 20,
      floral: 10,
      attire: 17,
      photo: 15,
      food: 19,
      communication: 3,
      miscellaneous: 16,
    },
    {
      max: 4000,
      location: 20,
      floral: 10,
      attire: 17,
      photo: 18,
      food: 19,
      communication: 5,
      miscellaneous: 11,
    },
    {
      max: 5000,
      location: 20,
      floral: 10,
      attire: 16,
      photo: 20,
      food: 19,
      communication: 5,
      miscellaneous: 10,
    },
    {
      max: 6000,
      location: 21,
      floral: 8,
      attire: 15,
      photo: 21,
      food: 19,
      communication: 5,
      miscellaneous: 11,
    },
    {
      max: 7000,
      location: 21,
      floral: 8,
      attire: 14,
      photo: 21,
      food: 19,
      communication: 5,
      miscellaneous: 12,
    },
    {
      max: 8000,
      location: 22,
      floral: 7,
      attire: 14,
      photo: 22,
      food: 19,
      communication: 5,
      miscellaneous: 11,
    },
    {
      max: 10000,
      location: 25,
      floral: 7,
      attire: 14,
      photo: 22,
      food: 19,
      communication: 4,
      miscellaneous: 9,
    },
    {
      max: 12000,
      location: 25,
      floral: 6,
      attire: 14,
      photo: 22,
      food: 19,
      communication: 3,
      miscellaneous: 11,
    },
    {
      max: 15000,
      location: 27,
      floral: 6,
      attire: 14,
      photo: 22,
      food: 19,
      communication: 3,
      miscellaneous: 9,
    },
    {
      max: 18000,
      location: 28,
      floral: 6,
      attire: 14,
      photo: 22,
      food: 19,
      communication: 3,
      miscellaneous: 8,
    },
    {
      max: Infinity,
      location: 29,
      floral: 6,
      attire: 14,
      photo: 22,
      food: 19,
      communication: 3,
      miscellaneous: 7,
    },
  ];

  // Find the appropriate budget range
  const range = budgetRanges.find((r) => totalBudget <= r.max);

  if (!range) {
    throw new Error("Invalid budget amount");
  }

  // Calculate allocations using exact category names from spreadsheet
  const venue = Math.round((totalBudget * range.location) / 100);
  const floral = Math.round((totalBudget * range.floral) / 100);
  const attire = Math.round((totalBudget * range.attire) / 100);
  const photo = Math.round((totalBudget * range.photo) / 100);
  const food = Math.round((totalBudget * range.food) / 100);
  const communication = Math.round((totalBudget * range.communication) / 100);
  const miscellaneous = Math.round((totalBudget * range.miscellaneous) / 100);

  return {
    venue,
    floral,
    attire,
    photo,
    food,
    communication,
    miscellaneous,
  };
}
