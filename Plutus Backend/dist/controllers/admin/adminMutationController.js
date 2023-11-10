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
exports.deleteUserByAdmin = exports.createAdmin = void 0;
const user_1 = __importDefault(require("../../model/user"));
const uuid_1 = require("uuid");
const auth_1 = require("../../utils/auth");
const inputvalidation_1 = require("../../utils/inputvalidation");
const createAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = inputvalidation_1.createAdminSchema;
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { firstName, lastName, email, password } = req.body;
        const existingAdminUser = yield user_1.default.findOne({ where: { email } });
        if (existingAdminUser) {
            return res.status(400).json({ error: "Email already exists" });
        }
        else {
            const hashPassword = yield (0, auth_1.hashedPassword)(password);
            const createAdmin = yield user_1.default.create({
                id: (0, uuid_1.v4)(),
                firstName,
                lastName,
                email,
                password: hashPassword,
                accountNumber: "No Account Number",
                savingsWallet: { id: (0, uuid_1.v4)(), amount: 0 },
                otp: "",
                token: "",
                imageUrl: "",
                notification: [],
                accountBalance: 0,
                phoneNumber: "",
                role: "admin",
                verify: true,
                address: "",
                zipCode: "",
                city: "",
                state: "",
                country: "",
            });
            const admin_details = yield user_1.default.findOne({ where: { email } });
            if (admin_details.email) {
                const token = (0, auth_1.tokenGenerator)({
                    email: admin_details.email,
                    id: admin_details.id,
                });
                return res.status(200).json({
                    message: `User created successfully`,
                    data: createAdmin,
                });
            }
            else {
                return res.status(400).json({
                    messsage: `Admin account has not been created.`,
                });
            }
        }
    }
    catch (error) {
        console.error("Error creating admin user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.createAdmin = createAdmin;
const deleteUserByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    console.log("user", userId);
    try {
        const result = yield user_1.default.findOne({ where: { id: userId } });
        console.log("results", result);
        if (!result)
            return res
                .status(404)
                .json({ message: "user with id ${req.params.id} not found" });
        yield user_1.default.destroy({ where: { id: userId } });
        return res.status(200).json({ message: "user deleted successfully" });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteUserByAdmin = deleteUserByAdmin;
