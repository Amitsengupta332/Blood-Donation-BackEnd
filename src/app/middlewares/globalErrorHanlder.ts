import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let success = error.status || false;
  let message = error.message || `something wen't wrong`;
  let errorDetails = error || [];

  if (error instanceof ZodError) {
    const issues = error.errors.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    status = httpStatus.BAD_REQUEST;
    (success = false),
      (message = message = issues.map((error) => error.message).join(". ")),
      (errorDetails = { issues });
  } else if (errorDetails.statusCode === 401) {
    status = httpStatus.UNAUTHORIZED;
    (success = false),
      (message = message = error.message),
      (errorDetails = "unauthorized error");
  }
  res.status(status).json({
    success,
    message,
    errorDetails,
  });
};

export default globalErrorHandler;
