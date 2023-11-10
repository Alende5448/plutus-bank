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
exports.deleteBeneficiary = exports.createBeneficiaries = void 0;
const beneficiary_1 = __importDefault(require("../../model/beneficiary"));
const user_1 = __importDefault(require("../../model/user"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const inputvalidation_1 = require("../../utils/inputvalidation");
const createBeneficiaries = (req, res, NextFunction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = inputvalidation_1.createBeneficiary;
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        const user_id = decodedToken.id;
        const { beneficiaryName, accountNumber } = req.body;
        const user = yield user_1.default.findOne({ where: { id: user_id } });
        if (!user) {
            return res.status(404).json({
                error: "No existng beneficiary. Please ADD BENEFICIARY.",
            });
        }
        const validating_beneficiary = yield user_1.default.findOne({ where: { accountNumber: accountNumber } });
        const checking_existing_beneficiary = yield beneficiary_1.default.findOne({ where: { accountNumber } });
        if (validating_beneficiary) {
            if (!checking_existing_beneficiary) {
                res.status(400).json({
                    message: "Beneficiary Already Exists"
                });
            }
            else {
                const newBeneficiary = yield beneficiary_1.default.create({
                    id: (0, uuid_1.v4)(),
                    userId: user_id,
                    beneficiaryName,
                    accountNumber
                });
                res.status(200).json({
                    message: "Beneficiary created successfully",
                    data: newBeneficiary
                });
            }
        }
        else {
            res.status(400).json({
                message: "Account Number doesn't Match"
            });
        }
    }
    catch (error) {
        console.error("Error creating beneficiary", error);
        res.status(500).json({
            error: "Internal server error, Error creating beneficiary",
        });
    }
});
exports.createBeneficiaries = createBeneficiaries;
const deleteBeneficiary = (req, res, NextFunction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        const { accountNumber } = req.body;
        if (decodedToken.id) {
            const user_id = decodedToken.id;
            const get_User_Beneficiaries = yield beneficiary_1.default.findAll({ where: { userId: user_id } });
            if (get_User_Beneficiaries.length !== 0) {
                const delete_beneficiary = yield beneficiary_1.default.destroy({
                    where: { accountNumber }
                });
                if (delete_beneficiary) {
                    return res.status(200).json({
                        message: "Beneficiary has been successfully deleted."
                    });
                }
                else {
                    return res.status(200).json({
                        message: "DELETE FAILED!! Account is not your beneficiary"
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: "You do not have any beneficiary"
                });
            }
        }
        else {
            return res.status(400).json({
                message: "You must be LOGGED IN to delete any beneficiary"
            });
        }
    }
    catch (error) {
        console.error('Error deleting Beneficiary', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});
exports.deleteBeneficiary = deleteBeneficiary;
