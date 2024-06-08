import express from "express";
import { RequestControllers } from "./request.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/donation-request", RequestControllers.requestDonor);

router.get("/donation-request", RequestControllers.getMyDonationRequest);
router.get(
  "/received-request",
  RequestControllers.receivedRequest
);

router.put(
  "/donation-request/:requestId",
  RequestControllers.updateRequestStatus
);

export const requestRoutes = router;
