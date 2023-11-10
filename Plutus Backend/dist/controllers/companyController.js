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
exports.loginCompany = exports.getAllCompanies = exports.deleteCompany = exports.createCompany = void 0;
const company_1 = __importDefault(require("../model/company"));
const uuid_1 = require("uuid");
const auth_1 = require("../utils/auth");
const auth_2 = require("../utils/auth");
const notifications_1 = require("../utils/notifications");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_3 = require("../utils/auth");
const joi_1 = __importDefault(require("joi"));
const pagination_1 = require("../utils/pagination");
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
const createCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyName, company_description, email, password, businessType, roi, } = req.body;
        const findCompany = (yield company_1.default.findOne({
            where: { email },
        }));
        if (findCompany) {
            return res.status(400).json({
                message: `You are already a registered user`,
            });
        }
        else {
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
                user_type: "company",
                active: true,
                businessType,
                roi,
            }));
            const company_dets = (yield company_1.default.findOne({
                where: { email },
            }));
            const token = jsonwebtoken_1.default.sign({ email: company_dets.email, id: company_dets.id }, process.env.APP_SECRET, {
                expiresIn: "1d",
            });
            if (newCompany) {
                const html = (0, notifications_1.emailHtmlForCompany)(companyName, OTP);
                yield (0, notifications_1.sendmail)(`${process.env.DEV_GMAIL_USER}`, email, "Welcome", html);
                return res.status(200).json({
                    message: `Company created successfully`,
                    data: newCompany,
                });
            }
        }
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.createCompany = createCompany;
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
const getAllCompanies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const { offset, limit: paginationLimit } = (0, pagination_1.getPagination)({ page, limit });
    try {
        const companies = yield company_1.default.findAndCountAll({
            offset,
            limit: paginationLimit,
        });
        return res.json({
            totalCompanies: companies.count,
            totalPages: Math.ceil(companies.count / limit),
            currentPage: page,
            data: companies.rows,
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllCompanies = getAllCompanies;
const loginCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = joi_1.default.object({
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().required(),
        });
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        console.log("hello");
        const { email, password } = req.body;
        const company_details = (yield company_1.default.findOne({
            where: { email },
        }));
        if (!company_details) {
            return res
                .status(404)
                .json({ message: `Company does not exist, please register` });
        }
        if (company_details) {
            const validate = yield bcrypt_1.default.compare(password, company_details.password);
            if (validate) {
                const token = jsonwebtoken_1.default.sign({ email: company_details.email, id: company_details.id }, process.env.APP_SECRET, { expiresIn: "1d" });
                console.log("hello");
                return res.status(200).json({
                    message: `Login successfully`,
                    email: company_details.email,
                    token,
                });
            }
            if (!validate) {
                return res.status(400).json({
                    message: `Invalid Password`,
                });
            }
        }
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/users/login",
        });
    }
    console.log("hello");
    const { email, password } = req.body;
    const company_details = (yield company_1.default.findOne({
        where: { email },
    }));
    if (!company_details) {
        return res
            .status(404)
            .json({ message: `Company does not exist, please register` });
    }
    if (company_details) {
        const validate = yield bcrypt_1.default.compare(password, company_details.password);
        if (validate) {
            const token = jsonwebtoken_1.default.sign({ email: company_details.email, id: company_details.id }, process.env.APP_SECRET, { expiresIn: "1d" });
            console.log("hello");
            return res.status(200).json({
                message: `Login successfully`,
                email: company_details.email,
                token,
            });
        }
        if (!validate) {
            return res.status(400).json({
                message: `Invalid Password`,
            });
        }
    }
});
exports.loginCompany = loginCompany;
//   } catch (err) {
//     return res.status(500).json({
//       message: `Internal Server Error`,
//       Error: "/users/login",
//     });
//   }
// };
