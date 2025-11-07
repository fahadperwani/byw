"use strict";

const { TASK_CATEGORIES } = require("../../../utils/tasksConstants");

const {
  createPhotographerAndVideographerBodySchema,
  updatePhotographerAndVideographerBodySchema,
  updateMediaSectionBodySchema,
} = require("../validation/photographer-and-videographer");

module.exports = {
  // async createOrGetSection(ctx) {
  //   try {
  //     const user = ctx.state.user;
  //     const wedding = await strapi.documents("api::wedding.wedding").findFirst({
  //       filters: {
  //         user,
  //       },
  //       populate: [
  //         "mediaSection",
  //         "mediaSection.persons",
  //         "mediaSection.photographer",
  //         "mediaSection.videographer",
  //       ],
  //     });
  //     if (!wedding) {
  //       return ctx.notFound("Wedding not found");
  //     }
  //     if (wedding.mediaSection) {
  //       const comparePhotographer =
  //         wedding.mediaSection.persons &&
  //         wedding.mediaSection.persons.find((p) => p.isPhotographer === true);
  //       const pickPhotographer = wedding.mediaSection.photographer?.documentId
  //         ? true
  //         : false;
  //       const compareVideographer = wedding.mediaSection.areSame
  //         ? comparePhotographer
  //         : wedding.mediaSection.persons &&
  //           wedding.mediaSection.persons.find(
  //             (p) => p.isPhotographer === false
  //           );
  //       const pickVideographer = wedding.mediaSection.areSame
  //         ? pickPhotographer
  //         : wedding.mediaSection.videographer?.documentId
  //           ? true
  //           : false;
  //       return ctx.send({
  //         message: "Media section already exists",
  //         photographer: {
  //           pickPhotographer,
  //           comparePhotographer: comparePhotographer ? true : false,
  //         },
  //         videographer: {
  //           pickVideographer,
  //           compareVideographer: compareVideographer ? true : false,
  //         },
  //         areSame: wedding.mediaSection.areSame || false,
  //         notes: wedding.mediaSection.notes || "",
  //       });
  //     }
  //     // If media section does not exist, create a new one
  //     const newMediaSection = await strapi
  //       .documents(
  //         "api::photographer-and-videographer.photographer-and-videographer"
  //       )
  //       .create({
  //         status: "published",
  //         data: {
  //           wedding: wedding.documentId,
  //         },
  //       });
  //     return ctx.send({
  //       message: "Media section created successfully",
  //       photographer: {
  //         pickPhotographer: false,
  //         comparePhotographer: false,
  //       },
  //       videographer: {
  //         pickVideographer: false,
  //         compareVideographer: false,
  //       },
  //       shotList: false,
  //       areSame: false,
  //       notes: "",
  //     });
  //   } catch (error) {
  //     ctx.internalServerError("Internal Server Error");
  //   }
  // },
  // async updateSection(ctx) {
  //   try {
  //     const user = ctx.state.user;
  //     const { error } = updateMediaSectionBodySchema.validate(
  //       ctx.request.body,
  //       { abortEarly: false }
  //     );
  //     if (error) {
  //       return ctx.badRequest(error.details[0].message);
  //     }
  //     const wedding = await strapi.documents("api::wedding.wedding").findFirst({
  //       filters: {
  //         user,
  //       },
  //       populate: ["mediaSection"],
  //     });
  //     if (!wedding) {
  //       return ctx.notFound("Wedding not found");
  //     }
  //     if (!wedding.mediaSection) {
  //       return ctx.badRequest("Media section does not exist");
  //     }
  //     const updatedMediaSection = await strapi
  //       .documents(
  //         "api::photographer-and-videographer.photographer-and-videographer"
  //       )
  //       .update({
  //         documentId: wedding.mediaSection.documentId,
  //         data: ctx.request.body,
  //       });
  //     return ctx.send({
  //       documentId: updatedMediaSection.documentId,
  //       message: "Media section updated successfully",
  //     });
  //   } catch (error) {
  //     ctx.internalServerError("Internal Server Error");
  //   }
  // },
  // async createMediaPerson(ctx) {
  //   try {
  //     const user = ctx.state.user;
  //     const { error } = createPhotographerAndVideographerBodySchema.validate(
  //       ctx.request.body,
  //       { abortEarly: false }
  //     );
  //     if (error) {
  //       return ctx.badRequest(error.details[0].message);
  //     }
  //     const { type } = ctx.request.params;
  //     if (type !== "photographer" && type !== "videographer") {
  //       return ctx.badRequest(
  //         "Invalid type. Must be 'photographer' or 'videographer'."
  //       );
  //     }
  //     const wedding = await strapi.documents("api::wedding.wedding").findFirst({
  //       filters: {
  //         user,
  //       },
  //       populate: ["predefinedTasks"],
  //     });
  //     if (!wedding) {
  //       return ctx.notFound("Wedding not found");
  //     }
  //     if (!wedding.mediaSection) {
  //       return ctx.badRequest("Media section does not exist");
  //     }
  //     const isPhotographer = wedding.mediaSection.areSame
  //       ? true
  //       : type === "photographer";
  //     const newMediaPerson = await strapi
  //       .documents(
  //         "api::photographer-or-videographer.photographer-or-videographer"
  //       )
  //       .create({
  //         status: "published",
  //         data: {
  //           ...ctx.request.body,
  //           section: wedding.mediaSection.documentId,
  //           isPhotographer,
  //         },
  //       });
  //     const [n1, n2] = isPhotographer
  //       ? [
  //           TASK_CATEGORIES.comparePhotographers,
  //           TASK_CATEGORIES.choosePhotographer,
  //         ]
  //       : [
  //           TASK_CATEGORIES.compareVideographers,
  //           TASK_CATEGORIES.chooseVideographer,
  //         ];
  //     const [compare, choose] = wedding.predefinedTasks.filter(
  //       (t) => t.name === n1 || t.name === n2
  //     );
  //     if (compare && !compare.isCompleted) {
  //       await strapi.documents("api::predefined-task.predefined-task").update({
  //         documentId: compare.documentId,
  //         data: {
  //           isCompleted: true,
  //         },
  //       });
  //     }
  //     if (!user.payment) {
  //       await strapi
  //         .documents(
  //           "api::photographer-and-videographer.photographer-and-videographer"
  //         )
  //         .update({
  //           documentId: wedding.mediaSection.documentId,
  //           data: {
  //             [type]: newMediaPerson.documentId,
  //           },
  //         });
  //       if (choose && !choose.isCompleted) {
  //         await strapi
  //           .documents("api::predefined-task.predefined-task")
  //           .update({
  //             documentId: choose.documentId,
  //             data: {
  //               isCompleted: true,
  //             },
  //           });
  //       }
  //     }
  //     return ctx.send(newMediaPerson);
  //   } catch (error) {
  //     ctx.internalServerError("Internal Server Error");
  //   }
  // },
  // async getMediaPersons(ctx) {
  //   try {
  //     const user = ctx.state.user;
  //     const { type } = ctx.request.params;
  //     const { id } = ctx.query;
  //     if (type !== "photographer" && type !== "videographer") {
  //       return ctx.badRequest("Invalid type");
  //     }
  //     const wedding = await strapi.documents("api::wedding.wedding").findFirst({
  //       filters: {
  //         user,
  //       },
  //       populate: [
  //         "mediaSection",
  //         "mediaSection.persons",
  //         `mediaSection.${type}`,
  //       ],
  //     });
  //     if (!wedding) {
  //       return ctx.notFound("Wedding not found");
  //     }
  //     if (!wedding.mediaSection) {
  //       return ctx.badRequest("Media section does not exist");
  //     }
  //     const isPhotographer = wedding.mediaSection.areSame
  //       ? true
  //       : type === "photographer";
  //     const filteredPersons = wedding.mediaSection.persons?.filter(
  //       (p) =>
  //         p.isPhotographer === isPhotographer &&
  //         (id ? p.documentId === id : true)
  //     );
  //     const persons = filteredPersons?.map((p) => ({
  //       ...p,
  //       isPicked: p.documentId === wedding.mediaSection[type]?.documentId,
  //     }));
  //     return ctx.send({ creators: persons || [] });
  //   } catch (error) {
  //     ctx.internalServerError("Internal Server Error");
  //   }
  // },
  // async updateMediaPerson(ctx) {
  //   try {
  //     const user = ctx.state.user;
  //     const { id } = ctx.query;
  //     const { type } = ctx.request.params;
  //     const { error } = updatePhotographerAndVideographerBodySchema.validate(
  //       ctx.request.body,
  //       { abortEarly: false }
  //     );
  //     if (error) {
  //       return ctx.badRequest(error.details[0].message);
  //     }
  //     const wedding = await strapi.documents("api::wedding.wedding").findFirst({
  //       filters: {
  //         user,
  //       },
  //       populate: ["mediaSection", "mediaSection.persons"],
  //     });
  //     if (!wedding) {
  //       return ctx.notFound("Wedding not found");
  //     }
  //     if (!wedding.mediaSection) {
  //       return ctx.badRequest("Media section does not exist");
  //     }
  //     const isPhotographer = wedding.mediaSection.areSame
  //       ? true
  //       : type === "photographer";
  //     const person = wedding.mediaSection.persons?.find(
  //       (p) => p.documentId === id && p.isPhotographer === isPhotographer
  //     );
  //     if (!person) {
  //       return ctx.notFound("Media person not found");
  //     }
  //     await strapi
  //       .documents(
  //         "api::photographer-or-videographer.photographer-or-videographer"
  //       )
  //       .update({
  //         documentId: person.documentId,
  //         data: ctx.request.body,
  //       });
  //     return ctx.send({
  //       message: "Media person updated successfully",
  //       documentId: person.documentId,
  //     });
  //   } catch (error) {
  //     ctx.internalServerError("Internal Server Error");
  //   }
  // },
  // async deleteMediaPerson(ctx) {
  //   try {
  //     const user = ctx.state.user;
  //     const { id } = ctx.query;
  //     const { type } = ctx.request.params;
  //     const wedding = await strapi.documents("api::wedding.wedding").findFirst({
  //       filters: {
  //         user,
  //       },
  //       populate: [
  //         "mediaSection",
  //         "mediaSection.persons",
  //         "predefinedTasks",
  //         `mediaSection.${type}`,
  //       ],
  //     });
  //     if (!wedding) {
  //       return ctx.notFound("Wedding not found");
  //     }
  //     if (!wedding.mediaSection) {
  //       return ctx.badRequest("Media section does not exist");
  //     }
  //     const isPhotographer = wedding.mediaSection.areSame
  //       ? true
  //       : type === "photographer";
  //     const person = wedding.mediaSection.persons?.find(
  //       (p) => p.documentId === id && p.isPhotographer === isPhotographer
  //     );
  //     if (!person) {
  //       return ctx.notFound("Media person not found");
  //     }
  //     await strapi
  //       .documents(
  //         "api::photographer-or-videographer.photographer-or-videographer"
  //       )
  //       .delete({
  //         documentId: person.documentId,
  //       });
  //     const [n1, n2] = isPhotographer
  //       ? [
  //           TASK_CATEGORIES.comparePhotographers,
  //           TASK_CATEGORIES.choosePhotographers,
  //         ]
  //       : [
  //           TASK_CATEGORIES.compareVideographers,
  //           TASK_CATEGORIES.chooseVideographers,
  //         ];
  //     const [compare, choose] = wedding.predefinedTasks?.filter(
  //       (t) => t.category === n1 || t.category === n2
  //     );
  //     const persons = wedding.mediaSection.persons;
  //     if (persons.length === 1) {
  //       await strapi.documents("api::predefined-task.predefined-task").update({
  //         documentId: compare.documentId,
  //         data: {
  //           isCompleted: false,
  //         },
  //       });
  //     }
  //     if (wedding.mediaSection[type]?.documentId === person.documentId) {
  //       await strapi.documents("api::predefined-task.predefined-task").update({
  //         documentId: choose.documentId,
  //         data: {
  //           isCompleted: false,
  //         },
  //       });
  //     }
  //     return ctx.send({
  //       message: "Media person deleted successfully",
  //       documentId: person.documentId,
  //     });
  //   } catch (error) {
  //     ctx.internalServerError("Internal Server Error");
  //   }
  // },
  // async pickMediaPerson(ctx) {
  //   try {
  //     const { id } = ctx.query;
  //     const { type } = ctx.request.params;
  //     if (type !== "photographer" && type !== "videographer") {
  //       return ctx.badRequest(
  //         "Invalid type. Must be 'photographer' or 'videographer'."
  //       );
  //     }
  //     const user = ctx.state.user;
  //     const wedding = await strapi.documents("api::wedding.wedding").findFirst({
  //       filters: {
  //         user,
  //       },
  //       populate: [
  //         "mediaSection",
  //         "mediaSection.persons",
  //         `mediaSection.${type}`,
  //         "predefinedTasks",
  //       ],
  //     });
  //     if (!wedding) {
  //       return ctx.notFound("Wedding not found");
  //     }
  //     if (!wedding.mediaSection) {
  //       return ctx.badRequest("Media section does not exist");
  //     }
  //     if (wedding.mediaSection[type]) {
  //       return ctx.badRequest(`${type} already picked`);
  //     }
  //     const isPhotographer = wedding.mediaSection.areSame
  //       ? true
  //       : type === "photographer";
  //     const person = wedding.mediaSection.persons?.find(
  //       (p) => p.documentId === id && p.isPhotographer === isPhotographer
  //     );
  //     if (!person) {
  //       return ctx.notFound("Media person not found");
  //     }
  //     await strapi
  //       .documents(
  //         "api::photographer-and-videographer.photographer-and-videographer"
  //       )
  //       .update({
  //         documentId: wedding.mediaSection.documentId,
  //         data: {
  //           [type]: person.documentId,
  //         },
  //       });
  //     const name = isPhotographer
  //       ? TASK_CATEGORIES.choosePhotographer
  //       : TASK_CATEGORIES.chooseVideographer;
  //     const task = wedding.predefinedTasks.find((t) => t.name === name);
  //     if (task && !task.isCompleted) {
  //       await strapi.documents("api::predefined-task.predefined-task").update({
  //         documentId: task.documentId,
  //         data: {
  //           isCompleted: true,
  //         },
  //       });
  //     }
  //     return ctx.send({
  //       message: `${type} picked successfully`,
  //       documentId: person.documentId,
  //     });
  //   } catch (error) {
  //     ctx.internalServerError("Internal Server Error");
  //   }
  // },
};
