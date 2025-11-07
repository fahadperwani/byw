const Joi = require('joi');

const createGuestAndSeatingBodySchema = Joi.object({
    createGuestList: Joi.boolean().optional().default(false),
    guestsAddedToList: Joi.boolean().optional().default(false),
    finalizeGuestList: Joi.boolean().optional().default(false),
    makeSeatingChart: Joi.boolean().optional().default(false),
    designSeatingChart: Joi.boolean().optional().default(false),
}).or('createGuestList', 'guestsAddedToList', 'finalizeGuestList', 'makeSeatingChart', 'designSeatingChart');

module.exports = { createGuestAndSeatingBodySchema };