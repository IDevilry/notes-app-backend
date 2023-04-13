export const User = {
  notes: async ({ _id }, _, { models }) => {
    return await models.Note.find({ author: _id }).sort({ _id: -1 });
  },
  favoritesNotes: async ({ _id }, _, { models }) => {
    return await models.Note.find({ favoritedBy: _id }).sort({ _id: -1 });
  },
};
