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
exports.getInvestmentsByUser = exports.getUserNotifications = exports.getCompanyDetails = exports.getInvestment = exports.getAllIncome = exports.getUserDetails = exports.getAllExpenses = exports.getUsersInfo = exports.getUsersBalance = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("../../model/user"));
const transfer_1 = __importDefault(require("../../model/transfer"));
const beneficiary_1 = __importDefault(require("../../model/beneficiary"));
const investor_1 = __importDefault(require("../../model/investor"));
const company_1 = __importDefault(require("../../model/company"));
dotenv_1.default.config();
const getUsersBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const payload = token.split(" ")[1];
        const user_details = jsonwebtoken_1.default.verify(payload, process.env.APP_SECRET);
        if (user_details.id) {
            const user_id = user_details.id;
            const user_info = yield user_1.default.findOne({ where: { id: user_id } });
            const user_account_Balance = user_info.accountBalance;
            const user_account_Savings_Wallet_Balance = user_info.savingsWallet.amount;
            return res.status(200).json({
                data: {
                    account_balance: user_account_Balance,
                    savings_wallet: user_account_Savings_Wallet_Balance,
                },
            });
        }
        else {
            res.status(400).json({
                message: "Please LOGIN to get your information",
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.getUsersBalance = getUsersBalance;
// Allows Users to see Total Balance, Total Savings, Transactions History, savings goals and beneficiaries.
const getUsersInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const payload = token.split(" ")[1];
        const user_details = jsonwebtoken_1.default.verify(payload, process.env.APP_SECRET);
        if (user_details.id) {
            const user_id = user_details.id;
            const user_info = yield user_1.default.findOne({ where: { id: user_id } });
            const user_account_Balance = user_info.accountBalance;
            const user_account_Savings_Wallet_Balance = user_info.savingsWallet.amount;
            const user_account_number = user_info.accountNumber;
            const user_account_name = `${user_info.firstName} ${user_info.lastName}`;
            const user_transactions = yield transfer_1.default.findAll({
                where: { senderId: user_id },
            });
            const user_beneficiary = yield beneficiary_1.default.findAll({
                where: { userId: user_id },
            });
            return res.status(200).json({
                data: {
                    account_name: user_account_name,
                    account_number: user_account_number,
                    account_balance: user_account_Balance,
                    savings_wallet: user_account_Savings_Wallet_Balance,
                    transactions_history: user_transactions,
                    beneficiary: user_beneficiary,
                    user: user_info,
                },
            });
        }
        else {
            res.status(400).json({
                message: "Please LOGIN to get your information",
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.getUsersInfo = getUsersInfo;
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
                user_TransactionsDetails,
            });
        }
        else {
            return res.status(400).json({
                message: "Log in to get transaction details",
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
                message: "All user's details",
                user_Details,
            });
        }
        else {
            return res.status(400).json({
                message: "Log in to get users details",
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
        if (user_Id) {
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
                        userIncome,
                    });
                }
                else {
                    return res.status(400).json({
                        message: "No income yet",
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: "Invalid account number",
                });
            }
        }
        else {
            return res.status(400).json({
                message: "Log in to get users income",
            });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.getAllIncome = getAllIncome;
const getInvestment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        // console.log(token);
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        const email = decodedToken.email;
        // console.log("EMAIL", email);
        const investment = yield investor_1.default.findAll({
            where: { email: email },
        });
        // console.log("INVESTOR", investment);
        const allInvestment = yield investor_1.default.findAll();
        console.log(allInvestment);
        if (investment) {
            const totalInvestedCapital = yield investor_1.default.sum("investedCapital", {
                where: { email: email },
            });
            console.log("TOTAL", totalInvestedCapital);
            const totalInvestments = yield investor_1.default.count({
                where: { email: email },
            });
            return res.status(200).json({
                message: "Fetching Investor Successfully",
                data: investment,
                totalInvestedCapital: totalInvestedCapital,
                totalInvestments: totalInvestments,
            });
        }
        else {
            res.status(400).json({
                message: "Error Fetching Investor",
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getInvestment = getInvestment;
const getCompanyDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        if (decodedToken) {
            const user_id = decodedToken.id;
            const user_Info = yield user_1.default.findOne({
                where: { id: user_id }
            });
            const user_role = user_Info.role;
            if (user_role === "user") {
                const getAllCompanies = yield company_1.default.findAll();
                return res.status(200).json({
                    message: `You get have SUCCESSFULLY gotten all companies data.`,
                    data: getAllCompanies
                });
            }
            else {
                return res.status(400).json({
                    message: `SORRY! You are not registered as a USER.`
                });
            }
        }
        else {
            res.status(400).json({
                message: `You are not an authroized user. Token Not Found.`
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: `Internal Server Error getting company details`
        });
    }
});
exports.getCompanyDetails = getCompanyDetails;
const getUserNotifications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        if (decodedToken) {
            const user_id = decodedToken.id;
            const user_details = yield user_1.default.findOne({ where: { id: user_id } });
            const user_role = user_details.role;
            const user_name = `${user_details.firstName} ${user_details.lastName}`;
            if (user_role === "user") {
                const user_transfer_notifications = user_details.notification;
                return res.status(200).json({
                    message: `You have SUCCESSFULLY gotten all transaction notifcations of ${user_name}`,
                    data: user_transfer_notifications
                });
            }
            else {
                return res.status(400).json({
                    message: `Your account is not registered as a user.`
                });
            }
        }
        else {
            return res.status(400).json({
                message: `No Bearer Token for authorization`
            });
        }
    }
    catch (error) {
        console.error("Error getting user notifcations", error);
        res.status(500).json({
            error: "Internal server error, Error getting notifications",
        });
    }
});
exports.getUserNotifications = getUserNotifications;
//   try {
//     const token: any = req.headers.authorization;
//     // console.log(token);
//     const token_info = token.split(" ")[1];
//     const decodedToken: any = jwt.verify(token_info, process.env.APP_SECRET!);
//     const email = decodedToken.email;
//     // console.log("EMAIL", email);
//     const investment = await Investor.findAll({
//       where: { email: email },
//     });
//     console.log("INVESTOR", investment);
//     if (investment) {
//       const totalInvestedCapital = await Investor.sum("investedCapital", {
//         where: { email: email },
//       });
//       console.log("TOTAL", totalInvestedCapital);
//       const totalInvestments = await Investor.count({
//         where: { email: email },
//       });
//       return res.status(200).json({
//         message: "Fetching Investor Successfully",
//         data: investment,
//         totalInvestedCapital: totalInvestedCapital,
//         totalInvestments: totalInvestments,
//         //     returnOnInvestment: investment.dataValues.returnOnInvestment
//       });
//     } else {
//       res.status(400).json({
//         message: "Error Fetching Investor",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
const getInvestmentsByUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companies = yield company_1.default.findAll({
            limit: 8,
            order: [["noOfInvestors", "DESC"]], // Order by highest number of investors
        });
        const companyData = companies.map((company) => {
            return {
                companyName: company.companyName,
                numberOfInvestors: company.noOfInvestors,
                rateOfReturn: company.roi,
            };
        });
        //     console.log("hoss", companyData);
        return res.json({
            data: companyData,
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.getInvestmentsByUser = getInvestmentsByUser;
