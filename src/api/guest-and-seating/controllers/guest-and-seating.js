'use strict';

const { createGuestAndSeatingBodySchema } = require("../validation/guest-and-seating");

module.exports = {
    async createOrGetGuestAndSeating(ctx) {
        try {
            const { error } = createGuestAndSeatingBodySchema.validate(ctx.request.body);
            if (error) {
                return ctx.badRequest('Invalid request body', { errors: error.details.map(detail => detail.message) });
            }

            const user = ctx.state.user;
            const wedding = await strapi.documents('api::wedding.wedding').findFirst({
                filters: { user },
                populate: ['guestAndSeating'],
            });

            if (!wedding) {
                return ctx.notFound('Wedding not found for this user');
            }

            if (wedding.guestAndSeating) {
                return ctx.send(wedding.guestAndSeating);
            }

            const guestAndSeating = await strapi.documents('api::guest-and-seating.guest-and-seating').create({
                status: 'published',
                data: {
                    ...ctx.request.body,
                    wedding: wedding.documentId
                },
            });

            return ctx.send(guestAndSeating);
        } catch (error) {
            console.error("Error creating or getting guest and seating:", error);
            ctx.internalServerError("Error creating or getting guest and seating");
        }
    },

    async updateGuestAndSeating(ctx) {
        try {
            const { error } = createGuestAndSeatingBodySchema.validate(ctx.request.body);
            if (error) {
                return ctx.badRequest('Invalid request body', { errors: error.details.map(detail => detail.message) });
            }

            const user = ctx.state.user;
            const wedding = await strapi.documents('api::wedding.wedding').findFirst({
                filters: { user },
                populate: ['guestAndSeating'],
            });

            if (!wedding) {
                return ctx.notFound('Wedding not found for this user');
            }

            if (!wedding.guestAndSeating) {
                return ctx.notFound('Guest and seating not found for this wedding');
            }

            const guestAndSeating = await strapi.documents('api::guest-and-seating.guest-and-seating').update({
                documentId: wedding.guestAndSeating.documentId,
                data: ctx.request.body,
            });

            return ctx.send(guestAndSeating);
        } catch (error) {
            console.error("Error updating guest and seating:", error);
            ctx.internalServerError("Error updating guest and seating");
        }
    },
}