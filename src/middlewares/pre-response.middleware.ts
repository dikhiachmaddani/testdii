import type { NextFunction, Request, Response } from "express";
import { HTTP_CONSTANTS } from "@/constant/http.constant.js";
import DomainErrorTranslator from "@/utils/exceptions/domain-error-translator.exception.js";
import { ValidationError } from "@/utils/exceptions/validation-error.exception.js";

const PreResponseMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const translatedError = DomainErrorTranslator.translate(err);

  if (translatedError instanceof ValidationError) {
    return res.status(HTTP_CONSTANTS.STATUS_CODES.BAD_REQUEST).json({
      status: HTTP_CONSTANTS.STATUS_CODES.BAD_REQUEST,
      message: translatedError.message,
      errors: translatedError.errors,
    });
  }

  if (translatedError instanceof Error) {
    return res.status(HTTP_CONSTANTS.STATUS_CODES.BAD_REQUEST).json({
      status: HTTP_CONSTANTS.STATUS_CODES.BAD_REQUEST,
      message: translatedError.message,
    });
  }

  return next(err);
};

export default PreResponseMiddleware;
