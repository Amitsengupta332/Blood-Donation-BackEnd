import { Request, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);

  const result = await userService.registerUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User Registered Successfully",
    data: result,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  console.log(req.query);
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await userService.getAllUser(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data fetched!",
    meta: result.meta,
    data: result.data,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";

  const result = await userService.getMyProfile(token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile retrieved successfully",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";

  const result = await userService.updateMyProfile(token, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile updated successfully",
    data: result,
  });
});

const updateUserInfo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.updateUserInfo(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users profile updated successfully!",
    data: result,
  });
});

const getdonorbyId = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.getdonorbyId(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrive successfully",
    data: result,
  });
});

// const getAllUser = async (req: Request, res: Response) => {
//   const result = await userService.getAllUser();
//   res.status(200).json({
//     success: true,
//     message: "user data fetched successfully",
//     data: result,
//   });
// };

export const userController = {
  registerUser,
  getAllUser,
  getMyProfile,
  updateMyProfile,
  updateUserInfo,
  getdonorbyId
};
