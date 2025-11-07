"use strict";

const { TASK_CATEGORIES } = require("../../../utils/tasksConstants");

const {
  createPhotographerAndVideographerBodySchema,
  updatePhotographerAndVideographerBodySchema,
} = require("../validation/photographer-or-videographer");

module.exports = {
  async createMediaPerson(ctx) {
    try {
      const user = ctx.state.user;

      const { error } = createPhotographerAndVideographerBodySchema.validate(
        ctx.request.body,
        { abortEarly: false }
      );
      if (error) {
        return ctx.badRequest(error.details[0].message);
      }

      const { type } = ctx.request.params;
      if (type !== "photographer" && type !== "videographer") {
        return ctx.badRequest(
          "Invalid type. Must be 'photographer' or 'videographer'."
        );
      }

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: {
          user,
        },
        populate: ["predefinedTasks"],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found");
      }

      const section = await strapi
        .documents("api::sub-category.sub-category")
        .findFirst({
          filters: {
            wedding: {
              documentId: wedding.documentId,
            },
            name: "Videographer",
          },
        });

      const areSame = section.checkBoxValue;

      const isPhotographer = areSame ? true : type === "photographer";

      const newMediaPerson = await strapi
        .documents(
          "api::photographer-or-videographer.photographer-or-videographer"
        )
        .create({
          status: "published",
          data: {
            ...ctx.request.body,
            wedding: wedding.documentId,
            isPhotographer,
          },
        });

      const [n1, n2] = isPhotographer
        ? [
            TASK_CATEGORIES.comparePhotographers,
            TASK_CATEGORIES.choosePhotographer,
          ]
        : [
            TASK_CATEGORIES.compareVideographers,
            TASK_CATEGORIES.chooseVideographer,
          ];
      const [compare, choose] = wedding.predefinedTasks.filter(
        (t) => t.name === n1 || t.name === n2
      );

      if (compare && !compare.isCompleted) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: compare.documentId,
          data: {
            isCompleted: true,
          },
        });
      }

      if (!user.isPremium) {
        await strapi.documents("api::wedding.wedding").update({
          documentId: wedding.documentId,
          data: {
            [type]: newMediaPerson.documentId,
          },
        });

        if (choose && !choose.isCompleted) {
          await strapi
            .documents("api::predefined-task.predefined-task")
            .update({
              documentId: choose.documentId,
              data: {
                isCompleted: true,
              },
            });
        }
      }

      return ctx.send(newMediaPerson);
    } catch (error) {
      console.log(error);
      ctx.internalServerError("Internal Server Error");
    }
  },

  async getMediaPersons(ctx) {
    try {
      const user = ctx.state.user;

      const { type } = ctx.request.params;
      const { id } = ctx.query;

      if (type !== "photographer" && type !== "videographer") {
        return ctx.badRequest("Invalid type");
      }

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: {
          user,
        },
        populate: ["mediaPersons", "photographer", "videographer"],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found");
      }

      const section = await strapi
        .documents("api::sub-category.sub-category")
        .findFirst({
          filters: {
            wedding: {
              documentId: wedding.documentId,
            },
            name: "Videographer",
          },
        });

      const areSame = section.checkBoxValue;

      const isPhotographer = areSame ? true : type === "photographer";
      const filteredPersons = wedding.mediaPersons?.filter(
        (p) =>
          p.isPhotographer === isPhotographer &&
          (id ? p.documentId === id : true)
      );

      const persons = filteredPersons?.map((p) => ({
        ...p,
        isPicked: p.documentId === wedding[type]?.documentId,
      }));

      return ctx.send({ creators: persons || [] });
    } catch (error) {
      ctx.internalServerError("Internal Server Error");
    }
  },

  async updateMediaPerson(ctx) {
    try {
      const user = ctx.state.user;

      const { id } = ctx.query;
      const { type } = ctx.request.params;

      const { error } = updatePhotographerAndVideographerBodySchema.validate(
        ctx.request.body,
        { abortEarly: false }
      );

      if (error) {
        return ctx.badRequest(error.details[0].message);
      }

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: {
          user,
        },
        populate: ["mediaPersons"],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found");
      }

      const section = await strapi
        .documents("api::sub-category.sub-category")
        .findFirst({
          filters: {
            wedding: {
              documentId: wedding.documentId,
            },
            name: "Videographer",
          },
        });

      const areSame = section.checkBoxValue;

      const isPhotographer = areSame ? true : type === "photographer";

      const person = wedding.mediaPersons?.find(
        (p) => p.documentId === id && p.isPhotographer === isPhotographer
      );

      if (!person) {
        return ctx.notFound("Media person not found");
      }

      await strapi
        .documents(
          "api::photographer-or-videographer.photographer-or-videographer"
        )
        .update({
          documentId: person.documentId,
          data: ctx.request.body,
        });

      return ctx.send({
        message: "Media person updated successfully",
        documentId: person.documentId,
      });
    } catch (error) {
      ctx.internalServerError("Internal Server Error");
    }
  },

  async deleteMediaPerson(ctx) {
    try {
      const user = ctx.state.user;

      const { id } = ctx.query;
      const { type } = ctx.request.params;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: {
          user,
        },
        populate: [
          "mediaPersons",
          "photographer",
          "videographer",
          "predefinedTasks",
        ],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found");
      }

      const section = await strapi
        .documents("api::sub-category.sub-category")
        .findFirst({
          filters: {
            wedding: {
              documentId: wedding.documentId,
            },
            name: "Videographer",
          },
        });

      const areSame = section.checkBoxValue;

      const isPhotographer = areSame ? true : type === "photographer";

      const person = wedding.mediaPersons?.find(
        (p) => p.documentId === id && p.isPhotographer === isPhotographer
      );

      if (!person) {
        return ctx.notFound("Media person not found");
      }

      await strapi
        .documents(
          "api::photographer-or-videographer.photographer-or-videographer"
        )
        .delete({
          documentId: person.documentId,
        });

      const [n1, n2] = isPhotographer
        ? [
            TASK_CATEGORIES.comparePhotographers,
            TASK_CATEGORIES.choosePhotographer,
          ]
        : [
            TASK_CATEGORIES.compareVideographers,
            TASK_CATEGORIES.chooseVideographer,
          ];

      const [compare, choose] = wedding.predefinedTasks?.filter(
        (t) => t.name === n1 || t.name === n2
      );

      console.log("compare", compare);
      console.log("choose", choose);

      const persons = wedding.mediaPersons;

      if (persons.length === 1) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: compare.documentId,
          data: {
            isCompleted: false,
          },
        });
      }

      if (wedding[type]?.documentId === person.documentId) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: choose.documentId,
          data: {
            isCompleted: false,
          },
        });
      }

      return ctx.send({
        message: "Media person deleted successfully",
        documentId: person.documentId,
      });
    } catch (error) {
      console.log(error);
      ctx.internalServerError("Internal Server Error");
    }
  },

  async pickMediaPerson(ctx) {
    try {
      const { id } = ctx.query;
      const { type } = ctx.request.params;
      if (type !== "photographer" && type !== "videographer") {
        return ctx.badRequest(
          "Invalid type. Must be 'photographer' or 'videographer'."
        );
      }

      const user = ctx.state.user;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: {
          user,
        },
        populate: [
          "mediaPersons",
          "photographer",
          "videographer",
          "predefinedTasks",
        ],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found");
      }

      // if (wedding[type]) {
      //   return ctx.badRequest(`${type} already picked`);
      // }

      const section = await strapi
        .documents("api::sub-category.sub-category")
        .findFirst({
          filters: {
            wedding: {
              documentId: wedding.documentId,
            },
            name: "Videographer",
          },
        });

      const areSame = section.checkBoxValue;

      const isPhotographer = areSame ? true : type === "photographer";
      const person = wedding.mediaPersons?.find(
        (p) => p.documentId === id && p.isPhotographer === isPhotographer
      );

      if (!person) {
        return ctx.notFound("Media person not found");
      }

      await strapi.documents("api::wedding.wedding").update({
        documentId: wedding.documentId,
        data: {
          [type]: person.documentId,
        },
      });

      const name = isPhotographer
        ? TASK_CATEGORIES.choosePhotographer
        : TASK_CATEGORIES.chooseVideographer;
      const task = wedding.predefinedTasks.find((t) => t.name === name);

      if (task && !task.isCompleted) {
        await strapi.documents("api::predefined-task.predefined-task").update({
          documentId: task.documentId,
          data: {
            isCompleted: true,
          },
        });
      }

      return ctx.send({
        message: `${type} picked successfully`,
        documentId: person.documentId,
      });
    } catch (error) {
      ctx.internalServerError("Internal Server Error");
    }
  },
};
