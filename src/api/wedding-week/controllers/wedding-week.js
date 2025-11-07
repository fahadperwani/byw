"use strict";

module.exports = {
  async getWeddingWeekScreen(ctx) {
    try {
      const screen = await strapi
        .documents("api::wedding-week.wedding-week")
        .findFirst();

      if (!screen) {
        return ctx.notFound("Wedding week screen not found");
      }
      return ctx.send(screen);
    } catch (error) {
      ctx.internalServerError(error);
    }
  },
};
