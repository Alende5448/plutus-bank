"use strict";
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
exports.getAllTransactions = exports.getAllIncome = exports.getUserDetails = exports.getAllExpenses = void 0;
const transfer_1 = __importDefault(require("../model/transfer"));
const user_1 = __importDefault(require("../model/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getAllExpenses = (req, res, NextFunction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        const user_Id = decodedToken.id;
        if (user_Id) {
            const user_TransactionsDetails = yield transfer_1.default.findAll({
                where: { id: user_Id },
            });
            return res.status(200).json({
                message: "All expenses for user",
                user_TransactionsDetails
            });
        }
        else {
            return res.status(400).json({
                message: "Log in to get transaction details"
            });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.getAllExpenses = getAllExpenses;
const getUserDetails = (req, res, NextFunction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        const user_Id = decodedToken.id;
        if (user_Id) {
            const user_Details = yield user_1.default.findOne({
                where: { id: user_Id },
            });
            return res.status(200).json({
                message: "User's details",
                user_Details
            });
        }
        else {
            return res.status(400).json({
                message: "Log in to get users details"
            });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.getUserDetails = getUserDetails;
const getAllIncome = (req, res, NextFunction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        const user_Id = decodedToken.id;
        const role = user_Id.role;
        if (user_Id && role === "admin") {
            const user_Details = yield user_1.default.findOne({
                where: { id: user_Id },
            });
            const userAccountNumber = user_Details.accountNumber;
            if (userAccountNumber) {
                const userIncome = yield transfer_1.default.findOne({
                    where: { accountNumber: userAccountNumber },
                });
                if (userIncome) {
                    return res.status(200).json({
                        message: "List of user's income",
                        userIncome
                    });
                }
                else {
                    return res.status(400).json({
                        message: "No income yet"
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: "Invalid account number"
                });
            }
        }
        else {
            return res.status(400).json({
                message: "Log in to get users income"
            });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.getAllIncome = getAllIncome;
const getAllTransactions = (req, res, NextFunction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        const user_Id = decodedToken.id;
        const role = user_Id.role;
        if (user_Id && role === "admin") {
            const user_Details = yield user_1.default.findOne({
                where: { id: user_Id },
            });
            const transfer_Details = yield transfer_1.default.findOne({
                where: { id: user_Id },
            });
            const userAccountNumber = user_Details.accountNumber;
            const senderId = transfer_Details.senderId;
            if (userAccountNumber && senderId) {
                const getAllTransactions = yield transfer_1.default.findAll({
                    where: { accountNumber: userAccountNumber, senderId: senderId }
                });
                if (getAllTransactions) {
                    return res.status(200).json({
                        message: "User's transactions",
                        getAllTransactions
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: "No such user present"
                });
            }
        }
        else {
            return res.status(400).json({
                message: "Log in to get users transactions"
            });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.getAllTransactions = getAllTransactions;
