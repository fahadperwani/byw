"use strict";

const { validatePatch } = require("../validation/odds-and-end");

module.exports = {
  async getOddsAndEnds(ctx) {
    try {
      const user = ctx.state.user;
      const { type } = ctx.query;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
        populate: [
          "oddsEnds",
          "oddsEnds.legal",
          "oddsEnds.official",
          "oddsEnds.miscellaneous",
          "oddsEnds.postWedding",
        ],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found for the user");
      }

      if (!wedding.oddsEnds) {
        return ctx.send({});
      }

      // return ctx.send(wedding.oddsEnds);
      if (type) {
        // Return specific type of odds and ends
        return ctx.send(wedding.oddsEnds[type] || {});
      }

      return ctx.send({});
    } catch (error) {
      ctx.internalServerError(error);
    }
  },

  async createOrUpdateOddsAndEnds(ctx) {
    try {
      const { type } = ctx.query;

      const payload = ctx.request.body || {};

      // Validate payload
      const { error, value } = validatePatch({ type, payload });
      if (error) {
        // Joi error or custom error from validator
        return ctx.badRequest("ValidationError", {
          details: error.message,
        });
      }
      const user = ctx.state.user;

      const weddding = await strapi
        .documents("api::wedding.wedding")
        .findFirst({
          filters: { user },
          populate: ["oddsEnds", "predefinedTasks"],
        });

      if (!weddding) {
        return ctx.notFound("Wedding not found for the user");
      }

      let oddsAndEnds = weddding.oddsEnds;
      if (!oddsAndEnds) {
        oddsAndEnds = await strapi
          .documents("api::odds-and-end.odds-and-end")
          .create({
            status: "published",
            data: {
              wedding: weddding.documentId,
              [type]: value,
              notes: value.notes,
            },
          });

        return ctx.send(oddsAndEnds);
      }

      // Build update payload
      let data = {};

      if (!type) {
        // Only top-level notes
        data.notes = value.notes || oddsAndEnds.notes || "";
      } else {
        // Merge with oddsAndEnds component to avoid wiping unspecified fields
        const current = oddsAndEnds[type] || {};
        // Only allowed keys (validator already enforced it)
        const merged = { ...current, ...value };
        data[type] = merged;
      }

      // Update with Document Service API (Strapi v5)
      const updated = await strapi
        .documents("api::odds-and-end.odds-and-end")
        .update({
          documentId: oddsAndEnds.documentId,
          data,
          populate: ["legal", "miscellaneous", "official", "postWedding"],
        });

      if (!type) return ctx.send({ message: "Notes updated successfully" });

      const names = {
        checkMarriageLicense: "Check on marriage license",
        eventInsurance: "Check on Event Insurance",
        purchaseRings: "Purchase Rings",
        planHoneymoon: "Plan honeymoon",
        retainOfficiant: "Retain officiant",
        partyFavors: "Decide on party favors",
        vows: "Work on vows",
        meetOfficiant: "Meet with offficant",
        dressDecision: "Decide what to do with my dress",
        reminders: "Reminders",
      };

      const [
        checkMarriageLicense,
        eventInsurance,
        retainOfficiant,
        meetOfficiant,
        vows,
        partyFavors,
        purchaseRings,
        planHoneymoon,
        dressDecision,
        reminders,
      ] = weddding.predefinedTasks.filter((task) =>
        Object.values(names).includes(task.name)
      );

      console.log([
        checkMarriageLicense,
        eventInsurance,
        retainOfficiant,
        meetOfficiant,
        vows,
        partyFavors,
        purchaseRings,
        planHoneymoon,
        dressDecision,
        reminders,
      ]);

      const { legal, miscellaneous, official, postWedding } = updated;

      if (
        legal &&
        (legal?.researchLaws && legal?.purchaseLicense) !==
          checkMarriageLicense.isCompleted
      ) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: checkMarriageLicense.documentId,
          data: {
            isCompleted: (legal.researchLaws && legal.purchaseLicense) || false,
          },
        });
      } else if (
        legal &&
        legal?.eventInsurance !== eventInsurance.isCompleted
      ) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: eventInsurance.documentId,
          data: {
            isCompleted: legal.eventInsurance || false,
          },
        });
      } else if (
        official &&
        official?.retainOfficiant !== retainOfficiant.isCompleted
      ) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: retainOfficiant.documentId,
          data: {
            isCompleted: official.retainOfficiant || false,
          },
        });
      } else if (
        official &&
        official?.meetOfficiant !== meetOfficiant?.isCompleted
      ) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: meetOfficiant.documentId,
          data: {
            isCompleted: official.meetOfficiant || false,
          },
        });
      } else if (
        official &&
        (official?.writeVows && official?.researchVows) !== vows.isCompleted
      ) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: vows.documentId,
          data: {
            isCompleted: (official.writeVows && official.researchVows) || false,
          },
        });
      } else if (
        miscellaneous &&
        (miscellaneous?.buyPartyFavors && miscellaneous?.decidePartyFavors) !==
          partyFavors.isCompleted
      ) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: partyFavors.documentId,
          data: {
            isCompleted:
              (miscellaneous.buyPartyFavors &&
                miscellaneous.decidePartyFavors) ||
              false,
          },
        });
      } else if (
        miscellaneous &&
        (miscellaneous?.groomRingPurchased &&
          miscellaneous?.brideRingPurchased) !== purchaseRings.isCompleted
      ) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: purchaseRings.documentId,
          data: {
            isCompleted:
              (miscellaneous.groomRingPurchased &&
                miscellaneous.brideRingPurchased) ||
              false,
          },
        });
      } else if (
        miscellaneous &&
        miscellaneous?.honeymoonPlanned !== planHoneymoon.isCompleted
      ) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: planHoneymoon.documentId,
          data: {
            isCompleted: miscellaneous.honeymoonPlanned || false,
          },
        });
      } else if (
        postWedding &&
        (postWedding?.dressDecision !== null) !== dressDecision.isCompleted
      ) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: dressDecision.documentId,
          data: {
            isCompleted: postWedding.dressDecision !== null || false,
          },
        });
      } else if (
        postWedding &&
        (postWedding?.checkRegistry &&
          postWedding?.checkVenue &&
          postWedding?.returnItems &&
          postWedding?.finish) !== reminders.isCompleted
      ) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: reminders.documentId,
          data: {
            isCompleted:
              (postWedding.checkRegistry &&
                postWedding.checkVenue &&
                postWedding.returnItems &&
                postWedding.finish) ||
              false,
          },
        });
      }

      return ctx.send(updated);
    } catch (error) {
      console.error("Error updating wedding:", error);
      ctx.internalServerError(error);
    }
  },
};
