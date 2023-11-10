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
exports.getAllTransactions = exports.getAllUsersByAdmin = exports.trackFailedTransaction = exports.trackSuccessfulTransaction = exports.getUsersByAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("../../model/user"));
const transfer_1 = __importDefault(require("../../model/transfer"));
const pagination_1 = require("../../utils/pagination");
dotenv_1.default.config();
const getUsersByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        const user_id = decodedToken.id;
        const user_details = yield user_1.default.findOne({ where: { id: user_id } });
        const user_role = user_details.role;
        console.log(user_role);
        if (user_role === "admin") {
            const getAllUsers = yield user_1.default.findAll();
            return res.status(200).json({
                message: `User Successfully gotten`,
                data: getAllUsers,
            });
        }
        else {
            return res.status(400).json({
                message: "You are not an admin user",
            });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.getUsersByAdmin = getUsersByAdmin;
// const failed_transaction = await Transfers.findAll({ where: { status: trans_status})
const trackSuccessfulTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        const getting_user_role = yield user_1.default.findOne({
            where: { id: decodedToken.id },
        });
        const user_role = getting_user_role.role;
        if (user_role === "admin") {
            const trans_status = "SUCCESSFUL";
            const successfulTransaction = yield transfer_1.default.findAll({
                where: { status: trans_status },
            });
            if (!successfulTransaction) {
                return res.status(404).json({
                    message: `Failed to fetch Successful Transactions`,
                });
            }
            else {
                return res.status(200).json({
                    message: `Successful Transactions`,
                    data: successfulTransaction,
                });
            }
        }
        else {
            return res.status(400).json({
                message: `You are not an admin`,
            });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.trackSuccessfulTransaction = trackSuccessfulTransaction;
// export const trackFailedTransaction = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const token: any = req.headers.authorization;
//     const token_info = token.split(" ")[1];
//     const decodedToken: any = jwt.verify(token_info, process.env.APP_SECRET!);
//     const user_id = decodedToken.id;
//     const trans_statuss = "FAILED";
//     const failedTransaction = await Transfers.findAll({
//       where: { status: trans_statuss },
//     });
//     if (failedTransaction) {
//       return res.status(200).json({
//         message: `Failed Transactions`,
//         data: failedTransaction,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };
const trackFailedTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        const getting_user_role = yield user_1.default.findOne({
            where: { id: decodedToken.id },
        });
        const user_role = getting_user_role.role;
        if (user_role === "admin") {
            const trans_status = "FAILED";
            const failedTransaction = yield transfer_1.default.findAll({
                where: { status: trans_status },
            });
            if (!failedTransaction) {
                return res.status(404).json({
                    message: `Failed to fetch Failed Transactions`,
                });
            }
            else {
                return res.status(200).json({
                    message: `Failed Transactions`,
                    data: failedTransaction,
                });
            }
        }
        else {
            return res.status(400).json({
                message: `You are not an admin`,
            });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.trackFailedTransaction = trackFailedTransaction;
const getAllUsersByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let page = 1;
        if (req.query.page) {
            page = parseInt(req.query.page);
            if (Number.isNaN(page)) {
                return res.status(400).json({
                    message: "Invalid page number",
                });
            }
        }
        const pageSize = 10;
        const offset = (page - 1) * pageSize;
        const getUsersAdmin = yield user_1.default.findAll();
        const totalPages = Math.ceil(getUsersAdmin.length / pageSize);
        if (page > totalPages) {
            page = totalPages;
        }
        const allUsers = getUsersAdmin.slice(offset, page * pageSize);
        return res.status(200).json({
            allUsers,
            currentPage: page,
            totalPages,
        });
    }
    catch (err) {
        console.error("Error executing getUsers:", err);
        return res.status(500).json({
            Error: "Internal Server Error",
        });
    }
});
exports.getAllUsersByAdmin = getAllUsersByAdmin;
const getAllTransactions = (req, res, NextFunction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        const user_Id = decodedToken.id;
        if (user_Id) {
            if (user_Id) {
                const user_Details = yield user_1.default.findOne({
                    where: { id: user_Id },
                });
                const transfer_Details = yield transfer_1.default.findAll({
                    where: { senderId: user_Id },
                });
                const userAccountNumber = user_Details.accountNumber;
                const senderId = user_Id;
                if (userAccountNumber && senderId) {
                    const page = Number(req.query.page) || 1;
                    const limit = Number(req.query.limit) || 10;
                    const { offset, limit: paginationLimit } = (0, pagination_1.getPagination)({
                        page,
                        limit,
                    });
                    const getAllTransactions = yield transfer_1.default.findAndCountAll({
                        where: { senderId: senderId },
                        offset,
                        limit: paginationLimit,
                    });
                    if (getAllTransactions) {
                        return res.status(200).json({
                            message: `User's transactions`,
                            transactions: getAllTransactions.rows,
                            totalCount: getAllTransactions.count,
                            currentPage: page,
                            totalPages: Math.ceil(getAllTransactions.count / limit),
                        });
                    }
                }
                else {
                    return res.status(400).json({ message: "No such user present" });
                }
            }
            else {
                return res
                    .status(400)
                    .json({ message: "Login to get users transactions" });
            }
        }
    }
    catch (error) {
        return res.status(500).json({ message: "An error occurred" });
    }
});
exports.getAllTransactions = getAllTransactions;
