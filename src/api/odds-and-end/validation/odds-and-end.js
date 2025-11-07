"use strict";

const Joi = require("joi");

// Map each component to the boolean fields it allows
const COMPONENTS = {
  legal: ["researchLaws", "purchaseLicense", "eventInsurance"],
  official: ["retainOfficiant", "meetOfficiant", "researchVows", "writeVows"],
  miscellaneous: [
    "decidePartyFavors",
    "buyPartyFavors",
    "brideRingPurchased",
    "groomRingPurchased",
    "honeymoonPlanned",
  ],
  postWedding: [
    "returnItems",
    "checkVenue",
    "checkRegistry",
    "finish",
    "dressDecision", // new field for dress options
  ],
};

const MAIN_KEYS = ["notes", "nameChange", "premaritalCounseling"];

/**
 * Main collection schema:
 * - Accepts any 1, any 2, or all 3 of the allowed keys
 * - Disallows any other keys
 */
const mainCollectionSchema = Joi.object({
  notes: Joi.string().allow("", null),
  nameChange: Joi.boolean(),
  premaritalCounseling: Joi.boolean(),
})
  .or(...MAIN_KEYS)
  .max(MAIN_KEYS.length)
  .unknown(false);

/**
 * Component schema builder:
 * - Only the provided boolean keys + optional notes
 * - Special handling for postWedding's "dressDecision"
 * - Requires at least one key
 * - Disallows any other keys
 */
const componentSchema = (type, booleanKeys) => {
  const schemaShape = booleanKeys.reduce((acc, k) => {
    acc[k] = Joi.boolean();
    return acc;
  }, {});

  // Add notes for all
  schemaShape.notes = Joi.string().allow("", null);

  // Add dressDecision validation only for postWedding
  if (type === "postWedding") {
    schemaShape.dressDecision = Joi.string()
      .valid("Sell my dress", "Donate my dress", "Preserve my dress")
      .allow(null);
  }

  return Joi.object(schemaShape).min(1).unknown(false);
};

/**
 * validatePatch
 */
function validatePatch({ type, payload }) {
  if (!type) {
    const { error, value } = mainCollectionSchema.validate(payload);
    return { error, value };
  }

  if (!Object.prototype.hasOwnProperty.call(COMPONENTS, type)) {
    return {
      error: new Error(
        `Invalid type "${type}". Allowed: ${Object.keys(COMPONENTS).join(", ")}`
      ),
    };
  }

  const { error, value } = componentSchema(type, COMPONENTS[type]).validate(
    payload
  );
  return { error, value };
}

module.exports = {
  validatePatch,
  COMPONENTS,
  mainCollectionSchema,
  componentSchema,
};
