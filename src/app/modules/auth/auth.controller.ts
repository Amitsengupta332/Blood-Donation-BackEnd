import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);

  // Set refresh token to the cookie
  const { refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: false, // TODO: Change it true in production
    httpOnly: true,
  });

  const responseData = {
    id: result.userData.id,
    name: result.userData.name,
    email: result.userData.email,
    accessToken: result.accessToken,
  };

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: responseData,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token generated successfully",
    data: result,
  });
});

// const loginUser = catchAsync(async (req: Request, res: Response) => {
//   const result = await AuthServices.loginUser(req.body);

//   console.log("login",req.body);
//   // Set refresh token to the cookie
//   const { refreshToken } = result;

//   // res.cookie("refreshToken", refreshToken, {
//   //   secure: false, // TODO: Change it true in production
//   //   httpOnly: true,
//   // });

//   const responseData = {
//     id: result.userData.id,
//     name: result.userData.name,
//     email: result.userData.email,
//     token: result.accessToken,
//   };

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "User logged in successfully",
//     data: responseData,
//   });
// });

// const refreshToken = catchAsync(async (req: Request, res: Response) => {
//   const { refreshToken } = req.cookies;

//   const result = await AuthServices.refreshToken(refreshToken);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Logged in successfully!",
//     data: result,
//     // data: {
//     //     accessToken: result.accessToken,
//     //     needPasswordChange: result.needPasswordChange
//     // }
//   });
// });

export const AuthController = {
  loginUser,
  refreshToken
};
