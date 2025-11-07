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

    // Process all subcategories in parallel
    await Promise.all(
      subCategories.map(async (subCategory) => {
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

        // Create all notes in parallel for this subcategory
        const notePromises = (notes || []).map((note) =>
          strapi.documents("api::note.note").create({
            status: "published",
            data: {
              placeholder: note.placeholder,
              subCategory: sc.id,
            },
          })
        );

        // Create all tasks in parallel for this subcategory
        const taskPromises = subCategory.tasks.map((task) => {
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

          return strapi.documents("api::predefined-task.predefined-task").create({
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
        });

        // Wait for all notes and tasks to be created for this subcategory
        await Promise.all([...notePromises, ...taskPromises]);
      })
    );
  },

  async updatePredefinedTasks(wedding) {
    const tasks = wedding.predefinedTasks;
    const weddingTimelineMonths = getMonthsDifference(
      wedding.createdAt,
      wedding.weddingDay
    );

    // Update all tasks in parallel
    await Promise.all(
      tasks.map((task) => {
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

        return strapi.documents("api::predefined-task.predefined-task").update({
          documentId: task.id,
          data: {
            deadline: formattedDeadline?.toISOString()?.split("T")[0] || null,
            dueDate: formattedDueDate?.toISOString()?.split("T")[0] || null,
          },
        });
      })
    );
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
