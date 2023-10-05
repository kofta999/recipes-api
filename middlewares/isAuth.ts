import * as jose from "jose";
import { RequestHandler } from "express";

export const isAuth: RequestHandler = async (req, res, next) => {
  try {
    const header = req.get("Authorization");
    if (!header) {
      const error = new Error(
        "Authorization header not provided"
      ) as CustomError;
      error.statusCode = 401;
      throw error;
    }
    const token = header.split(" ")[1];
    if (!token) {
      const error = new Error("Token not provided") as CustomError;
      error.statusCode = 401;
      throw error;
    }
    const secretKey = new TextEncoder().encode(
      process.env.JWT_TOKEN || "secret"
    );
    const { payload } = await jose.jwtVerify(token, secretKey);
    req.userId = payload.userId as string;
    next();
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
