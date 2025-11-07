const Joi = require("joi");

const updateMealBodySchema = Joi.object({
  notes: Joi.string().required(),
}).required();

const updateMenuBodySchema = Joi.object({
  name: Joi.string().required(),
}).required();

const createMenuItemBodySchema = Joi.object({
  name: Joi.string().required(),
  serving: Joi.number().required(),
  isPurchased: Joi.boolean().required(),
  person: Joi.string().required(),
}).required();

const updateMenuItemBodySchema = Joi.object({
  name: Joi.string().optional(),
  serving: Joi.number().optional(),
  isPurchased: Joi.boolean().optional(),
  person: Joi.string().optional(),
}).or("name", "serving", "isPurchased", "person");

module.exports = {
  updateMealBodySchema,
  updateMenuBodySchema,
  createMenuItemBodySchema,
  updateMenuItemBodySchema,
};
