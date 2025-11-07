const Joi = require("joi");

const updateWeddingWeekSchema = Joi.object({
  cleanUpSchedule: Joi.boolean(),
  coOrdinatorFound: Joi.boolean(),
  coOrdinatorDetails: Joi.boolean(),
  weddingTimeline: Joi.boolean(),
  scheduleTimeline: Joi.boolean(),
  weddingDay: Joi.boolean(),
  notes: Joi.string().allow(null, ""),
}).or(
  "cleanUpSchedule",
  "coOrdinatorFound",
  "coOrdinatorDetails",
  "weddingTimeline",
  "weddingDay",
  "notes"
);

module.exports = { updateWeddingWeekSchema };
