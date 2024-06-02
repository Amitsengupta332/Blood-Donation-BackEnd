"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestRoutes = void 0;
const express_1 = __importDefault(require("express"));
const request_controller_1 = require("./request.controller");
const router = express_1.default.Router();
router.post("/donation-request", request_controller_1.RequestControllers.requestDonor);
router.get("/donation-request", request_controller_1.RequestControllers.getMyDonationRequest);
router.put("/donation-request/:requestId", request_controller_1.RequestControllers.updateRequestStatus);
exports.requestRoutes = router;
