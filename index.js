import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import * as dotenv from "dotenv";

import { models } from "./models/index.js";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schema/index.js";
import { resolvers } from "./resolvers/index.js";
import { verifyToken } from "./services/index.js";

dotenv.config();

const DB_HOST = process.env.DB_HOST;
const PORT = process.env.PORT || 4000;

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const user = verifyToken(req);
    return { user, models };
  },
});

await server.start();
server.applyMiddleware({ app, path: "/api" });

app.use(helmet());
app.use(cors());
app.use(express.json());

await mongoose.connect(DB_HOST);

app.listen(PORT, () => {
  console.log(
    `GraphQl started on http://localhost:${PORT}${server.graphqlPath}`
  );
});
