import { models } from "../models/index.js";

export const Query = {
  notes: async () => {
    return await models.Note.find();
  },
  note: async (_, args) => {
    return await models.Note.findById(args.id);
  },
  user: async (_, { username }) => {
    return await models.User.find({ username });
  },
};
