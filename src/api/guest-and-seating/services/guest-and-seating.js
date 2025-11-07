'use strict';

/**
 * guest-and-seating service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::guest-and-seating.guest-and-seating');
