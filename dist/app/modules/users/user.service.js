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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt = __importStar(require("bcrypt"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const client_1 = require("@prisma/client");
const user_constant_1 = require("./user.constant");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
// const registerUser = async (data: any) => {
//   const hashedPassword: string = await bcrypt.hash(data.password, 12);
//   console.log({ data });
//   const userData = {
//     name: data.name,
//     email: data.email,
//     password: hashedPassword,
//     bloodType: data.bloodType,
//     location: data.location,
//   };
//   const result = await prisma.$transaction(async (transactionClient) => {
//     const createdUserData = await transactionClient.user.create({
//       data: userData,
//     });
//     return createdUserData;
//   });
//   return result;
// };
const registerUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt.hash(data.password, 12);
    const userData = {
        name: data.name,
        email: data.email,
        role: client_1.UserRole.USER,
        password: hashedPassword,
        bloodType: data.bloodType,
        location: data.location,
        availability: data.availability,
    };
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // Operation-1
        const createdUserData = yield transactionClient.user.create({
            data: userData,
        });
        // Operation-2
        const createdProfileData = yield transactionClient.userProfile.create({
            data: {
                bio: data.bio || "",
                age: data.age,
                lastDonationDate: data.lastDonationDate,
                userId: createdUserData.id,
            },
        });
        const { password } = createdUserData, userDataWithoutPassword = __rest(createdUserData, ["password"]);
        // Combine user data and user profile data
        const userDataWithProfile = Object.assign(Object.assign({}, userDataWithoutPassword), { userProfile: createdProfileData });
        return userDataWithProfile;
    }));
    return result;
});
// const registerUser = async (data: any) => {
//   const hashedPassword: string = await bcrypt.hash(data.password, 12);
//   console.log({ data });
//   const userData = {
//     name: data.name,
//     email: data.email,
//     password: hashedPassword,
//     role: UserRole.USER,
//     bloodType: data.bloodType,
//     location: data.location,
//   };
//   const result = await prisma.$transaction(async (transactionClient) => {
//     // Operation-1
//     const createdUserData = await transactionClient.user.create({
//       data: userData,
//     });
//     // Operation-2
//     const createdProfileData = await transactionClient.userProfile.create({
//       data: {
//         bio: data.bio as string,
//         age: data.age as number,
//         lastDonationDate: data.lastDonationDate as string,
//         userId: createdUserData.id as string,
//       },
//     });
//     const { password, ...userDataWithoutPassword } = createdUserData;
//     // Combine user data and user profile data
//     const userDataWithProfile = {
//       ...userDataWithoutPassword,
//       userProfile: createdProfileData,
//     };
//     return userDataWithProfile;
//   });
//   return result;
// };
const getAllUser = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(options);
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    //console.log(filterData);
    if (params.searchTerm) {
        andCondions.push({
            OR: user_constant_1.userSearchAbleFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    //console.dir(andCondions, { depth: 'inifinity' })
    const whereConditons = { AND: andCondions };
    const result = yield prisma_1.default.user.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
    });
    const total = yield prisma_1.default.user.count({
        where: whereConditons,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getMyProfile = (token) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(token);
    // Check if the token is valid or not
    const isTokenValid = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.JWT_ACCESS_SECRET);
    if (!isTokenValid) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "FORBIDDEN");
    }
    console.log(isTokenValid);
    // Check if the user is available in database
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: isTokenValid.email,
        },
        select: {
            id: true,
            name: true,
            email: true,
            bloodType: true,
            location: true,
            availability: true,
            createdAt: true,
            updatedAt: true,
            userProfile: {
                select: {
                    id: true,
                    userId: true,
                    bio: true,
                    age: true,
                    lastDonationDate: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
        },
    });
    return userData;
});
// const getMyProfile = async (token: string) => {
//   console.log(token);
//   // Check if the token is valid or not
//   const isTokenValid = jwtHelpers.verifyToken(
//     token,
//     config.JWT_ACCESS_SECRET as Secret
//   );
//   if (!isTokenValid) {
//     throw new ApiError(httpStatus.FORBIDDEN, "FORBIDDEN");
//   }
//   console.log(isTokenValid);
//   // Check if the user is available in database
//   // const userData = await prisma.user.findUniqueOrThrow({
//   //   where: {
//   //     email: isTokenValid.email,
//   //   },
//   //   select: {
//   //     id: true,
//   //     name: true,
//   //     email: true,
//   //     bloodType: true,
//   //     location: true,
//   //     availability: true,
//   //     createdAt: true,
//   //     updatedAt: true,
//   //     UserProfile: {
//   //       select: {
//   //         id: true,
//   //         userId: true,
//   //         bio: true,
//   //         age: true,
//   //         lastDonationDate: true,
//   //         createdAt: true,
//   //         updatedAt: true,
//   //       },
//   //     },
//   //   },
//   // });
//   const userData = await prisma.user.findUniqueOrThrow({
//     where: {
//       email: isTokenValid.email,
//     },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       bloodType: true,
//       location: true,
//       availability: true,
//       createdAt: true,
//       updatedAt: true,
//       UserProfile: {
//         select: {
//           id: true,
//           userId: true,
//           bio: true,
//           age: true,
//           lastDonationDate: true,
//           createdAt: true,
//           updatedAt: true,
//         },
//       },
//     },
//   });
//   // console.log(userData);
//   return userData;
// };
const updateMyProfile = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { bloodType, location, name, email, availability } = payload, userProfileData = __rest(payload, ["bloodType", "location", "name", "email", "availability"]);
    // Check if the token is valid or not
    const isTokenValid = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.JWT_ACCESS_SECRET);
    if (!isTokenValid) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "FORBIDDEN");
    }
    // Check if the user is available in database
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            email: isTokenValid.email,
        },
    });
    if (!userData) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found! Please try again..");
    }
    // update the user profile
    // const updatedData = await prisma.userProfile.update({
    //   where: {
    //     userId: userData.id,
    //   },
    //   data: payload,
    // });
    // return updatedData;
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const updateUserData = yield transactionClient.user.update({
            where: { id: userData.id },
            data: { bloodType, location, name, email, availability },
        });
        const updateProfileData = yield transactionClient.userProfile.upsert({
            where: { userId: userData.id }, // Use userId for the unique condition
            update: userProfileData, // Update if already exists
            create: {
                age: userProfileData.age,
                bio: userProfileData.bio,
                // gender: userProfileData.gender, // Todo
                lastDonationDate: userProfileData.lastDonationDate,
                user: {
                    connect: { id: userData.id }, // Connect the existing user
                },
            },
        });
        return updateProfileData;
    }));
    return result;
});
const updateUserInfo = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const updateUserStatus = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: updateData,
    });
    return updateUserStatus;
});
const getdonorbyId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id,
            // isDeleted: false,
        },
        select: {
            id: true,
            name: true,
            email: true,
            bloodType: true,
            location: true,
            availability: true,
            createdAt: true,
            updatedAt: true,
            userProfile: {
                select: {
                    id: true,
                    userId: true,
                    bio: true,
                    age: true,
                    lastDonationDate: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
        },
    });
    return result;
});
exports.userService = {
    registerUser,
    getAllUser,
    getMyProfile,
    updateMyProfile,
    updateUserInfo,
    getdonorbyId
};
