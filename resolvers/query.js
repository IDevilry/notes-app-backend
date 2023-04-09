import { models } from "../models/index.js";

export const Query = {
  notes: async () => {
    return await models.Note.find();
  },
  note: async (_, { id }) => {
    return await models.Note.findById(id);
  },
  user: async (_, { username }) => {
    return await models.User.find({ username });
  },
  users: async () => {
    return await models.User.find();
  },
};
