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
const user_1 = __importDefault(require("../../model/user"));
const transfer_1 = __importDefault(require("../../model/transfer"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
const company_1 = __importDefault(require("../../model/company"));
const investmentRecord_1 = __importDefault(require("../../model/investmentRecord"));
const investor_1 = __importDefault(require("../../model/investor"));
const inputvalidation_1 = require("../../utils/inputvalidation");
dotenv_1.default.config();
const transferToBeneficiary = (req, res, NextFunction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = inputvalidation_1.transfer_Beneficiary;
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
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
                if (+sender_accountNumber !== +beneficiary_AccountNumber && +beneficiary_AccountNumber === +accountNumber) {
                    if (sender_AccountBalance > amount) {
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
                        if (beneficiary_new_AccountBalance !== expected_beneficiary_AccountBalance) {
                            const update_beneficiary_accountBalance = yield user_1.default.update({ accountBalance: beneficiary_old_Account_Balance }, { where: { accountNumber: beneficiary_AccNumber } });
                            const update_sender_accountBalance = yield user_1.default.update({ accountBalance: sender_old_Account_Balance }, { where: { accountNumber: sender_accountNumber } });
                            if (update_beneficiary_accountBalance && update_sender_accountBalance) {
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
                                    message: "Transaction PENDING. Please wait for few minutes before trying again.",
                                    data: pending_transfer
                                });
                            }
                            else {
                                return res.status(400).json({
                                    message: `PENDING TRANSACTION. Please contact customer service or go to the nearest plutus branch.`
                                });
                            }
                        }
                        else {
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
                                let sender_notification = sender_accountDetails.notification;
                                let beneficiary_notifcation = validated_Beneficiary.notification;
                                const timestamp = new Date().getTime();
                                const date = new Date(timestamp);
                                const year = date.getFullYear();
                                const month = date.getMonth() + 1;
                                const transfer_date = date.getDate();
                                const hours = date.getHours().toString().padStart(2, "0");
                                const minutes = date.getMinutes().toString().padStart(2, "0");
                                const seconds = date.getSeconds().toString().padStart(2, "0");
                                let debit_transfer_alert = {
                                    Txn: "DEDIT",
                                    Ac: `${sender_accountNumber[0]}XX..${sender_accountNumber[sender_accountNumber.length - 3]}${sender_accountNumber[sender_accountNumber.length - 2]}X`,
                                    Amt: `$${amount}`,
                                    Des: `${validated_Beneficiary.firstName} ${validated_Beneficiary.lastName}/Transfer P APP_`,
                                    Date: `${year}-${month}-${transfer_date} ${hours}:${minutes}:${seconds}`,
                                    Bal: `$${sender_new_Account_Balance}`
                                };
                                sender_notification.push(debit_transfer_alert);
                                const sender_Transaction_Status = yield user_1.default.update({ notification: sender_notification }, {
                                    where: {
                                        accountNumber: sender_accountNumber,
                                    },
                                });
                                let credit_transfer_alert = {
                                    Txn: "CREDIT",
                                    Ac: `${beneficiary_AccountNumber[0]}XX..${beneficiary_AccountNumber[beneficiary_AccountNumber.length - 3]}${beneficiary_AccountNumber[beneficiary_AccountNumber.length - 2]}X`,
                                    Amt: `$${amount}`,
                                    Des: `${sender_accountDetails.firstName} ${sender_accountDetails.lastName}/Transfer P APP_`,
                                    Date: `${year}-${month}-${transfer_date} ${hours}:${minutes}:${seconds}`,
                                    Bal: `$${beneficiary_new_AccountBalance}`
                                };
                                beneficiary_notifcation.push(credit_transfer_alert);
                                const beneficiary_Transaction_Status = yield user_1.default.update({ notification: beneficiary_notifcation }, {
                                    where: {
                                        accountNumber: beneficiary_AccountNumber,
                                    },
                                });
                                return res.status(200).json({
                                    message: "Transaction Successful",
                                    data: sucessful_transfer
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
                                    data: failed_transfer
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
        console.error("Error Transferring to user:", error);
        return res.status(500).json({
            Error: "Internal Server Error",
        });
    }
});
exports.transferToBeneficiary = transferToBeneficiary;
const transferToSavingsWallet = (req, res, NextFunction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = inputvalidation_1.transferToSavings_Wallet;
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
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
                        id: user_id
                    },
                });
                const user_new_balance = user_accountBalance - amount;
                const updating_user_balance = yield user_1.default.update({ accountBalance: user_new_balance }, {
                    where: {
                        id: user_id
                    },
                });
                if (current_savings_balance && updating_user_balance) {
                    return res.status(200).json({
                        message: "Amount Transferred to Savings Wallet"
                    });
                }
                else {
                    return res.status(400).json({
                        message: "Transfer PENDING!! Please wait a few minutes or contact customer service. "
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: "You do not have sufficient balance to execute this savings transfer"
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
            const company_details = yield company_1.default.findOne({ where: { accountNumber: company_account_number } });
            if (company_details.accountNumber) {
                const company_id = company_details.id;
                const company_account_balance = company_details.wallet;
                const comapany_wallet_balance = amount + company_account_balance;
                const min_investment_amount = company_details.min_investment_amount;
                const max_investment_amount = company_details.max_investment_amount;
                if (user_account_balance > amount) {
                    if (amount < min_investment_amount) {
                        return res.status(400).json({
                            message: `You cannot invest below the minimum investment amount.`
                        });
                    }
                    if (amount > max_investment_amount) {
                        return res.status(400).json({
                            message: `You cannot invest above the maximum investment amount.`
                        });
                    }
                    //User can only invest once in a company.
                    const existing_investor_for_that_company = yield investmentRecord_1.default.findAll({
                        where: {
                            [sequelize_1.Op.and]: [
                                { investor_id: user_id },
                                { investment_company_id: company_id }
                            ]
                        }
                    });
                    if (existing_investor_for_that_company.length > 0) {
                        return res.status(200).json({
                            message: `SORRY!! You can only invest once in this company. Please try looking at other suitable investment plans from other companies on Plutus investment portal. Thank you for considering plutus as your investment option.`
                        });
                    }
                    const user_new_balance = user_account_balance - amount;
                    const investment_Transfer = yield user_1.default.update({ accountBalance: user_new_balance }, {
                        where: {
                            accountNumber: user_account_number,
                        },
                    });
                    const successful_Transfer = yield company_1.default.update({ wallet: comapany_wallet_balance }, {
                        where: {
                            accountNumber: company_account_number,
                        },
                    });
                    const company_dets = yield company_1.default.findOne({
                        where: { accountNumber: company_account_number },
                    });
                    const current_wallet_balance = company_dets.wallet;
                    const expected_company_balance = comapany_wallet_balance;
                    if (current_wallet_balance !== expected_company_balance) {
                        const update_company_balance = yield company_1.default.update({ wallet: company_account_balance }, {
                            where: {
                                accountNumber: company_account_number,
                            },
                        });
                        const update_user_balance = yield user_1.default.update({ accountBalance: user_account_balance }, {
                            where: {
                                accountNumber: user_account_number,
                            },
                        });
                        if (update_company_balance && update_user_balance) {
                            const pending_transaction_record = yield investmentRecord_1.default.create({
                                id: (0, uuid_1.v4)(),
                                amount: amount,
                                investor_name: user_firstName + " " + user_lastName,
                                investor_id: user_id,
                                investment_company_id: company_id,
                                transaction_status: "PENDING"
                            });
                            return res.status(400).json({
                                message: `Transfer PENDING.`,
                                data: pending_transaction_record
                            });
                        }
                        else {
                            return res.status(400).json({
                                message: `Please wait and try for a few minutes before trying again or contact Customer Service.`
                            });
                        }
                    }
                    else {
                        if (investment_Transfer && successful_Transfer) {
                            const sucessful_transaction_record = yield investmentRecord_1.default.create({
                                id: (0, uuid_1.v4)(),
                                amount: amount,
                                investor_name: user_firstName + " " + user_lastName,
                                investor_id: user_id,
                                investment_company_id: company_id,
                                transaction_status: "SUCCESSFUL",
                            });
                            const investment_duration = company_dets.duration;
                            let actual_investment_duration = 0;
                            if (investment_duration.split(" ")[1] === "months" || investment_duration.split(" ")[1] === "month") {
                                actual_investment_duration += +investment_duration.split("")[0];
                            }
                            else if (investment_duration.split(" ")[1] === "year" || investment_duration.split(" ")[1] === "years") {
                                actual_investment_duration += (+investment_duration.split("")[0] * 12);
                            }
                            console.log(actual_investment_duration);
                            const company_roi = company_dets.roi;
                            const expected_return_amount = (amount * company_roi).toFixed(2);
                            const expected_monthly_return = (expected_return_amount / actual_investment_duration).toFixed(2);
                            yield investor_1.default.create({
                                id: (0, uuid_1.v4)(),
                                firstName: user_details.firstName,
                                lastName: user_details.lastName,
                                accountNumber: user_details.accountNumber,
                                email: user_details.email,
                                investedCapital: amount,
                                expectedReturn: expected_return_amount,
                                monthlyReturn: expected_monthly_return,
                                returnOnInvestment: company_roi,
                                active: true,
                                companyId: company_id,
                                companyName: company_dets.companyName
                            });
                            const investor_count = company_dets.noOfInvestors + 1;
                            yield company_1.default.update({ noOfInvestors: investor_count }, {
                                where: {
                                    accountNumber: company_account_number,
                                },
                            });
                            return res.status(200).json({
                                message: `Transfer SUCCESSFUL!!`,
                                data: sucessful_transaction_record
                            });
                        }
                        else {
                            const failed_transaction_record = yield investmentRecord_1.default.create({
                                id: (0, uuid_1.v4)(),
                                amount: amount,
                                investor_name: user_firstName + " " + user_lastName,
                                investor_id: user_id,
                                investment_company_id: company_id,
                                transaction_status: "FAILED"
                            });
                            return res.status(400).json({
                                message: `Transfer FAILED.`,
                                data: failed_transaction_record
                            });
                        }
                    }
                }
                else {
                    return res.status(400).json({
                        message: `Company does not exist. Please check if account number is correct`
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: `Sorry! You do not have sufficient funds to make this investment. Please credit your account`
                });
            }
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.transferToInvestmentCompany = transferToInvestmentCompany;
