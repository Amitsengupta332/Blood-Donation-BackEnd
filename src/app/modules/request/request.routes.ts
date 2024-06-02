import express from "express";
import { RequestControllers } from "./request.controller";

const router = express.Router();

router.post("/donation-request", RequestControllers.requestDonor);

router.get("/donation-request", RequestControllers.getMyDonationRequest);

router.put(
  "/donation-request/:requestId",
  RequestControllers.updateRequestStatus
);

export const requestRoutes = router;
