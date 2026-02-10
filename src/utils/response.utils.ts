import type { Response } from "express";
import { HTTP_CONSTANTS } from "@/constant/http.constant.js";
import type { ISuccessResponse } from "@/dto/response/i-success.response.js";

export class RestResponse {
  static success<T>(
    res: Response,
    data: T,
    message: string = "Get Data Successfully",
  ): Response<ISuccessResponse<T>> {
    return res.status(HTTP_CONSTANTS.STATUS_CODES.OK).json({
      status: HTTP_CONSTANTS.STATUS_CODES.OK,
      message,
      result: data,
    });
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = "Create Data Successfully",
  ): Response<ISuccessResponse<T>> {
    return res.status(HTTP_CONSTANTS.STATUS_CODES.CREATED).json({
      status: HTTP_CONSTANTS.STATUS_CODES.CREATED,
      message,
      result: data,
    });
  }

  static updated<T>(
    res: Response,
    data: T,
    message: string = "Update Data Successfully",
  ): Response<ISuccessResponse<T>> {
    return res.status(HTTP_CONSTANTS.STATUS_CODES.OK).json({
      status: HTTP_CONSTANTS.STATUS_CODES.OK,
      message,
      result: data,
    });
  }

  static deleted(
    res: Response,
    message: string = "Delete Data Successfully",
  ): Response<ISuccessResponse<void>> {
    return res.status(HTTP_CONSTANTS.STATUS_CODES.NO_CONTENT).json({
      status: HTTP_CONSTANTS.STATUS_CODES.NO_CONTENT,
      message,
    });
  }

  static error(res: Response, message: string = "Internal Server Error") {
    return res.status(HTTP_CONSTANTS.STATUS_CODES.INTERNAL_ERROR).json({
      status: HTTP_CONSTANTS.STATUS_CODES.INTERNAL_ERROR,
      message,
    });
  }
}
