import httpStatus from 'http-status';

import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendRespone';
import { UserServices } from './user.service';

const createUser = catchAsync(async (req, res) => {
  const userData = req.body;
 
  const result = await UserServices.createUserInDB(userData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user is created successfully',
    data: result,
  });
});
const getPendingUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getPendingUsersFromDb();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user is retrieve successfully',
    data: result,
  });
});


const createAdmin = catchAsync(async (req, res) => {
  const result = await UserServices.createAdminIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created successfully',
    data: result,
  });
});
const getMe = catchAsync(async (req, res) => {
 const userId = req.params.userId
  const result = await UserServices.getMe(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user  retrieve successfully',
    data: result,
  });
});

// const getAdminInsitData = catchAsync(async (req, res) => {

//   const result = await UserServices.getAdminInsightDataFromDb();

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Admin data  retrieve successfully',
//     data: result,
//   });
// });
const getUserVerificationCode = catchAsync(async (req, res) => {
 const email = req.params.userEmail
  const result = await UserServices.getUserVerificationCodeFromDb(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user data  retrieve successfully',
    data: result,
  });
});
const verifyEmail = catchAsync(async (req, res) => {
   

  const {code } = req.body
 

  const result = await UserServices.verifyEmailFromDb(code as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'email verified successfully', 
    data: result,
  });
});
const updateMyTeligramChanel = catchAsync(async (req, res) => {
  const userEmail = req.params.userEmail;
   const { chanel } = req.body;
   
  const result = await UserServices.updateMyTeligramChanelFromDb(userEmail, chanel);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'teligram updated successfully',
    data: result,
  });
});


export const userControllers = {
  createUser,
  createAdmin,
  getMe,
  getPendingUsers,
  
  verifyEmail,
  getUserVerificationCode,

  updateMyTeligramChanel,
  
};