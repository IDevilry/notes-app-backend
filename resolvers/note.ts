import { ApolloContext, ApolloPayload } from "../types";

export const Note = {
  author: async (
    { author }: ApolloPayload,
    _: never,
    { models }: ApolloContext
  ) => {
    return await models.User.findById(String(author));
  },
  favoritedBy: async (
    { favoritedBy }: ApolloPayload,
    _: never,
    { models }: ApolloContext
  ) => {
    return await models.User.find({ _id: { $in: favoritedBy } });
  },
};
