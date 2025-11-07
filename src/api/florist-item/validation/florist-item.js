const Joi = require("joi");

const createFloristItemBodySchema = Joi.object({
  name: Joi.string().min(3).required(),
  quantity: Joi.number().integer().min(0).required(),
  isPurchased: Joi.boolean().optional().default(false),
});

const updateFloristItemBodySchema = Joi.object({
  name: Joi.string().min(3).optional(),
  quantity: Joi.number().integer().min(0).optional(),
  isPurchased: Joi.boolean().optional(),
}).or("name", "quantity");

module.exports = { createFloristItemBodySchema, updateFloristItemBodySchema };
