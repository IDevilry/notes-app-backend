import { models } from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import * as dotenv from "dotenv";

dotenv.config();

const JWT_KEY = process.env.JWT_SECRET_KEY;

export const Mutation = {
  newNote: async (_, args) => {
    return await models.Note.create({
      title: args.title,
      content: args.content,
    });
  },
  updateNote: async (_, { id, title, content }) => {
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
  deleteNote: async (_, args) => {
    return await models.Note.findByIdAndDelete(args.id);
  },
  signUp: async (_, { username, email, password }) => {
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
  signIn: async (_, { username, email, password }) => {
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
