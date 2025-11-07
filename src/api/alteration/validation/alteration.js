const Joi = require('joi');

const updateAlterationBodySchema = Joi.object({
    scheduled: Joi.boolean().optional(),
    received: Joi.boolean().optional(),
}).or('scheduled', 'received');

const updateAlterationItemBodySchema = Joi.object({
    name: Joi.string().min(3).optional(),
    isAcquired: Joi.boolean().optional(),
}).or('name', 'isAcquired');

module.exports = { updateAlterationBodySchema, updateAlterationItemBodySchema };