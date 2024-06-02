import express from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/register", userController.registerUser);
router.get("/donor-list", userController.getAllUser);
router.get(
  "/my-profile",
  auth(UserRole.ADMIN, UserRole.USER),
  userController.getMyProfile
);
router.put("/my-profile", userController.updateMyProfile);
router.patch(
  "/update-user/:id",
  auth(UserRole.ADMIN),
  userController.updateUserInfo
);
export const userRoutes = router;
