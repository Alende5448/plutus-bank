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
exports.companyTransferToInvestor = exports.deleteCompany = exports.createCompanyImage = exports.updateCompanyProfile = exports.loginCompany = exports.createCompany = void 0;
const company_1 = __importDefault(require("../../model/company"));
const user_1 = __importDefault(require("../../model/user"));
const uuid_1 = require("uuid");
const auth_1 = require("../../utils/auth");
const auth_2 = require("../../utils/auth");
const notifications_1 = require("../../utils/notifications");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_3 = require("../../utils/auth");
const bcrypt_1 = __importDefault(require("bcrypt"));
const inputvalidation_1 = require("../../utils/inputvalidation");
const investor_1 = __importDefault(require("../../model/investor"));
const investmentRecord_1 = __importDefault(require("../../model/investmentRecord"));
const sequelize_1 = require("sequelize");
const roiTransferRecord_1 = __importDefault(require("../../model/roiTransferRecord"));
dotenv_1.default.config();
//Controller For Creating Company
const createCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = inputvalidation_1.createCompanySchema;
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        const userId = decodedToken.id;
        const company_details = yield user_1.default.findOne({
            where: { id: userId }
        });
        const user_role = company_details.role;
        console.log("user", user_role);
        if (decodedToken) {
            const { companyName, company_description, email, password, businessType, roi, investment_category, investment_description, duration, min_investment_amount, max_investment_amount, } = req.body;
            const findCompany = (yield company_1.default.findOne({
                where: { email: email, companyName: companyName },
            }));
            if (findCompany) {
                return res.status(400).json({
                    message: `${companyName} has already been registered.`,
                });
            }
            else {
                if (user_role === "admin") {
                    const OTP = (0, auth_2.generateOTP)();
                    const company_account_number = (0, auth_3.companyAccount)();
                    const hashPassword = yield (0, auth_1.hashedPassword)(password);
                    let newCompany = (yield company_1.default.create({
                        id: (0, uuid_1.v4)(),
                        companyName,
                        company_description,
                        email,
                        password: hashPassword,
                        otp: OTP,
                        accountNumber: company_account_number,
                        wallet: 0,
                        verified: true,
                        role: "company",
                        active: true,
                        businessType,
                        roi,
                        noOfInvestors: 0,
                        investment_category,
                        investment_description,
                        duration,
                        min_investment_amount,
                        max_investment_amount,
                        imageUrl: "",
                        phoneNumber: "",
                        address: "",
                        zipCode: "",
                        city: "",
                        state: "",
                        country: ""
                    }));
                    const company_dets = (yield company_1.default.findOne({
                        where: { email },
                    }));
                    if (newCompany) {
                        const html = (0, notifications_1.emailHtmlForCompany)(companyName, email, password);
                        yield (0, notifications_1.sendmail)(`${process.env.DEV_GMAIL_USER}`, email, "Welcome", html);
                        return res.status(200).json({
                            message: `${companyName} created successfully`,
                            data: newCompany,
                        });
                    }
                }
                else {
                    return res.status(400).json({
                        message: "You are not an ADMIN user.",
                    });
                }
            }
        }
        else {
            return res.status(400).json({
                message: `You are not an AUTHENTICATED USER`,
            });
        }
    }
    catch (error) {
        console.error("Error creating company:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.createCompany = createCompany;
//Controller for Company Login
const loginCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = inputvalidation_1.companyLogin;
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { email, password } = req.body;
        const company_details = (yield company_1.default.findOne({
            where: { email },
        }));
        if (!company_details) {
            return res
                .status(404)
                .json({
                message: `Company does not exist, please register via the Signup page`,
            });
        }
        else {
            const validate = yield bcrypt_1.default.compare(password, company_details.password);
            if (validate) {
                const token = jsonwebtoken_1.default.sign({ email: company_details.email, id: company_details.id }, process.env.APP_SECRET, { expiresIn: "1d" });
                return res.status(200).json({
                    message: `Login SUCCESSFUL`,
                    token,
                });
            }
            else {
                return res.status(400).json({
                    message: `Invalid Password. Please ensure password is correct.`,
                });
            }
        }
    }
    catch (error) {
        console.error("Login company:", error);
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/company/login",
        });
    }
});
exports.loginCompany = loginCompany;
const updateCompanyProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { companyName, email, phoneNumber, address, zipCode, city, state, country } = req.body;
        console.log("image live", companyName, email, phoneNumber, address, zipCode, city, state, country);
        const updateField = {};
        if (companyName !== "") {
            updateField.companyName = companyName;
        }
        if (email !== "") {
            updateField.email = email;
        }
        if (phoneNumber !== "") {
            updateField.phoneNumber = phoneNumber;
        }
        if (address !== "") {
            updateField.address = address;
        }
        if (zipCode !== "") {
            updateField.zipCode = zipCode;
        }
        if (city !== "") {
            updateField.city = city;
        }
        if (state !== "") {
            updateField.state = state;
        }
        if (country !== "") {
            updateField.country = country;
        }
        console.log('update live', updateField);
        const updatedCompany = yield company_1.default.update(updateField, { where: { email: email } });
        if (updatedCompany) {
            return res.status(200).json({
                message: `Company updated successfully`,
                data: updatedCompany
            });
        }
        return res.status(401).json({
            message: `Update operation failed`
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateCompanyProfile = updateCompanyProfile;
const createCompanyImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.user;
        const user = yield company_1.default.findOne({ where: { id: id } });
        const updateField = {};
        const updateUserImage = yield company_1.default.update({ imageUrl: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path }, { where: { id: id } });
        if (updateUserImage) {
            return res.status(200).json({
                message: `User updated successfully`,
                data: updateUserImage
            });
        }
        return res.status(401).json({
            message: `Update operation failed`
        });
    }
    catch (error) {
        return res.status(500).json({
            message: `Error Uploading Imsge`
        });
    }
});
exports.createCompanyImage = createCompanyImage;
//Controller for deleting company
const deleteCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const companyId = req.params.id;
    try {
        const company = yield company_1.default.findByPk(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company does not exist" });
        }
        yield company.destroy();
        res.status(200).json({ message: "Company deleted successfully" });
    }
    catch (error) {
        console.log("Error deleting company:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteCompany = deleteCompany;
const companyTransferToInvestor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        if (decodedToken) {
            const company_id = decodedToken.id;
            const company_details = yield company_1.default.findOne({ where: { id: company_id } });
            if (company_details) {
                const user_role = company_details.role;
                if (user_role === "company") {
                    const { investor_account_Number } = req.body;
                    const investor_main_details = yield user_1.default.findOne({ where: { accountNumber: investor_account_Number } });
                    if (investor_main_details) {
                        const investor_id_number = investor_main_details.id;
                        const investor_investment_details = yield investmentRecord_1.default.findOne({
                            where: {
                                [sequelize_1.Op.and]: [
                                    { investment_company_id: company_id },
                                    { investor_id: investor_id_number }
                                ]
                            }
                        });
                        if (investor_investment_details) {
                            const investor_investment_status = investor_investment_details.transaction_status;
                            const investor_name = investor_investment_details.investor_name;
                            if (investor_investment_status === "SUCCESSFUL") {
                                const company_account_number = company_details.accountNumber;
                                const company_account_balance = +((company_details.wallet).toFixed(2));
                                const name_of_company = company_details.companyName;
                                const investor_account_balance = investor_main_details.accountBalance;
                                const investor_email = investor_main_details.email;
                                const investor_returns_record = yield investor_1.default.findOne({
                                    where: {
                                        [sequelize_1.Op.and]: [
                                            { email: investor_email },
                                            { companyId: company_id }
                                        ]
                                    }
                                });
                                if (investor_returns_record) {
                                    const investor_return_of_investment = +((investor_returns_record.expectedReturn).toFixed(2));
                                    if (investor_return_of_investment < company_account_balance) {
                                        const new_investor_balance = investor_account_balance + investor_return_of_investment;
                                        const update_investor_accountBalance = yield user_1.default.update({
                                            accountBalance: new_investor_balance
                                        }, { where: { accountNumber: investor_account_Number } });
                                        const new_company_balance = company_account_balance - investor_return_of_investment;
                                        const update_company_wallet = yield company_1.default.update({
                                            wallet: new_company_balance
                                        }, { where: { accountNumber: company_account_number } });
                                        if (update_investor_accountBalance && update_company_wallet) {
                                            const current_investor_balance_details = yield user_1.default.findOne({ where: { accountNumber: investor_account_Number } });
                                            const current_investor_balance = current_investor_balance_details.accountBalance;
                                            if (current_investor_balance !== new_investor_balance) {
                                                yield user_1.default.update({
                                                    accountBalance: investor_account_balance
                                                }, { where: { accountNumber: investor_account_Number } });
                                                yield company_1.default.update({
                                                    wallet: company_account_balance
                                                }, { where: { accountNumber: company_account_number } });
                                                const pending_transfer = yield roiTransferRecord_1.default.create({
                                                    id: (0, uuid_1.v4)(),
                                                    investor_id: investor_id_number,
                                                    investor_name: investor_name,
                                                    transfer_amount: investor_return_of_investment,
                                                    company_name: company_details.companyName,
                                                    company_id: company_id,
                                                    transfer_status: "PENDING"
                                                });
                                                return res.status(200).json({
                                                    message: `TRANSACTION PENDING!!! Sorry, your transfer of $${investor_return_of_investment} to ${investor_name} is pending. Please wait for few minutes before trying again.`,
                                                    data: pending_transfer
                                                });
                                            }
                                            else {
                                                const successful_transfer = yield roiTransferRecord_1.default.create({
                                                    id: (0, uuid_1.v4)(),
                                                    investor_id: investor_id_number,
                                                    investor_name: investor_name,
                                                    transfer_amount: investor_return_of_investment,
                                                    company_name: company_details.companyName,
                                                    company_id: company_id,
                                                    transfer_status: "SUCCESSFUL"
                                                });
                                                const get_transfer_date = yield roiTransferRecord_1.default.findOne({
                                                    where: {
                                                        [sequelize_1.Op.and]: [
                                                            { investor_id: investor_id_number },
                                                            { company_id: company_id }
                                                        ]
                                                    }
                                                });
                                                const date = get_transfer_date.createdAt;
                                                const email = investor_main_details.email;
                                                const expectedReturn = investor_return_of_investment;
                                                const companyName = company_details.companyName;
                                                const roi = company_details.roi;
                                                const amount = investor_investment_details.amount;
                                                const duration = company_details.duration;
                                                let actual_duration = "";
                                                if (duration.split(" ")[1].toLowerCase() === "months" || duration.split(" ")[1].toLowerCase() === "month") {
                                                    actual_duration += duration.split("")[0];
                                                }
                                                else if (duration.split(" ")[1].toLowerCase() === "year" || duration.split(" ")[1].toLowerCase() === "years") {
                                                    actual_duration += (duration.split("")[0] * 12);
                                                }
                                                const monthlyReturn = investor_returns_record.monthlyReturn;
                                                const html = (0, notifications_1.emailHtmlForCompanyTransferToInvestor)(investor_name, expectedReturn, companyName, roi, amount, actual_duration, monthlyReturn, date);
                                                const sent_mail = yield (0, notifications_1.sendmailForInvestment)(`${process.env.GMAIL_USER}`, email, `CREDIT: RETURN ON INVESTMENT TO ${investor_name}`, html);
                                                const deleting_investor_record = yield investor_1.default.destroy({
                                                    where: {
                                                        [sequelize_1.Op.and]: [
                                                            { email: investor_email },
                                                            { companyId: company_id }
                                                        ]
                                                    }
                                                });
                                                return res.status(200).json({
                                                    message: `SUCCESS!!! You have successfully transferred $${investor_return_of_investment} to ${investor_name}.`,
                                                    data: successful_transfer
                                                });
                                            }
                                        }
                                        else {
                                            const failed_transfer = yield roiTransferRecord_1.default.create({
                                                id: (0, uuid_1.v4)(),
                                                investor_id: investor_id_number,
                                                investor_name: investor_name,
                                                transfer_amount: investor_return_of_investment,
                                                company_name: company_details.companyName,
                                                company_id: company_id,
                                                transfer_status: "FAILED"
                                            });
                                            return res.status(200).json({
                                                message: `Transfer FAILED. Please wait for few minutes before trying again.`,
                                                data: failed_transfer
                                            });
                                        }
                                    }
                                    else {
                                        return res.status(200).json({
                                            message: `Company account does not have sufficient balance to make this transfer.`
                                        });
                                    }
                                }
                                else {
                                    return res.status(400).json({
                                        message: `${investor_name} does not have any active investment with ${name_of_company}`
                                    });
                                }
                            }
                            else {
                                return res.status(400).json({
                                    messsage: `Thare is NO SUCCESSFUL INVESTMENT from ${investor_main_details.firstName} ${investor_main_details.lastName} to ${company_details.companyName}.`
                                });
                            }
                        }
                        else {
                            return res.status(400).json({
                                message: `No investment record found for your company.`
                            });
                        }
                    }
                    else {
                        return res.status(400).json({
                            message: `User with that account number doesn't exist. Please ensure you have the correct account number`
                        });
                    }
                }
                else {
                    return res.status(400).json({
                        message: `SORRY! You are not registered as a company.`
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: `Investor doesn't exist.`
                });
            }
        }
        else {
            return res.status(400).json({
                message: `Invalid User. Ensure Token is inserted.`
            });
        }
    }
    catch (error) {
        console.error("Error in sending money to investor:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.companyTransferToInvestor = companyTransferToInvestor;
