"use strict";

module.exports = {
  async createNote(ctx) {
    try {
      const { note } = ctx.request.body;

      if (!note.trim()) {
        return ctx.badRequest("Note cannot be empty");
      }

      const user = ctx.state.user;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user: user },
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found for this user");
      }

      const newNote = await strapi.documents("api::note.note").create({
        data: {
          note: note,
          wedding: wedding.id,
        },
      });

      return ctx.send({ message: "Note created successfully", note: newNote });
    } catch (error) {
      console.error("Error creating note:", error);
      return ctx.internalServerError("Error creating note", { error });
    }
  },

  async updateNote(ctx) {
    try {
      const { note } = ctx.request.body;

      const { id } = ctx.params;

      const existingNote = await strapi.documents("api::note.note").findOne({
        documentId: id,
      });

      if (!existingNote) {
        return ctx.notFound("Note not found");
      }

      await strapi.documents("api::note.note").update({
        documentId: id,
        data: {
          note: note,
        },
      });

      return ctx.send({ message: "Notes updated successfully", note });
    } catch (error) {
      console.error("Error updating notes:", error);
      return ctx.internalServerError("Error updating notes", { error });
    }
  },

  async getNotes(ctx) {
    try {
      const user = ctx.state.user;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user: user },
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found for this user");
      }

      const notes = await strapi.documents("api::note.note").findMany({
        filters: {
          wedding: {
            documentId: wedding.documentId,
          },
        },
      });

      return ctx.send({ notes });
    } catch (error) {
      console.error("Error fetching notes:", error);
      return ctx.internalServerError("Error fetching notes", { error });
    }
  },

  async deleteNote(ctx) {
    try {
      const { id } = ctx.params;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: { user: ctx.state.user },
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found for this user");
      }

      const existingNote = await strapi.documents("api::note.note").findOne({
        documentId: id,
        filters: { wedding: { documentId: wedding.documentId } },
      });

      if (!existingNote) {
        return ctx.notFound("Note not found");
      }

      await strapi.documents("api::note.note").delete({
        documentId: id,
      });

      return ctx.send({ message: "Note deleted successfully" });
    } catch (error) {
      console.error("Error deleting note:", error);
      return ctx.internalServerError("Error deleting note", { error });
    }
  },
};
