import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

import { AuthenticationError, ForbiddenError } from "apollo-server-express";

dotenv.config();

const JWT_KEY = process.env.JWT_SECRET_KEY;

export const Mutation = {
  newNote: async (_, { title, content }, { user, models }) => {
    if (!user) {
      throw new AuthenticationError("User not logged in");
    }
    return await models.Note.create({
      title: title,
      content: content,
      author: new mongoose.Types.ObjectId(user.id),
    });
  },
  updateNote: async (_, { id, title, content }, { user, models }) => {
    if (!user) {
      throw new AuthenticationError("User not logged in");
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
    return await models.Note.findByIdAndDelete(id);
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
