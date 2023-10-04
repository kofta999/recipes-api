import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import { User } from "../models/user";

const secretKey = new TextEncoder().encode(process.env.JWT_TOKEN || "secret");

export const signup: RequestHandler = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    const response: CustomResponse = {
      success: true,
      status_message: "Created user successfully",
      data: {
        userId: user._id,
      },
    };
    res.status(201).json(response);
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found") as CustomError;
      error.statusCode = 404;
      throw error;
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      const error = new Error("Password invalid") as CustomError;
      error.statusCode = 401;
      throw error;
    }
    const token = await new jose.SignJWT({
      userId: user._id,
      email: user.email,
    })
      .setExpirationTime("2h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secretKey);

    const response: CustomResponse = {
      success: true,
      status_message: "Logged in successfully",
      data: {
        token,
      },
    };
    res.status(200).json(response);
  } catch (err: any) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
