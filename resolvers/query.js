import { AuthenticationError } from "apollo-server-express";

export const Query = {
  notes: async (_, args, { models }) => {
    return await models.Note.find().limit(100);
  },
  note: async (_, { id }, { models }) => {
    return await models.Note.findById(id);
  },
  user: async (_, { username }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError("User not logged in");
    }
    return await models.User.findOne({ username: username });
  },
  users: async (_, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError("User not logged in");
    }
    return await models.User.find({}).limit(100);
  },
};
