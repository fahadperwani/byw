"use strict";

const { updateWeddingWeekSchema } = require("../validation/wedding-week.js");

module.exports = {
  // async createOrGetWeddingWeek(ctx) {
  //   try {
  //     const user = ctx.state.user;
  //     console.log("User:", user);
  //     const wedding = await strapi.documents("api::wedding.wedding").findFirst({
  //       filters: { user },
  //       populate: ["weddingWeek"],
  //     });
  //     if (!wedding) {
  //       return ctx.notFound("Wedding not found for the user");
  //     }
  //     if (wedding.weddingWeek) {
  //       return ctx.send(wedding.weddingWeek);
  //     }
  //     const weddingWeek = await strapi
  //       .documents("api::weddding-week.weddding-week")
  //       .create({
  //         status: "published",
  //         data: {
  //           wedding: wedding.documentId,
  //         },
  //       });
  //     return ctx.send(weddingWeek);
  //   } catch (error) {
  //     ctx.internalServerError(error);
  //   }
  // },
  // async updateWeddingWeek(ctx) {
  //   try {
  //     const user = ctx.state.user;
  //     const { error } = updateWeddingWeekSchema.validate(ctx.request.body, {
  //       abortEarly: false,
  //     });
  //     if (error) {
  //       return ctx.badRequest("Validation error", { details: error.details });
  //     }
  //     const wedding = await strapi.documents("api::wedding.wedding").findFirst({
  //       filters: { user },
  //       populate: ["weddingWeek"],
  //     });
  //     if (!wedding) {
  //       return ctx.notFound("Wedding not found for the user");
  //     }
  //     if (!wedding.weddingWeek) {
  //       return ctx.notFound("Wedding week not found for the wedding");
  //     }
  //     const updatedWeddingWeek = await strapi
  //       .documents("api::weddding-week.weddding-week")
  //       .update({
  //         documentId: wedding.weddingWeek.documentId,
  //         data: ctx.request.body,
  //       });
  //     return ctx.send(updatedWeddingWeek);
  //   } catch (error) {
  //     ctx.internalServerError(error);
  //   }
  // },
};
