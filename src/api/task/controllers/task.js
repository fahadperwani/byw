"use strict";

const {
  createTaskBodySchema,
  updateTaskBodySchema,
} = require("../validation/task.js");

module.exports = {
  async createTask(ctx) {
    try {
      const user = ctx.state.user;
      const { error } = createTaskBodySchema.validate(ctx.request.body, {
        abortEarly: false,
      });
      if (error) {
        return ctx.badRequest("Validation error", { errors: error.details });
      }

      const weddings = await strapi.documents("api::wedding.wedding").findMany({
        filters: { user: user },
      });
      const wedding = weddings.length > 0 ? weddings[0] : null;

      if (!wedding) return ctx.badRequest("Wedding not found");

      const { name, dueDate, deadline, category, note } = ctx.request.body;

      if (!name || !dueDate || !deadline || !category) {
        return ctx.badRequest("Missing required fields");
      }

      const task = await strapi.documents("api::task.task").create({
        status: "published",
        data: {
          name,
          dueDate,
          deadline,
          category,
          note,
          wedding: wedding.documentId,
        },
      });

      if (!task) return ctx.badRequest("Error creating task");
      return ctx.created({ task });
    } catch (error) {
      console.log(error);
      return ctx.internalServerError("Error creating task", { error });
    }
  },

  async getTasks(ctx) {
    try {
      const user = ctx.state.user;
      const weddings = await strapi.documents("api::wedding.wedding").findMany({
        filters: { user },
        populate: ["tasks"],
      });
      const wedding = weddings.length > 0 ? weddings[0] : null;

      if (!wedding) return ctx.badRequest("Wedding not found");

      const taskId = ctx.query.id;

      if (!taskId) {
        const tasks = wedding["tasks"] || [];

        // if (!user.payment) {
        //     const createdDate = new Date(user.createdAt);
        //     console.log(createdDate)
        //     const deadline = new Date(wedding.weddingDay);
        //     console.log(deadline)

        //     const totalDays = (deadline.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
        //     const oneSixthDays = totalDays / 6;

        //     const resultDate = new Date(createdDate);
        //     resultDate.setDate(createdDate.getDate() + Math.round(oneSixthDays));
        //     console.log(resultDate)

        //     const filteredTasks = tasks.filter(task => {
        //         const taskDeadline = new Date(task.deadline);
        //         return taskDeadline <= resultDate;
        //     });

        //     return ctx.send({ tasks: filteredTasks });

        // }

        return ctx.send({ tasks });
      } else {
        // Find the task with populated wedding relation
        const task = await strapi
          .documents("api::task.task")
          .findOne({ documentId: taskId });

        // Handle errors
        if (!task) return ctx.notFound("Task not found");

        // Return the task if all checks pass
        return ctx.send({ task });
      }
    } catch (error) {
      return ctx.internalServerError("Error fetching tasks", { error });
    }
  },

  async updateTask(ctx) {
    try {
      const { error } = updateTaskBodySchema.validate(ctx.request.body, {
        abortEarly: false,
      });
      if (error) {
        return ctx.badRequest("Validation error", { errors: error.details });
      }

      const user = ctx.state.user;

      const weddings = await strapi.documents("api::wedding.wedding").findMany({
        filters: { user },
        populate: ["tasks"],
      });

      if (!weddings || weddings.length === 0)
        return ctx.notFound("Wedding not found");

      const wedding = weddings[0];

      const documentId = ctx.query.id;

      const task = wedding.tasks.filter(
        (task) => task.documentId === documentId
      )[0];

      if (!task) return ctx.notFound("Task not found");

      const updatedTask = await strapi.documents("api::task.task").update({
        documentId,
        data: {
          ...ctx.request.body,
        },
      });

      return ctx.send({ task: updatedTask });
    } catch (error) {
      console.log(error);
      return ctx.internalServerError("Error updating task", {
        error: error.message,
      });
    }
  },
};
