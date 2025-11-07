"use strict";

const {
  updateFloralDecorBodySchema,
  createFloristItemBodySchema,
  updateFloristItemBodySchema,
} = require("../validation/floral-decor");

module.exports = {
  // async getOrCreateFloralDecor(ctx) {
  //     try {
  //         const user = ctx.state.user;
  //         const weddings = await strapi.documents('api::wedding.wedding').findMany({
  //             filters: { user },
  //             populate: ['floralDecor', "floralDecor.floristItems"],
  //         });
  //         const wedding = weddings.length > 0 ? weddings[0] : null;
  //         if (!wedding) {
  //             return ctx.notFound('Wedding not found for this user');
  //         }
  //         const decor = wedding.floralDecor;
  //         if (decor) {
  //             return ctx.send({ message: 'Floral decor retrieved successfully', floralDecor: decor });
  //         }
  //         const floralDecor = await strapi.documents('api::floral-decor.floral-decor').create({
  //             status: 'published',
  //             data: {
  //                 decorDetails: '',
  //                 wedding: wedding.documentId,
  //             },
  //             populate: ['floristItems'],
  //         });
  //         return ctx.send({ message: 'Floral decor created successfully', floralDecor: floralDecor });
  //     } catch (error) {
  //         console.error("Error retrieving or creating floral decor:", error);
  //         ctx.internalServerError("Error retrieving or creating floral decor");
  //     }
  // },
};

const hasFloralDecor = async (user, floralDecorId) => {
  try {
    const weddings = await strapi.documents("api::wedding.wedding").findMany({
      filters: { user },
      populate: ["floralDecor"],
    });
    const wedding = weddings.length > 0 ? weddings[0] : null;
    if (!wedding) {
      return false;
    }
    const decor =
      wedding.floralDecor?.documentId === floralDecorId
        ? wedding.floralDecor
        : null;
    return !!decor;
  } catch (error) {
    console.error("Error checking floral decor:", error);
    return false;
  }
};
