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
exports.forgotPassword = exports.createUserImage = exports.updateUserProfile = exports.verifyChangePassword = exports.verifyChangePasswordOTP = exports.verifyChangePasswordEmail = exports.resendOTP = exports.loginUser = exports.verifyUser = exports.userSignup = void 0;
const user_1 = __importDefault(require("../../model/user"));
const uuid_1 = require("uuid");
const auth_1 = require("../../utils/auth");
const auth_2 = require("../../utils/auth");
const auth_3 = require("../../utils/auth");
const notifications_1 = require("../../utils/notifications");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const inputvalidation_1 = require("../../utils/inputvalidation");
const company_1 = __importDefault(require("../../model/company"));
dotenv_1.default.config();
//Controller for signing up
const userSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = inputvalidation_1.signUpUser;
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { firstName, lastName, email, password } = req.body;
        const existingUser = yield user_1.default.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ message: "Account already exists. Kindly login." });
        }
        else {
            const hashPassword = yield (0, auth_1.hashedPassword)(password);
            const accNumber = (0, auth_2.genAccount)();
            const OTP = (0, auth_3.generateOTP)();
            const newUser = yield user_1.default.create({
                id: (0, uuid_1.v4)(),
                firstName,
                lastName,
                email,
                password: hashPassword,
                accountNumber: accNumber,
                savingsWallet: { id: (0, uuid_1.v4)(), amount: 0 },
                otp: OTP,
                token: "",
                imageUrl: "",
                notification: [],
                accountBalance: 10000,
                role: "user",
                verify: false,
                phoneNumber: "",
                address: "",
                zipCode: "",
                city: "",
                state: "",
                country: "",
            });
            const user = (yield user_1.default.findOne({
                where: { email },
            }));
            const token = jsonwebtoken_1.default.sign({ email: user.email, id: user.id }, process.env.APP_SECRET, {
                expiresIn: "1d",
            });
            const html = (0, notifications_1.emailHtml)(email, OTP);
            const sent_mail = yield (0, notifications_1.sendmail)(`${process.env.GMAIL_USER}`, email, "Welcome", html);
            return res.status(200).json({
                message: `Account is created successfully`,
                data: newUser,
                user_token: token,
            });
        }
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.userSignup = userSignup;
//Controller for verifying user
const verifyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        if (decodedToken) {
            const user_id = decodedToken.id;
            const { otp } = req.body;
            const user = (yield user_1.default.findOne({
                where: { id: user_id },
            }));
            if (!user) {
                return res.status(400).json({ error: "User not found" });
            }
            else {
                if (user.otp !== otp) {
                    return res.status(400).json({ message: "Invalid OTP" });
                }
                else {
                    yield user_1.default.update({
                        verify: true,
                    }, {
                        where: { id: user_id },
                    });
                    return res.status(200).json({
                        msg: "User verified",
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
        console.error("Error verifying user:", error);
        return res.status(500).json({
            Error: "Internal Server Error",
        });
    }
});
exports.verifyUser = verifyUser;
//Controller for logging-in user
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = joi_1.default.object({
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().required(),
        });
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { email, password } = req.body;
        const user = yield user_1.default.findOne({ where: { email } });
        if (!user) {
            const user = yield company_1.default.findOne({ where: { email } });
            if (user && user.verified === true) {
                const validate = yield bcrypt_1.default.compare(password, user.password);
                if (validate) {
                    const token = jsonwebtoken_1.default.sign({ email: user.email, id: user.id }, process.env.APP_SECRET, { expiresIn: "1d" });
                    return res.status(200).json({
                        message: `Login successfully`,
                        email: user.email,
                        user_token: token,
                        role: user.role,
                    });
                }
                else {
                    res.status(400).json({
                        message: `Password is incorrect. Please check password details and try again.`,
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: `Company Not Verified`,
                });
            }
            return res
                .status(404)
                .json({ message: `Company does not exist, please register` });
        }
        else {
            if (user && user.verify === true) {
                const validate = yield bcrypt_1.default.compare(password, user.password);
                if (validate) {
                    const token = jsonwebtoken_1.default.sign({ email: user.email, id: user.id }, process.env.APP_SECRET, { expiresIn: "1d" });
                    return res.status(200).json({
                        message: `Login successfully`,
                        email: user.email,
                        user_token: token,
                        role: user.role,
                    });
                }
                else {
                    res.status(400).json({
                        message: `Password is incorrect. Please check password details and try again.`,
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: `User Not Verified`,
                });
            }
        }
    }
    catch (error) {
        console.error("Error verifyinguser:", error);
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/users/login",
        });
    }
});
exports.loginUser = loginUser;
const resendOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const verified = jsonwebtoken_1.default.verify(token, process.env.APP_SECRET);
        if (!verified) {
            return res.status(400).json({
                message: "invalid token",
            });
        }
        const OTP = (0, auth_3.generateOTP)();
        yield user_1.default.update({ otp: OTP }, { where: { email: verified.email } });
        const html = (0, notifications_1.emailHtml)(verified.email, OTP);
        yield (0, notifications_1.sendmail)(`${process.env.DEV_GMAIL_USER}`, verified.email, "Welcome", html);
        return res.status(200).json({ message: "resendOTP successful" });
    }
    catch (error) {
        return res.json({
            message: "resendOTP failed",
            error: error,
        });
    }
});
exports.resendOTP = resendOTP;
const verifyChangePasswordEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        // Find user based on email
        const user = yield user_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Generate a random four-digit OTP
        // const otp = resetPasswordOTP(); // You need to implement this function
        // Generate token for the user (assuming generateToken is asynchronous)
        const otp = yield (0, auth_3.generateOTP)(); // Get plain object of the user from the query result
        const token = (0, auth_1.tokenGenerator)(user);
        // Compose mail
        const mailOptions = {
            from: process.env.DEV_DEV_GMAIL_USER,
            to: user.get().email,
            subject: "Password Reset OTP",
            text: `<h1>Your OTP for password reset is: ${otp}</h1>`,
        };
        yield user_1.default.update({ otp }, { where: { email } });
        yield (0, notifications_1.sendmail)(mailOptions.from, mailOptions.to, mailOptions.subject, mailOptions.text);
        return res.status(200).json({ token });
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid User" });
    }
});
exports.verifyChangePasswordEmail = verifyChangePasswordEmail;
const verifyChangePasswordOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //VERIFY OTP
    //fetch otp from req.query.params
    //const id = req.user
    //const user = await User.findOne({where: {id}})
    //if(otp === user.otp) => otp correct
    try {
        const { otp } = req.body;
        const id = req.params.id;
        const user = yield user_1.default.findOne({ where: { id } });
        if (!user || !("otp" in user)) {
            return res.status(404).json({ message: "Invalid OTP" });
        }
        if (otp !== user.otp) {
            return res.status(404).json({ message: "Invalid OTP" });
        }
        else {
            user.otp = "0";
            return res.status(200).json({ message: "Proceed to Change Password" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.verifyChangePasswordOTP = verifyChangePasswordOTP;
const verifyChangePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userid = req.params.id;
        const { oldPassword, newPassword, confirm_password } = req.body;
        // Find user based on ID
        const user = (yield user_1.default.findOne({
            where: { id: userid },
        }));
        // if (!user) {
        //     return res.status(404).json({ message: 'User not found' });
        // }
        if (newPassword !== confirm_password) {
            return res
                .status(400)
                .json({ message: "NewPassword must be the same as ConfirmPassword" });
        }
        if (oldPassword === newPassword) {
            return res
                .status(404)
                .json({ message: "Oldpaswword cannot be the same with Newpassword" });
        }
        // Check if the old password matches the one in the database
        const isPasswordCorrect = yield bcrypt_1.default.compare(oldPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid old password" });
        }
        // Hash the new password
        const hashedNewPassword = yield (0, auth_1.hashedPassword)(newPassword);
        // Update the user's password using the Sequelize update method
        // const [affectedRows] =
        yield user_1.default.update({ password: hashedNewPassword }, { where: { id: userid } });
        return res.json({ "Password change": "successful" });
        // if (affectedRows > 0) {
        //     return res.status(200).json({ message: 'Password reset successful' });
        // } else {
        //     return res.status(500).json({ message: 'Failed to update password' });
        // }
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.verifyChangePassword = verifyChangePassword;
const updateUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { firstName, lastName, email, phoneNumber, address, zipCode, city, state, country } = req.body;
        // console.log("image live   ",firstName, lastName, email, phoneNumber, address, zipCode, city, state, country)
        const updateField = {};
        if (!firstName) {
            updateField.firstName = firstName;
        }
        if (!lastName) {
            updateField.lastName = lastName;
        }
        if (!email) {
            updateField.email = email;
        }
        if (!phoneNumber) {
            updateField.phoneNumber = phoneNumber;
        }
        // if(!imageUrl){
        //     updateField.imageUrl =  req.file
        // }
        if (!address) {
            updateField.address = address;
        }
        if (!zipCode) {
            updateField.zipCode = zipCode;
        }
        if (!city) {
            updateField.city = city;
        }
        if (!state) {
            updateField.state = state;
        }
        if (!country) {
            updateField.country = country;
        }
        const updatedUser = yield user_1.default.update(updateField, { where: { email: email } });
        if (updatedUser) {
            return res.status(200).json({
                message: `Your profile has been updated successfully`,
                data: updatedUser
            });
        }
        return res.status(401).json({
            message: `Update operation failed`
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateUserProfile = updateUserProfile;
const createUserImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email } = req.body;
        const user = yield user_1.default.findOne({ where: { email: email } });
        const updateField = {};
        const updateUserImage = yield user_1.default.update({ imageUrl: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path }, { where: { email: email } });
        if (updateUserImage) {
            return res.status(200).json({
                message: `Your profile image has been updated successfully`,
                data: updateUserImage
            });
        }
        return res.status(401).json({
            message: `Image update operation failed`
        });
    }
    catch (error) {
        return res.status(500).json({
            message: `Error Uploading Imsge`,
        });
    }
});
exports.createUserImage = createUserImage;
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = (yield user_1.default.findOne({ where: { email } }));
        if (!user) {
            return res.status(400).json({ error: "User does not exist!" });
        }
        const token = jsonwebtoken_1.default.sign({ email: user.email, id: user.id }, process.env.APP_SECRET, {
            expiresIn: "10m",
        });
        const html = `
              <h2>Please click on given link to reset your password</h2>
              <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>
          `;
        yield (0, notifications_1.sendmail)(`${process.env.DEV_GMAIL_USER}`, email, "Welcome", html);
        return res.status(200).json({
            message: "Verification Sent",
            method: req.method,
        });
    }
    catch (error) {
        console.error(error);
    }
    res.json("Recover password");
});
exports.forgotPassword = forgotPassword;
