"use strict";

module.exports = {
  // Function to add predefined tasks to the database
  async afterCreate(event) {
    // Log the creation of a new predefined task

    const { result, params } = event;
    const task = await strapi
      .documents("api::predefined-task.predefined-task")
      .findFirst({
        filters: {
          wedding: {
            documentId: result?.documentId,
          },
        },
      });

    if (task) return;
    await strapi
      .service("api::predefined-task.predefined-task")
      .addPredefinedTasks(result);
  },
};
