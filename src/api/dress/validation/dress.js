const Joi = require("joi");

const createDressBodySchema = Joi.object({
    shopName: Joi.string().min(3).max(50).required(),
    shopAddress: Joi.string().min(10).max(100).required(),
    cost: Joi.number().min(0).required(),
    isBridal: Joi.boolean().required(),
    note: Joi.string().max(500).allow("").optional(),
});

const updateDressBodySchema = Joi.object({
    shopName: Joi.string().min(3).max(50).optional(),
    shopAddress: Joi.string().min(10).max(100).optional(),
    cost: Joi.number().min(0).optional(),
    isBridal: Joi.boolean().optional(),
    note: Joi.string().max(500).allow('').optional(),
}).or('shopName', 'shopAddress', 'cost', 'isBridal', 'note');

module.exports = {
    createDressBodySchema,
    updateDressBodySchema,
};