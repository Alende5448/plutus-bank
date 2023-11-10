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
exports.transferToInvestmentCompany = exports.transferToSavingsWallet = exports.transferToBeneficiary = void 0;
const user_1 = __importDefault(require("../model/user"));
const transfer_1 = __importDefault(require("../model/transfer"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const company_1 = __importDefault(require("../model/company"));
const investmentRecord_1 = __importDefault(require("../model/investmentRecord"));
const investor_1 = __importDefault(require("../model/investor"));
dotenv_1.default.config();
const transferToBeneficiary = (req, res, NextFunction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        const { accountNumber, amount, transfer_purpose, beneficiary_name, beneficiary_email, payer_reference, information_for_beneficiary, } = req.body;
        const validated_Beneficiary = yield user_1.default.findOne({
            where: { accountNumber },
        });
        if (decodedToken.email) {
            if (validated_Beneficiary) {
                const beneficiary_AccountNumber = validated_Beneficiary.accountNumber;
                const sender_id = decodedToken.id;
                const sender_accountDetails = yield user_1.default.findOne({
                    where: { id: sender_id },
                });
                const sender_AccountBalance = sender_accountDetails.accountBalance;
                const sender_accountNumber = sender_accountDetails.accountNumber;
                if (+sender_accountNumber !== +beneficiary_AccountNumber &&
                    +beneficiary_AccountNumber === +accountNumber) {
                    if (sender_AccountBalance > amount) {
                        const sucessful_transfer = yield transfer_1.default.create({
                            id: (0, uuid_1.v4)(),
                            accountNumber,
                            amount,
                            transfer_purpose,
                            beneficiary_name,
                            beneficiary_email,
                            payer_reference,
                            information_for_beneficiary,
                            status: "SUCCESSFUL",
                            senderId: sender_id,
                        });
                        if (sucessful_transfer) {
                            const beneficiary_old_Account_Balance = validated_Beneficiary.accountBalance;
                            const beneficiary_new_AccountBalance = amount + beneficiary_old_Account_Balance;
                            const fulfilled_transaction = yield user_1.default.update({ accountBalance: beneficiary_new_AccountBalance }, {
                                where: {
                                    accountNumber: beneficiary_AccountNumber,
                                },
                            });
                            const sender_old_Account_Balance = sender_AccountBalance;
                            const sender_new_Account_Balance = sender_old_Account_Balance - amount;
                            const user_Transaction_Status = yield user_1.default.update({ accountBalance: sender_new_Account_Balance }, {
                                where: {
                                    accountNumber: sender_accountNumber,
                                },
                            });
                            const beneficiary_AccNumber = beneficiary_AccountNumber;
                            const expected_beneficiary_balance = yield user_1.default.findOne({
                                where: { accountNumber: beneficiary_AccNumber },
                            });
                            const expected_beneficiary_AccountBalance = expected_beneficiary_balance.accountBalance;
                            if (beneficiary_new_AccountBalance !==
                                expected_beneficiary_AccountBalance) {
                                const pending_transfer = yield transfer_1.default.create({
                                    id: (0, uuid_1.v4)(),
                                    accountNumber,
                                    amount,
                                    transfer_purpose,
                                    beneficiary_name,
                                    beneficiary_email,
                                    payer_reference,
                                    information_for_beneficiary,
                                    status: "PENDING",
                                    senderId: sender_id,
                                });
                                return res.status(400).json({
                                    message: "Transaction PENDING",
                                });
                            }
                            if (fulfilled_transaction && user_Transaction_Status) {
                                const sucessful_transfer = yield transfer_1.default.create({
                                    id: (0, uuid_1.v4)(),
                                    accountNumber,
                                    amount,
                                    transfer_purpose,
                                    beneficiary_name,
                                    beneficiary_email,
                                    payer_reference,
                                    information_for_beneficiary,
                                    status: "SUCCESSFUL",
                                    senderId: sender_id,
                                });
                                return res.status(200).json({
                                    message: "Transaction Successful",
                                });
                            }
                            else {
                                const failed_transfer = yield transfer_1.default.create({
                                    id: (0, uuid_1.v4)(),
                                    accountNumber,
                                    amount,
                                    transfer_purpose,
                                    beneficiary_name,
                                    beneficiary_email,
                                    payer_reference,
                                    information_for_beneficiary,
                                    status: "FAILED",
                                    senderId: sender_id,
                                });
                                return res.status(400).json({
                                    message: "Transaction Failed",
                                });
                            }
                        }
                    }
                    else {
                        return res.status(400).json({
                            message: "Insufficient Funds",
                        });
                    }
                }
                else {
                    return res.status(400).json({
                        message: "Cannot make TRANSFER. Please check details properly.",
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: "Beneficiary Account Number is not found",
                });
            }
        }
        else {
            return res.status(400).json({
                message: "You must be LOGGED IN to make a transfer",
            });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.transferToBeneficiary = transferToBeneficiary;
const transferToSavingsWallet = (req, res, NextFunction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        if (decodedToken.email) {
            const { amount } = req.body;
            const user_id = decodedToken.id;
            const user_info = yield user_1.default.findOne({ where: { id: user_id } });
            const user_savings_balance = user_info.savingsWallet;
            const user_balance_amount = user_savings_balance.amount;
            const user_accountBalance = user_info.accountBalance;
            if (amount < user_accountBalance) {
                const new_Savings_Balance = user_balance_amount + amount;
                const savings_wallet_obj = { id: user_id, amount: new_Savings_Balance };
                const current_savings_balance = yield user_1.default.update({ savingsWallet: savings_wallet_obj }, {
                    where: {
                        id: user_id,
                    },
                });
                const user_new_balance = user_accountBalance - amount;
                const updating_user_balance = yield user_1.default.update({ accountBalance: user_new_balance }, {
                    where: {
                        id: user_id,
                    },
                });
                if (current_savings_balance && updating_user_balance) {
                    return res.status(200).json({
                        message: "Amount Transferred to Savings Wallet",
                    });
                }
                else {
                    return res.status(400).json({
                        message: "Transfer pending",
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: "You do not have sufficient balance to execute this savings transfer",
                });
            }
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.transferToSavingsWallet = transferToSavingsWallet;
const transferToInvestmentCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        if (decodedToken.email) {
            const user_id = decodedToken.id;
            const { amount, company_account_number } = req.body;
            const user_details = yield user_1.default.findOne({ where: { id: user_id } });
            const user_account_balance = user_details.accountBalance;
            const user_account_number = user_details.accountNumber;
            const user_firstName = user_details.firstName;
            const user_lastName = user_details.lastName;
            if (user_account_balance > amount) {
                const user_new_balance = user_account_balance - amount;
                const investment_Transfer = yield user_1.default.update({ accountBalance: user_new_balance }, {
                    where: {
                        accountNumber: user_account_number,
                    },
                });
                const company_details = yield company_1.default.findOne({
                    where: { accountNumber: company_account_number },
                });
                const company_rateOfReturn = company_details.roi;
                const company_name = company_details.companyName;
                const company_id = company_details.id;
                const company_account_balance = company_details.wallet;
                const comapany_wallet_balance = amount + company_account_balance;
                const successful_Transfer = yield company_1.default.update({ wallet: comapany_wallet_balance }, {
                    where: {
                        accountNumber: company_account_number,
                    },
                });
                if (investment_Transfer && successful_Transfer) {
                    const sucessful_transaction_record = yield investmentRecord_1.default.create({
                        id: (0, uuid_1.v4)(),
                        amount: amount,
                        investor_name: user_firstName + " " + user_lastName,
                        investor_id: user_id,
                        investment_company_id: company_id,
                        transaction_status: "SUCCESSFUL",
                    });
                    yield investor_1.default.create({
                        id: (0, uuid_1.v4)(),
                        firstName: user_details.firstName,
                        lastName: user_details.lastName,
                        accountNumber: user_details.accountNumber,
                        email: user_details.email,
                        investedCapital: amount,
                        expectedReturn: amount * company_details.roi,
                        monthlyReturn: (amount * company_details.roi) / 4,
                        active: true,
                        companyId: company_id,
                        companyName: company_name,
                        rateOfReturn: company_rateOfReturn,
                    });
                    return res.status(200).json({
                        message: `Transfer SUCCESSFUL!!`,
                        data: sucessful_transaction_record,
                    });
                }
                else {
                    const failed_transaction_record = yield investmentRecord_1.default.create({
                        id: (0, uuid_1.v4)(),
                        amount: amount,
                        investor_name: user_firstName + " " + user_lastName,
                        investor_id: user_id,
                        investment_company_id: company_id,
                        transaction_status: "FAILED",
                    });
                    return res.status(400).json({
                        message: `Transfer is UNSUCESSFUL. Please wait for some minutes and try again.`,
                        data: failed_transaction_record,
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: `Sorry! You do not have sufficient funds to make this investment. Please credit your account`,
                });
            }
        }
        else {
            return res.status(400).json({
                message: `Kindly login.`,
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.transferToInvestmentCompany = transferToInvestmentCompany;
const investmentInfoForUsers = (req, res, next) => { };
