"use strict";

const {
  calculateDeadline,
  calculateDueDate,
} = require("../../../utils/predefinedTasks");

module.exports = {
  // Function to add predefined tasks to the database
  async addPredefinedTasks(wedding) {
    const weddingTimelineMonths = getMonthsDifference(
      wedding.createdAt,
      wedding.weddingDay
    );

    const subCategories = (
      await strapi.documents("api::task-template.task-template").findFirst({
        populate: [
          "subCategories",
          "subCategories.tasks",
          "subCategories.notes",
        ],
      })
    )?.subCategories;

    for (let subCategory of subCategories) {
      let { notes } = subCategory;

      const sc = await strapi
        .documents("api::sub-category.sub-category")
        .create({
          data: {
            name: subCategory.name,
            checkBox: subCategory.checkBox,
            label: subCategory.label,
            category: subCategory.category,
            wedding: wedding.id,
            text: subCategory.text,
          },
        });

      for (let note of notes || []) {
        await strapi.documents("api::note.note").create({
          status: "published",
          data: {
            placeholder: note.placeholder,
            subCategory: sc.id,
          },
        });
      }

      const weddingTasksData = subCategory.tasks;

      for (let i = 0; i < weddingTasksData.length; i++) {
        const task = weddingTasksData[i];
        const dueDateInWeeks = calculateDueDate(task, weddingTimelineMonths);
        const deadlineInWeeks = calculateDeadline(task, weddingTimelineMonths);

        let formattedDueDate = null;
        let formattedDeadline = null;

        if (dueDateInWeeks) {
          formattedDueDate = new Date(wedding.createdAt);
          formattedDueDate.setDate(
            formattedDueDate.getDate() + dueDateInWeeks * 7
          );
        }

        if (deadlineInWeeks) {
          formattedDeadline = new Date(wedding.createdAt);
          formattedDeadline.setDate(
            formattedDeadline.getDate() +
              (deadlineInWeeks + (dueDateInWeeks || 0)) * 7
          );
        }

        await strapi.documents("api::predefined-task.predefined-task").create({
          status: "published",
          data: {
            name: task.name,
            priority: task.priority,
            deadline: formattedDeadline?.toISOString()?.split("T")[0] || null,
            dueDate: formattedDueDate?.toISOString()?.split("T")[0] || null,
            navigation: task.navigation,
            category: task.category,
            isCompleted: task.isCompleted,
            deadlines: task.deadlines,
            extensions: task.extensions,
            wedding,
            subCategory: sc,
          },
        });
      }
    }
    // Insert predefined tasks
  },

  async updatePredefinedTasks(wedding) {
    const tasks = wedding.predefinedTasks;
    const weddingTimelineMonths = getMonthsDifference(
      wedding.createdAt,
      wedding.weddingDay
    );

    for (let task of tasks) {
      const dueDateInWeeks = calculateDueDate(task, weddingTimelineMonths);
      const deadlineInWeeks = calculateDeadline(task, weddingTimelineMonths);

      let formattedDueDate = null;
      let formattedDeadline = null;

      if (dueDateInWeeks) {
        formattedDueDate = new Date(wedding.createdAt);
        formattedDueDate.setDate(
          formattedDueDate.getDate() + dueDateInWeeks * 7
        );
      }

      if (deadlineInWeeks) {
        formattedDeadline = new Date(wedding.createdAt);
        formattedDeadline.setDate(
          formattedDeadline.getDate() +
            (deadlineInWeeks + (dueDateInWeeks || 0)) * 7
        );
      }

      await strapi.documents("api::predefined-task.predefined-task").update({
        documentId: task.documentId,
        data: {
          deadline: formattedDeadline?.toISOString()?.split("T")[0] || null,
          dueDate: formattedDueDate?.toISOString()?.split("T")[0] || null,
        },
      });
    }
  },
};

function getMonthsDifference(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  let months = (end.getFullYear() - start.getFullYear()) * 12;
  months += end.getMonth() - start.getMonth();

  // If you want to consider days too, you can add a fractional month
  if (end.getDate() < start.getDate()) {
    months -= 1; // not a full month yet
  }

  return months;
}
