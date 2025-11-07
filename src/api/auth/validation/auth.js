const Joi = require("joi");

const updateAuthBodySchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  termsAccepted: Joi.boolean().optional(),
}).or("firstName", "lastName", "termsAccepted");

module.exports = { updateAuthBodySchema };
