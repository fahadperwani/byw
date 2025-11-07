const Joi = require('joi');
const createAttireSectionBodySchema = Joi.object({
    dresses: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        location: Joi.string().optional().allow(null).allow(''),
        isPurchased: Joi.boolean().optional(),
    })).required(),
    accessoriesPurchased: Joi.boolean().optional().default(false),
});
module.exports = { createAttireSectionBodySchema };