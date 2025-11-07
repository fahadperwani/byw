"use strict";

module.exports = {
  async getDrawerContent(ctx) {
    try {
      const user = ctx.state.user;

      const { navigation } = ctx.query;

      let drawer = null;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user },
        populate: [
          "selectedVenue",
          "bridalDress",
          "groomOutfit",
          "photographer",
          "videographer",
          "selectedCaterer",
        ],
      });

      if (navigation === "/venue") {
        if (wedding && wedding.selectedVenue) {
          drawer = await strapi.documents("api::advice.advice").findFirst({
            filters: {
              navigation,
              tier: user.isPremium
                ? "conditional (free)"
                : "conditional (premium)",
            },
          });
        }
      }
      if (navigation === "/floral") {
        const subCategories = await strapi
          .documents("api::sub-category.sub-category")
          .findMany({
            filters: {
              category: "Floral & Decor",
              wedding: {
                documentId: wedding.documentId,
              },
            },
            populate: ["tasks"],
          });
        let taskCheck = true;
        for (let sc of subCategories) {
          for (let task of sc.tasks) {
            if (!task.isCompleted) {
              taskCheck = false;
              break;
            }
          }
          if (!taskCheck) break;
        }

        if (taskCheck) {
          drawer = await strapi.documents("api::advice.advice").findFirst({
            filters: {
              navigation,
              tier: user.isPremium
                ? "conditional (premium)"
                : "conditional (free)",
            },
          });
        }
      }
      if (navigation === "/attire") {
        let taskCheck = wedding && wedding.bridalDress && wedding.groomOutfit;

        if (taskCheck) {
          drawer = await strapi.documents("api::advice.advice").findFirst({
            filters: {
              navigation,
              tier: user.isPremium
                ? "conditional (premium)"
                : "conditional (free)",
            },
          });
        }
      }
      if (navigation === "/photoVideo") {
        const sc = await strapi
          .documents("api::sub-category.sub-category")
          .findFirst({
            filters: {
              name: "Videographer",
              wedding: {
                documentId: wedding.documentId,
              },
            },
          });

        if (
          wedding &&
          wedding.photographer &&
          (wedding.videographer || sc.checkBoxValue)
        ) {
          drawer = await strapi.documents("api::advice.advice").findFirst({
            filters: {
              navigation,
              tier: user.isPremium
                ? "conditional (premium)"
                : "conditional (free)",
            },
          });
        }
      }
      if (navigation === "/foodCatering") {
        let taskCheck = wedding && wedding.selectedCaterer != null;

        if (taskCheck) {
          const subCategories = await strapi
            .documents("api::sub-category.sub-category")
            .findMany({
              filters: {
                category: "Food",
                wedding: {
                  documentId: wedding.documentId,
                },
              },
              populate: ["tasks"],
            });

          for (let sc of subCategories) {
            for (let task of sc.tasks) {
              if (!task.isCompleted) {
                taskCheck = false;
                break;
              }
            }
            if (!taskCheck) break;
          }
          if (taskCheck) {
            drawer = await strapi.documents("api::advice.advice").findFirst({
              filters: {
                navigation,
                tier: user.isPremium
                  ? "conditional (premium)"
                  : "conditional (free)",
              },
            });
          }
        }
      }
      if (!drawer)
        drawer = await strapi.documents("api::advice.advice").findFirst({
          filters: {
            navigation,
            tier: user.isPremium ? "premium" : "free",
          },
        });

      const contents = await strapi.documents("api::content.content").findMany({
        filters: {
          navigation,
        },
      });

      const links = await strapi.documents("api::link.link").findMany({
        filters: {
          navigation,
        },
      });

      return ctx.send({
        drawer: drawer || {},
        contents: contents || [],
        links: links || [],
      });
    } catch (error) {
      console.error("Error fetching drawer content:", error);
      return ctx.internalServerError("Error fetching drawer content", {
        error,
      });
    }
  },
};
