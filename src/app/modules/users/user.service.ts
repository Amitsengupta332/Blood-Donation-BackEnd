import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import { IUserFilterRequest } from "./user.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { Prisma, UserRole, UserStatus } from "@prisma/client";
import { userSearchAbleFields } from "./user.constant";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

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

const registerUser = async (data: any) => {
  const hashedPassword: string = await bcrypt.hash(data.password, 12);

  const userData = {
    name: data.name,
    email: data.email,
    role: UserRole.USER,
    password: hashedPassword,
    bloodType: data.bloodType,
    location: data.location,
    availability: data.availability,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    // Operation-1
    const createdUserData = await transactionClient.user.create({
      data: userData,
    });
    // Operation-2
    const createdProfileData = await transactionClient.userProfile.create({
      data: {
        bio: (data.bio as string) || "",
        age: data.age as number,
        lastDonationDate: data.lastDonationDate as string,
        userId: createdUserData.id as string,
      },
    });

    const { password, ...userDataWithoutPassword } = createdUserData;

    // Combine user data and user profile data
    const userDataWithProfile = {
      ...userDataWithoutPassword,
      userProfile: createdProfileData,
    };

    return userDataWithProfile;
  });

  return result;
};

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

const getAllUser = async (
  params: IUserFilterRequest,
  options: IPaginationOptions
) => {
  console.log(options);
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.UserWhereInput[] = [];

  //console.log(filterData);
  if (params.searchTerm) {
    andCondions.push({
      OR: userSearchAbleFields.map((field) => ({
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
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  //console.dir(andCondions, { depth: 'inifinity' })
  const whereConditons: Prisma.UserWhereInput = { AND: andCondions };

  const result = await prisma.user.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.user.count({
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
};

const getMyProfile = async (token: string) => {
  console.log(token);
  // Check if the token is valid or not
  const isTokenValid = jwtHelpers.verifyToken(
    token,
    config.JWT_ACCESS_SECRET as Secret
  );
  if (!isTokenValid) {
    throw new ApiError(httpStatus.FORBIDDEN, "FORBIDDEN");
  }
  console.log(isTokenValid);

  // Check if the user is available in database
  const userData = await prisma.user.findUniqueOrThrow({
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
};

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

const updateMyProfile = async (token: string, payload: any) => {
  const { bloodType, location, name, email, availability, ...userProfileData } =
    payload;
  // Check if the token is valid or not
  const isTokenValid = jwtHelpers.verifyToken(
    token,
    config.JWT_ACCESS_SECRET as Secret
  );

  if (!isTokenValid) {
    throw new ApiError(httpStatus.FORBIDDEN, "FORBIDDEN");
  }

  // Check if the user is available in database
  const userData = await prisma.user.findUnique({
    where: {
      email: isTokenValid.email,
    },
  });

  if (!userData) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User not found! Please try again.."
    );
  }

  // update the user profile
  // const updatedData = await prisma.userProfile.update({
  //   where: {
  //     userId: userData.id,
  //   },
  //   data: payload,
  // });

  // return updatedData;

  const result = await prisma.$transaction(async (transactionClient) => {
    const updateUserData = await transactionClient.user.update({
      where: { id: userData.id },
      data: { bloodType, location, name, email, availability },
    });

    const updateProfileData = await transactionClient.userProfile.upsert({
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
  });

  return result;
};

const updateUserInfo = async (
  id: string,
  updateData: { role?: UserRole; activeStatus?: UserStatus }
) => {
  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: updateData,
  });

  return updateUserStatus;
};

const getdonorbyId = async (id: string) => {
  const result = await prisma.user.findUnique({
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
};


export const userService = {
  registerUser,
  getAllUser,
  getMyProfile,
  updateMyProfile,
  updateUserInfo,
  getdonorbyId
};
