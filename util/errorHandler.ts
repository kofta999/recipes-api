import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  res.status(error.statusCode).json({
    success: false,
    status_message: error.message,
    data: null,
  });
};
