export const Note = {
  author: async ({ author }, _, { models }) => {
    return await models.User.findById(author);
  },
};
