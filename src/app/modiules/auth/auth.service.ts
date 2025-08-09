/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import config from '../../config';
import AppError from '../../error/AppEroor';
import { JwtPayload } from 'jsonwebtoken';
import { userModel } from '../user/user.model';
import { createToken } from './auth.utils';
import { TLoginUser } from './auth.interface';

const loginUser = async (payload: TLoginUser) => {
  console.log(payload);
  const isUserExists = await userModel.findOne({ email: payload.email });
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found');
  }

  const isPasswordValid = await bcrypt.compare(payload.password, isUserExists.password);
if (!isPasswordValid) {
  throw new AppError(httpStatus.FORBIDDEN, 'Wrong password');
}

  const isUserDeleted = await userModel.findOne({ isDeleted: true });

  if (isUserDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'user deleted ');
  }

  const jwtPayload = {
    _id: isUserExists._id,
    userId: isUserExists.id,
    role: isUserExists.role,
    username: isUserExists.username,
    name: isUserExists.name,
    profilePicture: isUserExists.profilePicture,
    email: isUserExists.email,
    
  };

  const accessToken = createToken(
    jwtPayload,
    config.access_secret_key as string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config.JWT_ACCESS_EXPIRES_IN as string | any  ,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.refresh_secret_key as string,
    config.JWT_REFRESH_EXPIRES_IN as string |any,
  );

  return {
    accessToken,
    refreshToken,
    user: isUserExists,
  };
};
const getRefreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'refresh token is required ');
  }
  const decoded = jwt.verify(
    token,
    config.refresh_secret_key as string,
  ) as JwtPayload;

  const { userId, role } = decoded;
  const user = await userModel.find({ userId });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found');
  }

  const isUserDeleted = await userModel.findOne({ isDeleted: true });

  if (isUserDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'user deleted ');
  }
  const jwtPayload = {
    userId,
    role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.access_secret_key as string,
    config.JWT_ACCESS_EXPIRES_IN as string | any,
  );
  return { accessToken };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
   const isUserExists = await userModel.findOne({ email: userData.email });
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found');
  }
  // checking if the user is exist
  

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // checking if the user is blocked

  const userStatus = isUserExists?.status;

  if (userStatus === 'BLOCKED') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  //checking if the password is correct

  if (!(await userModel.isPasswordMatched(payload.oldPassword, isUserExists?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round)
  );

  await userModel.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    }
  );

  return null;
};
// const forgetPassword = async (email: string) => {
//   // checking if the user is exist
//   const user = await userModel.findOne({ email: email});

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
//   }
//   // checking if the user is already deleted
//   const isDeleted = user?.isDeleted;

//   if (isDeleted) {
//     throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
//   }

//   // checking if the user is blocked
//   const userStatus = user?.status;

//   if (userStatus === 'BLOCKED') {
//     throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
//   }

//   const jwtPayload = {
//     email: user.email,
//     role: user.role,
//   };

//   const resetToken = createToken(
//     jwtPayload,
//     config.access_secret_key as string,
//     '10m',
//   );

// //   const resetUILink = `${config.reset_pass_ui_link}?email=${user.email}&token=${resetToken} `;

// //   sendEmail(user.email, resetUILink);

  
// };

// const resetPassword = async (
//   payload: { email: string; newPassword: string },
//   token: string,
// ) => {
//   console.log(payload.newPassword);

//   // Checking if the user exists
//   const user = await userModel.findOne({ email: payload.email });
//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
//   }

//   // Checking if the user is deleted
//   if (user.isDeleted) {
//     throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
//   }

//   // Checking if the user is blocked
//   if (user.status === 'BLOCKED') {
//     throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
//   }

//   // Verifying the token
//   const decoded = jwt.verify(
//     token,
//     config.access_secret_key as string,
//   ) as JwtPayload;

//   if (payload.email !== decoded.email) {
//     console.log(payload.email, decoded.email);
//     throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
//   }

//   // Hashing the new password
//   const newHashedPassword = await bcrypt.hash(
//     payload.newPassword,
//     Number(config.bcrypt_salt_round),
//   );

//   // Log the hashed password
 

//   // Updating the user's password
//   const result = await userModel.findOneAndUpdate(
//     {
//       email: decoded.email,
//       role: decoded.role,
//     },
//     {
//       password: newHashedPassword,
//     },
//     { new: true } // Return the updated document
//   );

//   // Log the updated user


//   if (!result) {
//     throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update password');
//   }

//   return result;
// };

export const AuthServices = {
  loginUser,
  getRefreshToken,
  changePassword,
//   forgetPassword,
//   resetPassword
};