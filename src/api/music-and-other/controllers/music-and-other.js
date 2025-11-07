"use strict";

const {
  updateMusicBodySchema,
  updatedOthersBodySchema,
  updateMusicAndOtherBodySchema,
} = require("../validation/music-and-other");

module.exports = {
  async createOrGetMusicAndSound(ctx) {
    try {
      const user = ctx.state.user;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: {
          user,
        },
        populate: [
          "musicAndOther",
          "musicAndOther.music",
          "musicAndOther.others",
        ],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found");
      }

      if (wedding.musicAndOther) {
        // If music already exists, return it
        return ctx.send({
          documentId: wedding.musicAndOther.documentId,
          createPlaylist: getCreatePlaylist(wedding.musicAndOther.music),
          soundSystem: wedding.musicAndOther.others?.soundSystem ? true : false,
          notes: wedding.musicAndOther.notes || null,
        });
      }

      // If music does not exist, create a new one
      const newMusic = await strapi
        .documents("api::music-and-other.music-and-other")
        .create({
          data: {
            wedding: wedding.documentId,
          },
          populate: ["music", "others"],
        });

      return ctx.send({
        documentId: newMusic.documentId,
        createPlaylist: getCreatePlaylist(newMusic.music),
        soundSystem: newMusic.others?.soundSystem ? true : false,
        notes: newMusic.notes || null,
      });
    } catch (error) {
      ctx.internalServerError("Internal Server Error");
    }
  },

  async updateMusicAndSound(ctx) {
    try {
      const user = ctx.state.user;

      const { error } = updateMusicAndOtherBodySchema.validate(
        ctx.request.body,
        {
          abortEarly: false,
        }
      );
      if (error) {
        return ctx.badRequest("Validation error", { details: error.details });
      }

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: {
          user,
        },
        populate: ["musicAndOther"],
      });
      if (!wedding) {
        return ctx.notFound("Wedding not found");
      }
      if (!wedding.musicAndOther) {
        return ctx.notFound("Music and Other not found");
      }

      await strapi.documents("api::music-and-other.music-and-other").update({
        documentId: wedding.musicAndOther.documentId,
        data: ctx.request.body,
      });

      return ctx.send({
        documentId: wedding.musicAndOther.documentId,
        message: "Music and Other updated successfully",
      });
    } catch (error) {
      ctx.internalServerError("Internal Server Error");
    }
  },

  async createOrGetMusic(ctx) {
    try {
      const user = ctx.state.user;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: {
          user,
        },
        populate: ["musicAndOther", "musicAndOther.music"],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found");
      }

      if (!wedding.musicAndOther) {
        return ctx.notFound("Music and Other not found");
      }

      if (wedding.musicAndOther?.music) {
        // If music already exists, return it
        return ctx.send(wedding.musicAndOther.music);
      }

      // If music does not exist, create a new one
      const newMusic = await strapi.documents("api::music.music").create({
        data: {
          musicAndOther: wedding.musicAndOther.documentId,
        },
      });

      return ctx.send(newMusic);
    } catch (error) {
      ctx.internalServerError("Internal Server Error");
    }
  },

  async updateMusic(ctx) {
    try {
      const user = ctx.state.user;

      const { error } = updateMusicBodySchema.validate(ctx.request.body, {
        abortEarly: false,
      });
      if (error) {
        return ctx.badRequest("Validation error", { details: error.details });
      }

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: {
          user,
        },
        populate: ["musicAndOther", "musicAndOther.music"],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found");
      }
      console.log(wedding.musicAndOther?.music);

      if (!wedding.musicAndOther?.music) {
        return ctx.notFound("Music not found");
      }

      // Update the existing music
      const updatedMusic = await strapi.documents("api::music.music").update({
        documentId: wedding.musicAndOther.music.documentId,
        data: ctx.request.body,
      });

      return ctx.send(updatedMusic);
    } catch (error) {
      ctx.internalServerError("Internal Server Error");
    }
  },

  async createOrUpdateOthers(ctx) {
    try {
      const user = ctx.state.user;

      const { error } = updatedOthersBodySchema.validate(ctx.request.body, {
        abortEarly: false,
      });
      if (error) {
        return ctx.badRequest("Validation error", { details: error.details });
      }

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: {
          user,
        },
        populate: ["musicAndOther", "musicAndOther.others"],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found");
      }

      if (wedding.musicAndOther?.others) {
        // If others already exist, update them
        const updatedOthers = await strapi
          .documents("api::other-music.other-music")
          .update({
            documentId: wedding.musicAndOther.others.documentId,
            data: ctx.request.body,
          });

        return ctx.send(updatedOthers);
      }

      // If others do not exist, create a new one
      const newOthers = await strapi
        .documents("api::other-music.other-music")
        .create({
          data: {
            ...ctx.request.body,
            musicAndOther: wedding.musicAndOther.documentId,
          },
        });

      return ctx.send(newOthers);
    } catch (error) {
      console.error(error);
      ctx.internalServerError("Internal Server Error");
    }
  },

  async getOthers(ctx) {
    try {
      const user = ctx.state.user;

      const wedding = await strapi.documents("api::wedding.wedding").findFirst({
        filters: {
          user,
        },
        populate: ["musicAndOther", "musicAndOther.others"],
      });

      if (!wedding) {
        return ctx.notFound("Wedding not found");
      }

      if (!wedding.musicAndOther?.others) {
        return ctx.notFound("Others not found");
      }

      return ctx.send(wedding.musicAndOther.others);
    } catch (error) {
      ctx.internalServerError("Internal Server Error");
    }
  },
};

function getCreatePlaylist(music) {
  if (!music) return false;
  const createPlaylist = Object.keys(music).findIndex(
    (key) => music[key] === false
  );
  return createPlaylist === -1;
}
