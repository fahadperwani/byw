'use strict';

/**
 * task-template service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::task-template.task-template');
