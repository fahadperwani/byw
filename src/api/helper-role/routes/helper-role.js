'use strict';

module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/helper/:type/role/create',
            handler: 'helper-role.createVenueHelperRole',
            config: {
                auth: false,
                middlewares: ['api::auth.custom-auth'],
                policies: [],
            },
        },
        {
            method: 'GET',
            path: '/helper/:type/role/get',
            handler: 'helper-role.getVenueHelperRoles',
            config: {
                auth: false,
                middlewares: ['api::auth.custom-auth'],
                policies: [],
            },
        },
    ],
}
