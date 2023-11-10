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
exports.getBeneficiaries = void 0;
const beneficiary_1 = __importDefault(require("../../model/beneficiary"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getBeneficiaries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        const id = decodedToken.id;
        const beneficiaries = yield beneficiary_1.default.findAll({ where: { userId: id } });
        res.status(200).json(beneficiaries);
    }
    catch (error) {
        console.error('Error fetching beneficiaries:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getBeneficiaries = getBeneficiaries;
