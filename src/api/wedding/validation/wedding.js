const Joi = require("joi");

const createWeddingBodySchema = Joi.object({
  weddingDay: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  totalBudget: Joi.number().min(0).required(),
  guestCount: Joi.number().integer().min(1).required(),
  priorities: Joi.array()
    .items(
      Joi.string().valid(
        "Food & Catering",
        "Music & Sound",
        "Photography & Videography",
        "Venue",
        "Attire",
        "Decorations",
        "Guests",
        "Other"
      )
    )
    .min(1)
    .max(3)
    .required(),
});

const updateWeddingBodySchema = Joi.object({
  weddingDay: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  totalBudget: Joi.number().min(0).optional(),
  guestCount: Joi.number().integer().min(1).optional(),
  priorities: Joi.array()
    .items(
      Joi.string().valid(
        "Food & Catering",
        "Music & Sound",
        "Photography & Videography",
        "Venue",
        "Attire",
        "Decorations",
        "Guests",
        "Other"
      )
    )
    .min(1)
    .max(3)
    .optional(),
}).or("weddingDay", "budget", "guestCount", "priorities");

const updateSpentBudgetBodySchema = Joi.object({
  venue: Joi.number().integer().min(0).optional(),
  floral: Joi.number().integer().min(0).optional(),
  photo: Joi.number().integer().min(0).optional(),
  attire: Joi.number().integer().min(0).optional(),
  food: Joi.number().integer().min(0).optional(),
  communication: Joi.number().integer().min(0).optional(),
  miscellaneous: Joi.number().integer().min(0).optional(),
}).or(
  "venue",
  "floral",
  "photo",
  "attire",
  "food",
  "communication",
  "miscellaneous"
);

const updatePlaylistBodySchema = Joi.object({
  notes: Joi.string().optional().allow(null, ""),
  preludePlaylist: Joi.boolean().optional().default(false),
  groomEntrance: Joi.boolean().optional().default(false),
  weddingParty: Joi.boolean().optional().default(false),
  brideEntrance: Joi.boolean().optional().default(false),
  specialSong: Joi.boolean().optional().default(false),
  recessionalSong: Joi.boolean().optional().default(false),
  postCeremonyPlaylist: Joi.boolean().optional().default(false),
  entranceSong: Joi.boolean().optional().default(false),
  firstDance: Joi.boolean().optional().default(false),
  fatherDaughter: Joi.boolean().optional().default(false),
  motherSon: Joi.boolean().optional().default(false),
  bgMusic: Joi.boolean().optional().default(false),
  dancingPlaylist: Joi.boolean().optional().default(false),
  sendOffSong: Joi.boolean().optional().default(false),
}).or(
  "notes",
  "preludePlaylist",
  "groomEntrance",
  "weddingParty",
  "brideEntrance",
  "specialSong",
  "recessionalSong",
  "postCeremonyPlaylist",
  "entranceSong",
  "firstDance",
  "fatherDaughter",
  "motherSon",
  "bgMusic",
  "dancingPlaylist",
  "sendOffSong"
);

const updateSoundSystemSchema = Joi.object({
  soundSystem: Joi.string()
    .valid(
      "I'm not using a sound system.",
      "Using the Venue's",
      "Renting the equipment",
      "Borrowing the equipment"
    )
    .optional(), // or .optional() if it's not mandatory
  notes: Joi.string().optional().allow(null, ""),
}).or("soundSystem", "notes");

module.exports = {
  createWeddingBodySchema,
  updateWeddingBodySchema,
  updateSpentBudgetBodySchema,
  updatePlaylistBodySchema,
  updateSoundSystemSchema,
};
