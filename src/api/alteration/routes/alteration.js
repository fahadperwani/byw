'use strict';

module.exports = {
    routes: [
        {
            method: "POST",
            path: "/alteration/get",
            handler: "alteration.getOrCreateAlteration",
            config: {
                auth: false,
                middlewares: ['api::auth.custom-auth'],
                policies: [],
            },
        },
        {
            method: "POST",
            path: "/alteration/item/create",
            handler: "alteration.createAlterationItem",
            config: {
                auth: false,
                middlewares: ['api::auth.custom-auth'],
                policies: [],
            },
        },
        {
            method: "GET",
            path: "/alteration/item/get",
            handler: "alteration.getAlterationItems",
            config: {
                auth: false,
                middlewares: ['api::auth.custom-auth'],
                policies: [],
            },

        },
        {
            method: "PATCH",
            path: "/alteration/update",
            handler: "alteration.updateAlteration",
            config: {
                auth: false,
                middlewares: ['api::auth.custom-auth'],
                policies: [],
            },
        },
        {
            method: "PATCH",
            path: "/alteration/item/update",
            handler: "alteration.updateAlterationItem",
            config: {
                auth: false,
                middlewares: ['api::auth.custom-auth'],
                policies: [],
            },
        },
        {
            method: "PATCH",
            path: "/alteration/item/delete",
            handler: "alteration.deleteAlterationItem",
            config: {
                auth: false,
                middlewares: ['api::auth.custom-auth'],
                policies: [],
            },
        },
        {
            method: "DELETE",
            path: "/alteration/item/delete",
            handler: "alteration.deleteAlterationItem",
            config: {
                auth: false,
                middlewares: ['api::auth.custom-auth'],
                policies: [],
            },
        }
    ]
}