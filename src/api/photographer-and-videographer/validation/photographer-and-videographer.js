const Joi = require("joi");

const updateMediaSectionBodySchema = Joi.object({
  areSame: Joi.boolean().optional(),
  notes: Joi.string().optional().allow(null, ""),
}).or("areSame", "notes");

const createPhotographerAndVideographerBodySchema = Joi.object({
  name: Joi.string().required(),
  serviceHours: Joi.number().required(),
  cost: Joi.number().required(),
  notes: Joi.string().optional().allow(null, ""),
});

const updatePhotographerAndVideographerBodySchema = Joi.object({
  name: Joi.string().optional(),
  serviceHours: Joi.number().optional(),
  cost: Joi.number().optional(),
  notes: Joi.string().optional().allow(null, ""),
}).or("name", "serviceHours", "cost", "notes", "isPhotographer");

module.exports = {
  createPhotographerAndVideographerBodySchema,
  updatePhotographerAndVideographerBodySchema,
  updateMediaSectionBodySchema,
};
