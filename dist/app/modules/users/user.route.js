"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/register", user_controller_1.userController.registerUser);
router.get("/donor-list", user_controller_1.userController.getAllUser);
router.get("/donor-list/:id", user_controller_1.userController.getdonorbyId);
router.get("/my-profile", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), user_controller_1.userController.getMyProfile);
router.put("/my-profile", user_controller_1.userController.updateMyProfile);
router.patch("/update-user/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.userController.updateUserInfo);
exports.userRoutes = router;
