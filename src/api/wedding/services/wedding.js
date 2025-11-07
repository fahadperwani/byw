'use strict';

/**
 * wedding service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::wedding.wedding');
