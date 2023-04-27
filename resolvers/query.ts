import { AuthenticationError } from "apollo-server-express";
import { ApolloContext, ApolloPayload } from "../types";

export const Query = {
  notes: async (_: never, args: never, { models }: ApolloContext) => {
    return await models.Note.find().limit(100);
  },
  note: async (_: never, { id }: ApolloPayload, { models }: ApolloContext) => {
    return await models.Note.findById(id);
  },
  user: async (_: never, args: never, { models, user }: ApolloContext) => {
    if (!user) {
      throw new AuthenticationError("User not logged in");
    }
    return await models.User.findById(user.id);
  },
  userById: async (
    _: never,
    { id }: ApolloPayload,
    { models, user }: ApolloContext
  ) => {
    if (!user) {
      throw new AuthenticationError("User not logged in");
    }
    return await models.User.findById(id);
  },
  users: async (_: never, args: never, { models, user }: ApolloContext) => {
    if (!user) {
      throw new AuthenticationError("User not logged in");
    }
    return await models.User.find({}).limit(100);
  },
};
