import express, { Express } from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import * as dotenv from "dotenv";

import { models } from "./models";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { verifyToken } from "./services";

dotenv.config();

const DB_HOST = process.env.DB_HOST;

if (!DB_HOST) {
 throw new Error("set DB_HOST in .env file");
}

const PORT = process.env.PORT || 4000;

const app: Express = express();

const server: ApolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const user = verifyToken(req);
    return { user, models };
  },
});

const startApolloServer = async () => {
  await server.start();

  await mongoose.connect(DB_HOST);
  server.applyMiddleware({ app, path: "/api" });
};

startApolloServer();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(
    `GraphQl started on http://localhost:${PORT}${server.graphqlPath}`
  );
});
