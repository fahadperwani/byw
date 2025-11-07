const Joi = require("joi");

const createVenueBodySchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  address: Joi.string().min(1).max(200).required(),
  indoor: Joi.boolean().required(),
  outdoor: Joi.boolean().required(),
  cost: Joi.number().min(0).required(),
  occupancy: Joi.number().integer().min(1).required(),
  hoursOfUse: Joi.number().required(),
  tables: Joi.number().integer().min(0).required(),
  chairs: Joi.number().integer().min(0).required(),
  linens: Joi.number().required(),
  parking: Joi.boolean().required(),
  soundEquipment: Joi.boolean().required(),
  restrooms: Joi.boolean().required(),
  setupCleanup: Joi.boolean().required(),
  notes: Joi.string().max(500).allow("").optional(),
});

const updateVenueBodySchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  address: Joi.string().min(5).max(200).optional(),
  indoor: Joi.boolean().optional(),
  outdoor: Joi.boolean().optional(),
  cost: Joi.number().min(0).optional(),
  occupancy: Joi.number().integer().min(1).optional(),
  hoursOfUse: Joi.number().optional(),
  tables: Joi.number().integer().min(0).optional(),
  chairs: Joi.number().integer().min(0).optional(),
  linens: Joi.number().optional(),
  parking: Joi.boolean().optional(),
  soundEquipment: Joi.boolean().optional(),
  restrooms: Joi.boolean().optional(),
  setupCleanup: Joi.boolean().optional(),
  notes: Joi.string().max(500).allow("").optional(),
});

const updateVenueItemBodySchema = Joi.object({
  tables: Joi.number().integer().min(0).allow(null).required(),
  chairs: Joi.number().integer().min(0).allow(null).required(),
  tents: Joi.number().integer().min(0).allow(null).required(),
  danceFloor: Joi.boolean().allow(null).required(),
  soundEquipment: Joi.boolean().allow(null).required(),
  restrooms: Joi.boolean().allow(null).required(),
  delegation: Joi.boolean().allow(null).required(),
  notes: Joi.string().max(500).allow("").allow(null).required(),
});

module.exports = {
  createVenueBodySchema,
  updateVenueBodySchema,
  updateVenueItemBodySchema,
};
