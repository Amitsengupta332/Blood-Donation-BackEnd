"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const config_1 = __importDefault(require("../../../config"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt = __importStar(require("bcrypt"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const client_1 = require("@prisma/client");
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check: if the user available
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (!userData) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found! Please try again..");
    }
    // check: if the password correct
    const isCorrectPassword = yield bcrypt.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password incorrect! Please try again..");
    }
    // Create access token
    const tokenData = {
        email: userData.email,
        role: userData.role,
        id: userData.id,
    };
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken(tokenData, config_1.default.JWT_ACCESS_SECRET, config_1.default.JWT_ACCESS_TOKEN_EXPIRES_IN);
    // Create refresh token
    const refreshToken = jwtHelpers_1.jwtHelpers.generateToken(tokenData, config_1.default.JWT_REFRESH_SECRET, config_1.default.JWT_REFRESH_TOKEN_EXPIRES_IN);
    return {
        userData,
        accessToken,
        refreshToken,
    };
});
const refreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    // Decoded the refresh token and verity
    let decodedData;
    try {
        decodedData = jwtHelpers_1.jwtHelpers.verifyToken(refreshToken, config_1.default.JWT_REFRESH_SECRET);
    }
    catch (error) {
        throw new Error("You are not authorized!");
    }
    // Check if the user is available in database or not
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData === null || decodedData === void 0 ? void 0 : decodedData.email,
            activeStatus: client_1.UserStatus.ACTIVATE,
        },
    });
    // if refresh token is verify and user is exist in database then create access token again
    const tokenData = {
        email: userData.email,
        role: userData.role,
        id: userData.id,
    };
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken(tokenData, config_1.default.JWT_ACCESS_SECRET, config_1.default.JWT_ACCESS_TOKEN_EXPIRES_IN);
    return {
        accessToken,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user is available in database
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            activeStatus: client_1.UserStatus.ACTIVATE,
        },
    });
    // check: if the old(current) password is correct
    const isCorrectPassword = yield bcrypt.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password incorrect!");
    }
    // hash the password
    const hashedPassword = yield bcrypt.hash(payload.newPassword, 12);
    // update the new password
    yield prisma_1.default.user.update({
        where: {
            email: userData.email,
            activeStatus: client_1.UserStatus.ACTIVATE,
        },
        data: {
            password: hashedPassword,
        },
    });
    return {
        message: "Password changed successfully!",
    };
});
// const loginUser = async (payload: { email: string; password: string }) => {
//   //   console.log("user logged in .....", payload);
//   const userData = await prisma.user.findUniqueOrThrow({
//     where: {
//       email: payload.email,
//     },
//   });
//   if (!userData) {
//     throw new ApiError(
//       httpStatus.NOT_FOUND,
//       "User not found! Please try again.."
//     );
//   }
//   // check: if the password correct
//   const isCorrectPassword: boolean = await bcrypt.compare(
//     payload.password,
//     userData.password
//   );
//   if (!isCorrectPassword) {
//     throw new Error("Password incorrect! Please try again..");
//   }
//   // const accessToken = jwtHelpers.generateToken(
//   //   {
//   //     email: userData.email,
//   //   },
//   //   config.jwt.jwt_secret as Secret,
//   //   config.jwt.expires_in as string
//   // );
//   // Create access token
//   const tokenData = { email: userData.email };
//   const accessToken = jwtHelpers.generateToken(
//     tokenData,
//     config.jwt.jwt_secret as Secret,
//     config.jwt.expires_in as string
//   );
//   // const refreshToken = jwtHelpers.generateToken(
//   //   {
//   //     email: userData.email,
//   //   },
//   //   config.jwt.refresh_token_secret as Secret,
//   //   config.jwt.refresh_token_expires_in as string
//   // );
//   // Create refresh token
//   const refreshToken = jwtHelpers.generateToken(
//     tokenData,
//     config.jwt.jwt_secret as Secret,
//     config.jwt.expires_in as string
//   );
//   return {
//     userData,
//     accessToken,
//     refreshToken,
//   };
// };
exports.AuthServices = {
    loginUser,
    refreshToken,
    changePassword
};
