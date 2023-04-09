import { gql } from "apollo-server-express";

export const typeDefs = gql`
  scalar DateTime
  type Query {
    notes: [Note!]!
    note(id: ID!): Note!
    user(username: String!): User!
    users: [User!]!
  }

  type Note {
    id: ID!
    title: String!
    content: String!
    author: User!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    notes: [Note!]
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Mutation {
    newNote(content: String!, title: String!): Note!
    updateNote(id: ID!, content: String!, title: String!): Note!
    deleteNote(id: ID!): Note!
    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String, email: String!, password: String!): String!
  }
`;
