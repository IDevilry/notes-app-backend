import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const JWT_KEY = process.env.JWT_SECRET_KEY;

export const verifyToken = (req) => {
  if (!req.headers.authorization) return;
  jwt.verify(
    req.headers.authorization.split(" ")[1],
    JWT_KEY,
    (err, decoded) => {
      if (err) {
        throw new Error("Invalid token");
      }
      return decoded;
    }
  );
};
