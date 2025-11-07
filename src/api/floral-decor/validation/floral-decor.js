const Joi = require('joi');

const updateFloralDecorBodySchema = Joi.object({
    designFloralsDecor: Joi.boolean().optional(),
    orderSupplies: Joi.boolean().optional(),
    constructFloralsDecor: Joi.boolean().optional(),
    decideTableClothNeedds: Joi.boolean().optional(),
    tableClothCare: Joi.boolean().optional(),
    decidedLightings: Joi.boolean().optional(),
    orderLinens: Joi.boolean().optional(),
    orderLighting: Joi.boolean().optional(),
}).or('designFloralsDecor', 'orderSupplies', 'constructFloralsDecor', 'decideTableClothNeedds', 'tableClothCare', 'decidedLightings', 'orderLinens', 'orderLighting');

const createFloristItemBodySchema = Joi.object({
    name: Joi.string().min(3).required(),
    quantity: Joi.number().integer().min(0).required(),
    isPurchased: Joi.boolean().optional().default(false),
});

const updateFloristItemBodySchema = Joi.object({
    name: Joi.string().min(3).optional(),
    quantity: Joi.number().integer().min(0).optional(),
    isPurchased: Joi.boolean().optional(),

}).or('name', 'quantity');

module.exports = { updateFloralDecorBodySchema, createFloristItemBodySchema, updateFloristItemBodySchema };