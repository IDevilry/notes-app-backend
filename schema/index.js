import { gql } from "apollo-server-express";

export const typeDefs = gql`
  scalar DateTime
  type Query {
    notes: [Note!]!
    note(id: ID!): Note!
  }
  type Note {
    id: ID!
    title: String!
    content: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  type Mutation {
    newNote(content: String!, title: String!) : Note!
    updateNote(id: ID!, content: String!, title: String!) : Note!
    deleteNote(id: ID!) : Note!
  }
`;
