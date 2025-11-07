const Joi = require("joi");

const createTaskBodySchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  dueDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  deadline: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  category: Joi.string()
    .valid(
      "Wedding Location",
      "Attire",
      "Decorations & Floral",
      "Food",
      "Guest List",
      "Communication",
      "Photography & Videography",
      "Music and Sound",
      "Odds & Ends"
    )
    .required(),
  note: Joi.string().max(500).optional(),
});

const updateTaskBodySchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  dueDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  deadline: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  isCompleted: Joi.boolean().optional(),
  category: Joi.string()
    .valid(
      "Wedding Location",
      "Attire",
      "Floral & Decor",
      "Food",
      "Guests",
      "Communication",
      "Photo & Video",
      "Music",
      "Odds & Ends"
    )
    .optional(),
  note: Joi.string().max(500).optional(),
}).or("name", "dueDate", "deadline", "category", "note", "isCompleted");

module.exports = { createTaskBodySchema, updateTaskBodySchema };
