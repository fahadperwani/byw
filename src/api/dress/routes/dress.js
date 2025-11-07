'use strict';

module.exports = {
    routes: [
        {
            method: "POST",
            path: "/dress/create",
            handler: "dress.createDress",
            config: {
                auth: false,
                middlewares: ['api::auth.custom-auth'],
                policies: [],
            },
        },
        {
            "method": "GET",
            "path": "/dress/get",
            "handler": "dress.getDresses",
            "config": {
                auth: false,
                middlewares: ['api::auth.custom-auth'],
                policies: [],
            }
        },
        {
            "method": "PATCH",
            "path": "/dress/pick",
            "handler": "dress.pickDress",
            "config": {
                auth: false,
                middlewares: ['api::auth.custom-auth'],
                policies: [],
            }
        },
        {
            "method": "PATCH",
            "path": "/dress/update",
            "handler": "dress.updateDress",
            "config": {
                auth: false,
                middlewares: ['api::auth.custom-auth'],
                policies: [],
            }
        },
        {
            "method": "DELETE",
            "path": "/dress/delete",
            "handler": "dress.deleteDress",
            "config": {
                auth: false,
                middlewares: ['api::auth.custom-auth'],
                policies: [],
            }
        },
    ],
}
