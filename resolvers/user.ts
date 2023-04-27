import { ApolloContext, ApolloPayload } from "../types";

export const User = {
  notes: async (
    { _id }: ApolloPayload,
    _: never,
    { models }: ApolloContext
  ) => {
    return await models.Note.find({ author: _id }).sort({ _id: -1 });
  },
  favoritesNotes: async (
    { _id }: ApolloPayload,
    _: never,
    { models }: ApolloContext
  ) => {
    return await models.Note.find({ favoritedBy: _id }).sort({ _id: -1 });
  },
};
