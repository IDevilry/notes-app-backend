import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

import { AuthenticationError, ForbiddenError } from "apollo-server-express";

dotenv.config();

const JWT_KEY = process.env.JWT_SECRET_KEY;

export const Mutation = {
  newNote: async (_, { title, content, category }, { user, models }) => {
    if (!user) {
      throw new AuthenticationError("User not logged in");
    }
    return await models.Note.create({
      title: title,
      content: content,
      category: category,
      author: new mongoose.Types.ObjectId(user.id),
    });
  },
  updateNote: async (_, { id, title, content }, { user, models }) => {
    if (!user) {
      throw new AuthenticationError("User not logged in");
    }
    const note = await models.Note.findById(id);
    if (note && String(note.author !== user.id)) {
      throw new ForbiddenError("You don't have permission to edit this note");
    }
    return await models.Note.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          content,
        },
      },
      {
        new: true,
      }
    );
  },
  deleteNote: async (_, { id }, { user, models }) => {
    if (!user) {
      throw new AuthenticationError("User not logged in");
    }
    const note = await models.Note.findById(id);
    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError("You don't have permission to delete this note");
    }
    return await models.Note.findByIdAndDelete(id);
  },
  toggleFavoriteNote: async (_, { id }, { user, models }) => {
    if (!user) {
      throw new AuthenticationError("User not logged in");
    }
    const findNote = await models.Note.findById(id);
    const hasUser = findNote.favoritedBy.includes(user.id);
    if (hasUser) {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $pull: {
            favoritedBy: new mongoose.Types.ObjectId(user.id),
          },
          $inc: {
            addedToFavoriteTimes: -1,
          },
        },
        {
          new: true,
        }
      );
    } else {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $push: {
            favoritedBy: new mongoose.Types.ObjectId(user.id),
          },
          $inc: {
            addedToFavoriteTimes: 1,
          },
        },
        {
          new: true,
        }
      );
    }
  },
  signUp: async (_, { username, email, password }, { models }) => {
    const hashedPass = await bcrypt.hash(password, 10);
    try {
      const user = await models.User.create({
        username,
        email,
        password: hashedPass,
      });
      return jwt.sign({ id: user._id }, JWT_KEY);
    } catch (error) {
      throw new Error("Error registering user");
    }
  },
  signIn: async (_, { username, email, password }, { models }) => {
    const user = await models.User.findOne({
      $or: [{ email }, { username }],
    });
    if (!user) {
      throw new AuthenticationError("AuthenticationError");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError("AuthenticationError");
    }
    return jwt.sign({ id: user._id }, JWT_KEY);
  },
};
