const Joi = require("joi");

const updateMusicAndOtherBodySchema = Joi.object({
  notes: Joi.string().optional().allow(null, ""),
}).or("hireDj", "hireMusician", "notes");

const updateMusicBodySchema = Joi.object({
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

const updatedOthersBodySchema = Joi.object({
  soundSystem: Joi.string()
    .valid(
      "I'm not using a sound system.",
      "Using the Venue's",
      "Renting the equipment",
      "Borrowing the equipment"
    )
    .optional(),
  notes: Joi.string().optional().allow(null, ""),
}).or("soundSystem", "notes");

module.exports = {
  updateMusicBodySchema,
  updatedOthersBodySchema,
  updateMusicAndOtherBodySchema,
};
