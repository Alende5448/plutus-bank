"use strict";
// import express, { Request, Response, NextFunction } from "express";
// import Beneficiary from "../model/beneficiary";
// import Investment from "../model/investment";
// import User from "../model/user";
// import Transfers, { TRANSFER } from "../model/transfer";
// import TransferToCompanyModel from "../model/investTransfer";
// import { timeStamp } from "console";
// import { v4 } from "uuid";
// import { Sequelize } from "sequelize";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import dotenv from "dotenv";
// import { request } from "http";
// import { Duration } from "../model/company";
// import { boolean, number, string } from "joi";
// import { UUID } from "sequelize";
// import Company from '../model/company'
// dotenv.config()
// export const transferToCompany = async (
//     req: Request,
//     res: Response,
//     NextFunction: NextFunction
//   ) => {
//     const token: any = req.headers.authorization;
//     const token_info = token.split(" ")[1];
//     const decodedToken: any = jwt.verify(token_info, process.env.APP_SECRET!);
//     const {
//         amount,
//         company_id
//       } = req.body;
//       const validatedCompany: any = await Company.findOne({
//         where: { company_id },
//       });
//       if (decodedToken.email) {
//         if (validatedCompany) {
//           const companyAccountNumber = validatedCompany.accountNumber;
//           const sender_id = decodedToken.id;
//           const sender_accountDetails: any = await User.findOne({
//             where: { id: sender_id },
//   });
//   const sender_AccountBalance = sender_accountDetails.accountBalance;
//         const sender_accountNumber = sender_accountDetails.accountNumber;
//         if (
//             +sender_accountNumber !== companyAccountNumber &&
//             +companyAccountNumber === +AccountNumber
//           ){
//             if (sender_AccountBalance >= +amount) {
//                 const successfulTransfer = await TransferToCompanyModel.create({
//                     id: v4(),
//                     userId: sender_id,
//                     AccountNumber: AccountNumber,
//                     amount,
//                     companyName,
//                     status: "SUCCESSFUL",
//                     senderId: sender_id,
//                   });
//                if(successfulTransfer){
//                 const companyOldAccount_Balance = validatedCompany.accountBalance;
//               const companyNewAccountBalance = amount + companyOldAccount_Balance;
//               const fulfilled_transaction = await User.update(
//                 { accountBalance: companyNewAccountBalance },
//                 {
//                   where: {
//                     accountNumber: companyAccountNumber,
//                   },
//                 }
//               );
//               const sender_old_Account_Balance = sender_AccountBalance;
//               const sender_new_Account_Balance = sender_old_Account_Balance - amount;
//               const user_Transaction_Status = await User.update(
//                 { accountBalance: sender_new_Account_Balance },
//                 {
//                   where: {
//                     accountNumber: sender_accountNumber,
//                   },
//                 }
//               );
//               const companyAccNumber = companyAccountNumber;
//                 const expected_beneficiary_balance: any = await User.findOne({
//                   where: { accountNumber: companyAccountNumber },
//                 });
//                 const expected_beneficiary_AccountBalance = expected_beneficiary_balance.accountBalance
//                 if (
//                   companyAccountNumber   !== expected_beneficiary_AccountBalance) {
//                   const pending_transfer = await Transfers.create({
//                     id: v4(),
//                   });
//                }
//           }
// }
// }}
// }
