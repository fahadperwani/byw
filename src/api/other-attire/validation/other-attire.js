const Joi = require('joi');

const createOtherAttiresBodySchema = Joi.object({
    childrenDresses: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        isPurchased: Joi.boolean().optional(),
    })).required(),
    otherDresses: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        isPurchased: Joi.boolean().optional(),
    })).required(),
});

module.exports = { createOtherAttiresBodySchema };