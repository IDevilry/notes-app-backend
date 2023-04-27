import { Date, ObjectId } from "mongoose";
import { models } from "../models";

export type ApolloContext = {
  models: typeof models;
  user: { id: string };
};

export type ApolloPayload = {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  favoritedBy: Author;
  _id: ObjectId
};

export type AuthPayload = {
  username?: string;
  email: string;
  password: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  category: string;
  author: Author;
  addedToFavoriteTimes: number;
  favoritedBy: Author[];
  createdAt: Date;
  updatedAt: Date;
};

export type Author = {
  id: string;
  username: string;
  email: string;
  notes: Note;
  favoritesNotes: Note;
  createdAt: Date;
  updatedAt: Date;
};
