"use strict";

const {
  weddingTasksData,
  calculateDeadline,
} = require("./utils/predefinedTasks");

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap(/*{ strapi }*/) {
    let template = await strapi
      .documents("api::task-template.task-template")
      .findFirst({
        populate: ["subCategories"],
      });
    if (template && template.subCategories.length > 0) {
      return;
    }
    const subCategories = Object.values(weddingTasksData);
    await strapi.documents("api::task-template.task-template").create({
      data: {
        subCategories,
      },
    });
  },
};
