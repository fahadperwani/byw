"use strict";

module.exports = {
  async getHomeScreen(ctx) {
    try {
      const user = ctx.state.user;
      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
      });

      const screen = await strapi
        .documents("api::home-screen.home-screen")
        .findFirst();

      if (!screen) {
        return ctx.notFound("Home screen not found");
      }

      const budgetTip =
        wedding?.totalBudget <= 6000
          ? screen.budgetLow
          : wedding?.totalBudget <= 12000
            ? screen.budgetMedium
            : screen.budgetHigh;

      return ctx.send({ ...screen, budgetTip });
    } catch (error) {
      strapi.log.error("Error fetching home screen:", error);
      return ctx.internalServerError(
        "An error occurred while fetching home screen"
      );
    }
  },
};
