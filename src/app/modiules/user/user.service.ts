/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import {   TUser } from './user.interface';
import {  userModel } from './user.model';

import httpStatus from 'http-status';
import AppError from '../../error/AppEroor';

import { adminModel } from '../admin/admin.model';
import { generateAdminId,  } from './user.utils';
import { TAdmin } from '../admin/admin.interface';
import { sendEmail } from '../../utils/sendEmail';



const createUserInDB = async (payload: TUser) => {
   const newUser = payload;

    // ✅ Ensure a unique ID if required by schema
    // newUser.id = await generateUserId(); 

   

    const result = await userModel.create(newUser);
    

    return result;
 

 

  // Send verification email with the verification code
 

  // await sendEmail(newUser.email, `
  //   <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background-color: #f4f4f4;">
  //     <div style="background-color: white; padding: 20px; border-radius: 8px; text-align: center;">
  //       <h2 style="color: #333;">Verify Your Email Address</h2>
  //       <p style="color: #555;">Thanks for signing up! Please verify your email address by using the code below:</p>
  //       <h3 style="color: #4CAF50;">${verificationCode}</h3>
  //       <p style="color: #555;">Alternatively, you can click the button below to verify:</p>
       
  //       <p style="color: #999; margin-top: 20px;">If you did not request this, you can safely ignore this email.</p>
  //     </div>
  //     <p style="text-align: center; color: #aaa; font-size: 12px; margin-top: 20px;">© 2025 Your Company. All rights reserved.</p>
  //   </div>
  // `,'your email verification code');

  return result;
};


// TODO:add user id to removed current user send requests
const getPendingUsersFromDb = async () => {
  const result = await userModel.find({ isAccountAproved: "pending" });

  return result;
};
const updateMyTeligramChanelFromDb = async (email:string,chanel:string) => {
  const result = await userModel.updateOne({email:email}, { $set: { myChanel:chanel,isAccountAproved:'approved' } });

  return result;
};


const getMe = async (userId:string) => {

  
   const result = await userModel.findById(userId)
  return result;
};
const createAdminIntoDB = async (payload: TAdmin) => {
  // create a user object
  const userData: Partial<TAdmin> = payload;

  //set student role
  userData.role = 'admin';

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    // create a user (transaction-1)
    const newUser = await userModel.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    // set id , _id as user
    payload.id = newUser[0].id;

    // create a admin (transaction-2)
    const newAdmin = await adminModel.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};






// export const getAdminInsightDataFromDb = async () => {
//   // 1) Date boundaries
//   const now = new Date();
//   const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//   const startOfYesterday = new Date(startOfToday);
//   startOfYesterday.setDate(startOfToday.getDate() - 1);
//   const oneMonthAgo = new Date(startOfToday);
//   oneMonthAgo.setMonth(startOfToday.getMonth() - 1);

//   // 2) Fetch all orders (assumes each order.products[i] already contains
//   //    { productId, price, buyPrice, quantity, category } snapshots)
//   const allOrders = await orderModel.find().lean().populate("products");

//   // 3) Helpers
//   const inRange = (d: Date, start: Date, end: Date) => d >= start && d < end;
//   const toDate = (d: any) => (d instanceof Date ? d : new Date(d));

//   // 4) Partition today’s orders
//   const todaysOrders = allOrders.filter(o =>
//     inRange(toDate(o.createdAt), startOfToday, now)
//   );

//   // 5) Core metrics
//   const sumAmt = (orders: any[]) => orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
//   const countByStatus = (orders: any[], status: string) =>
//     orders.filter(o => o.orderStatus === status).length;

//   const todaysSellAmount       = sumAmt(todaysOrders);
//   const todaysCompletedOrders  = countByStatus(todaysOrders, "completed");
//   const todaysPendingOrders    = countByStatus(todaysOrders, "Pending");
//   const totalCompletedOrders   = countByStatus(allOrders, "completed");
//   const lifetimeSellAmount     = sumAmt(allOrders);

//   // Revenue = sum of (totalAmount - buyCost) for completed orders
//   const calcRevenue = (orders: any[]) => orders.reduce((sum, o) => {
//     if (o.orderStatus !== "completed") return sum;
//     const buyCost = Array.isArray(o.products)
//       ? o.products.reduce((s: number, p: any) => s + (p.buyPrice||0)*(p.quantity||1), 0)
//       : 0;
//     return sum + ((o.totalAmount||0) - buyCost);
//   }, 0);

//   const todaysRevenue = calcRevenue(todaysOrders);
//   const totalRevenue  = calcRevenue(allOrders);

//   // 6) Build graphData (last 30 days)
//   const graphData: GraphPoint[] = [];
//   for (let d = new Date(oneMonthAgo); d <= now; d.setDate(d.getDate() + 1)) {
//     const dayStr = d.toISOString().slice(0, 10);
//     const daily = allOrders.filter(o =>
//       toDate(o.createdAt).toISOString().slice(0, 10) === dayStr
//     );
//     graphData.push({
//       date: dayStr,
//       orders: daily.length,
//       amount: daily.reduce((s, o) => s + (o.totalAmount||0), 0),
//     });
//   }

//   // 7) Category pie (today’s sales)
//   // const todayOnly = allOrders.filter(o => toDate(o.createdAt) >= startOfToday);
//   // const catMap: Record<string, number> = {};
//   // todayOnly.forEach(o => {
//   //   if (!Array.isArray(o.products)) return;
//   //   o.products.forEach((p: any) => {
//   //     const id = String(p.category || "uncategorized");
//   //     catMap[id] = (catMap[id]||0) + (p.price||0)*(p.quantity||1);
//   //   });
//   // });
//   // const ids = Object.keys(catMap).filter(id => id !== "uncategorized");
//   // const cats = await categoryModel.find({ _id: { $in: ids } }, { name:1 }).lean();
//   // const nameById = cats.reduce((acc:any,c:any)=>(acc[c._id]=c.name,acc),{});
//   // const grandTotal = Object.values(catMap).reduce((s,v)=>s+v,0)||1;
//   // const categorySales: PieSlice[] = Object.entries(catMap).map(([id,amt])=>({
//   //   categoryId: id,
//   //   categoryName: nameById[id]||"Uncategorized",
//   //   amount: amt,
//   //   percentage: Math.round((amt/grandTotal)*10000)/100,
//   // }));

//   const categorySalesMap: Record<string, number> = {};

//   todaysOrders.forEach(order => {
//     console.log("Processing order:", order._id);
//     if (order.orderStatus !== "completed") return;
//     console.log("Order is completed:", order._id);
   
 
//     order.products.forEach((p: any) => {
//       console.log("Processing product:", p);
//       const catId = String(p.category || "uncategorized");
//       console.log("Processing product:", p._id, "in category:", catId);
//       const saleAmount = (p.sellprice || 0) * (p.quantity || 1);
//       categorySalesMap[catId] = (categorySalesMap[catId] || 0) + saleAmount;
//     });
//   });
  

// // Find the top category ID
// const sortedCategories = Object.entries(categorySalesMap).sort(
//   (a, b) => b[1] - a[1]
// );

// let trendingCategory = "N/A";

// if (sortedCategories.length > 0) {
//   const [topCatId] = sortedCategories[0];
//   const catDoc = await CategoryModel.findById(topCatId).lean();
//   trendingCategory = catDoc?.name || "Uncategorized";
// }

//   for (const o of allOrders) {
//     if (o.orderStatus !== "completed") continue;
  
//     // Check if statements already exist for this orderId
//     const existing = await JabedaModel.findOne({ orderId: o._id }).lean();
//     if (existing) {
//       // Already saved, skip to next order
//       continue;
//     }
  
//     const date = o.createdAt.toISOString().slice(0, 10);
  
   
  
//     const sale = o.totalAmount || 0;
  
//     const creditStmt = new JabedaModel({
//       orderId: o._id,
//       type: "Credit",
//       description: `Sale revenue for order ${o._id}`,
//       amount: sale,
//       date,
//     });
//     await creditStmt.save();
  
//     const debitStmt = new JabedaModel({
//       orderId: o._id,
//       type: "Debit",
//       description: `Buying cost for order ${o._id}`,
//       amount: o.products.buyPrice,
//       date,
//     });
//     await debitStmt.save();
//   }
  
  
//   // After all are saved, fetch all statements (including manual)
//   const jabedaStatements = await JabedaModel.find()
//     .sort({ date: -1, _id: -1 })
//     .lean();
  
//   // Compute current balance
//   const currentBalance = jabedaStatements.reduce(
//     (bal, e) => (e.type === "Credit" ? bal + e.amount : bal - e.amount),
//     0
//   );
  
  
  
//   const pendingAccounts = await userModel.countDocuments({ isAccountAproved: "pending" });
//   const currentProducts = await productModel.countDocuments();


  
//   // 9) Return everything
//   return {
//     todaysSellAmount,
//     todaysCompletedOrders,
//     todaysPendingOrders,
//     totalCompletedOrders,
//     lifetimeSellAmount,
//     todaysRevenue,
//     totalRevenue,
//     currentBalance,
//     graphData,
//     pendingAccounts,
//     jabedaStatements,
//     currentProducts,
//     trendingCategory,
//     getMyChanelFromDb
//   };
// };




 const getUserVerificationCodeFromDb = async (userEmail: string) => {
 
  if (!userEmail) {
    throw new AppError(httpStatus.BAD_REQUEST, "User email is required");
  }

  const user = await userModel.findOne({ email: userEmail });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!user.emailVerificationCode) {
    throw new AppError(httpStatus.NOT_FOUND, "No verification code found for this user");
  }

  return {
    emailVerificationCode: user.emailVerificationCode,
    isEmailVerified: user.emailVerified,
  };
};

const verifyEmailFromDb = async (code: string) => {
  if (!code || typeof code !== 'string') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or expired verification token');
  }
  const user = await userModel.findOne({ emailVerificationCode: code });
   if (!user) {
   throw new AppError(httpStatus.NOT_FOUND, 'Invalid or expired verification token');
  }
  
  user.emailVerified = true;
  user.emailVerificationCode = null; 
  await user.save();
 await sendEmail(user.email, `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background-color: #f4f4f4;">
      <div style="background-color: white; padding: 20px; border-radius: 8px; text-align: center;">
        <h2 style="color: #333;">Verify Your Email Address</h2>
        <p style="color: #555;">Thanks for signing up! Please verify your email address by using the code below:</p>
        
        <p style="color: #555;">Alternatively, you can click the button below to verify:</p>
       
        <p style="color: #999; margin-top: 20px;">If you did not request this, you can safely ignore this email.</p>
      </div>
      <p style="text-align: center; color: #aaa; font-size: 12px; margin-top: 20px;">© 2025 Your Company. All rights reserved.</p>
    </div>
  `,'welcome to our platform, your email is verified successfully');
}



export const UserServices = {
  createUserInDB,
  createAdminIntoDB,
  getMe,
  getPendingUsersFromDb,
 verifyEmailFromDb,
 getUserVerificationCodeFromDb,
 updateMyTeligramChanelFromDb,
 
};