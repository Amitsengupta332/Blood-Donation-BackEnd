import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { RequestServices } from "./request.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const requestDonor = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";

  const result = await RequestServices.requestDonor(token, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Request successfully made",
    data: result,
  });
});

const getMyDonationRequest = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";

  const result = await RequestServices.getMyDonationRequestFromDB(token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donation requests retrieved successfully",
    data: result,
  });
});

const receivedRequest = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";

  const result = await RequestServices.receivedRequest(token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donation received   successfully",
    data: result,
  });
});

const updateRequestStatus = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";
  const { requestId } = req.params;

  const result = await RequestServices.updateRequestStatusIntoDB(
    token,
    requestId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donation request status successfully updated",
    data: result,
  });
});

export const RequestControllers = {
  requestDonor,
  getMyDonationRequest,
  updateRequestStatus,
  receivedRequest
};
