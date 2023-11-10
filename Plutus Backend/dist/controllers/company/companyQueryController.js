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
exports.getCompanyInfo = exports.getInvestor = exports.getAllCompanies = void 0;
const company_1 = __importDefault(require("../../model/company"));
const dotenv_1 = __importDefault(require("dotenv"));
const pagination_1 = require("../../utils/pagination");
const investor_1 = __importDefault(require("../../model/investor"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../../model/user"));
dotenv_1.default.config();
const getAllCompanies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        const user_id = decodedToken.id;
        const get_user_dets = yield user_1.default.findOne({ where: { id: user_id } });
        const user_role = get_user_dets.role;
        if (user_role === "admin") {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 5;
            const { offset, limit: paginationLimit } = (0, pagination_1.getPagination)({ page, limit });
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
        else {
            return res.status(400).json({
                message: "You are not an ADMIN user.",
            });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllCompanies = getAllCompanies;
const getInvestor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        const companyId = decodedToken.id;
        const investor = yield investor_1.default.findAll({ where: { id: companyId } });
        if (investor) {
            return res.status(200).json({
                message: "Fetching Investor Successfully",
                data: investor,
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
exports.getInvestor = getInvestor;
const getCompanyInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const payload = token.split(" ")[1];
        const company_details = jsonwebtoken_1.default.verify(payload, process.env.APP_SECRET);
        if (company_details.id) {
            const id = company_details.id;
            const company_info = yield company_1.default.findOne({ where: { id: id } });
            return res.status(200).json({
                company: company_info
            });
        }
        else {
            res.status(400).json({
                message: "Please LOGIN to get your information"
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});
exports.getCompanyInfo = getCompanyInfo;
