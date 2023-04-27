import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { Request } from "express";

dotenv.config();

const JWT_KEY = process.env.JWT_SECRET_KEY;

if (!JWT_KEY) {
  throw new Error("set JWT_SECRET_KEY in .env file");
}

export const verifyToken = (req: Request) => {
  if (req.headers.authorization) {
    return jwt.verify(
      req.headers.authorization.split(" ")[1],
      JWT_KEY,
      (_, decoded) => {
        return decoded;
      }
    );
  }
};
