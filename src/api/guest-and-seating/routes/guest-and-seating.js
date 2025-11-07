'use strict';

module.exports = {
    routes: [
        {
            method: "POST",
            path: "/guest/get",
            handler: "guest-and-seating.createOrGetGuestAndSeating",
            config: {
                auth: false,
                middlewares: ['api::auth.custom-auth'],
                policies: [],
            },
        },
        {
            method: "PATCH",
            path: "/guest/update",
            handler: "guest-and-seating.updateGuestAndSeating",
            config: {
                auth: false,
                middlewares: ['api::auth.custom-auth'],
                policies: [],
            },
        },
    ],
}