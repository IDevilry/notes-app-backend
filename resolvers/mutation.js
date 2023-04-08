import { models } from "../models/index.js";

export const Mutation = {
  newNote: async (_, args) => {
    return await models.Note.create({
      title: args.title,
      content: args.content,
    });
  },
  updateNote: async (_, { id, title, content }) => {
    return await models.Note.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          content,
        },
      },
      { 
        new: true
      }
    );
  },
  deleteNote: async (_, args) => {
    return await models.Note.findByIdAndDelete(args.id);
  },
};
