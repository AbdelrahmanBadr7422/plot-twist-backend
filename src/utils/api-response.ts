import { Response } from "express";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const successResponse = <T>(
  res: Response,
  data: T,
  message: string = "Success",
  statusCode: number = 200,
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

export const errorResponse = (
  res: Response,
  message: string = "Error occurred",
  statusCode: number = 400,
): Response => {
  const response: ApiResponse<null> = {
    success: false,
    message,
  };
  return res.status(statusCode).json(response);
};
