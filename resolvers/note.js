export const Note = {
  author: async ({ author }, _, { models }) => {
    return await models.User.findById(author);
  },
  favoritedBy: async ({ favoritedBy }, _, { models }) => {
    return await models.User.find({ _id: { $in: favoritedBy } });
  },
};
