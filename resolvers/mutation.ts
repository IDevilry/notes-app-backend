import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import { ApolloContext, ApolloPayload, AuthPayload } from "../types";

dotenv.config();

const JWT_KEY = process.env.JWT_SECRET_KEY;

if (!JWT_KEY) {
  throw new Error("set JWT_SECRET_KEY in .env file");
} 

export const Mutation = {
  newNote: async (
    _: never,
    { title, content, category }:ApolloPayload,
    { user, models }: ApolloContext
  ) => {
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
  updateNote: async (
    _: never,
    { id, title, content }:ApolloPayload,
    { user, models }: ApolloContext
  ) => {
    if (!user) {
      throw new AuthenticationError("User not logged in");
    }
    const note = await models.Note.findById(id);
    if (note && String(note.author) !== user.id) {
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
  deleteNote: async (_: never, { id }:ApolloPayload, { user, models }: ApolloContext) => {
    if (!user) {
      throw new AuthenticationError("User not logged in");
    }
    const note = await models.Note.findById(id);
    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError("You don't have permission to delete this note");
    }
    return await models.Note.findByIdAndDelete(id);
  },
  toggleFavoriteNote: async (
    _: never,
    { id }: ApolloPayload,
    { user, models }: ApolloContext
  ) => {
    if (!user) {
      throw new AuthenticationError("User not logged in");
    }
    const findNote = await models.Note.findById(id);
    const hasUser = findNote?.favoritedBy.find((id) => String(id) === user.id);
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
  signUp: async (
    _: never,
    { username, email, password }:AuthPayload,
    { models }: ApolloContext
  ) => {
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
  signIn: async (
    _: never,
    { username, email, password }:AuthPayload,
    { models }: ApolloContext
  ) => {
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
