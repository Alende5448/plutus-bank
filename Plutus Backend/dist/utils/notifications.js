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
exports.emailHtmlForCompanyTransferToInvestor = exports.emailHtmlForCompany = exports.emailHtmlForAdmin = exports.emailHtml = exports.sendmailForInvestment = exports.sendmail = exports.OTP_CONFIG = exports.OTP_LENGTH = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.DEV_GMAIL_USER,
        pass: process.env.DEV_GMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});
//  otp details
exports.OTP_LENGTH = 4;
exports.OTP_CONFIG = { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false };
const sendmail = (from, to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reponse = yield exports.transporter.sendMail({
            from: process.env.DEV_GMAIL_USER,
            to,
            subject: "Welcome",
            html,
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.sendmail = sendmail;
const sendmailForInvestment = (from, to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reponse = yield exports.transporter.sendMail({
            from: process.env.DEV_GMAIL_USER,
            to,
            subject,
            html,
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.sendmailForInvestment = sendmailForInvestment;
const emailHtml = (email, OTP) => {
    const mail = `<h1>Welcome to Plutus<h1>
                    <p>You username: ${email}</p><br>
                    <p>Your OTP: ${OTP}</p><br>
                    <p>Thank You</p>`;
    return mail;
};
exports.emailHtml = emailHtml;
const emailHtmlForAdmin = (email, OTP) => {
    const mail = `<h3>Dear Admin User,<h3><br>
                    <p>Please use these details too verify your account.</p>
                    <p>You username: ${email}</p><br>
                    <p>Your OTP: ${OTP}</p><br>
                    <p>Thank You</p>`;
    return mail;
};
exports.emailHtmlForAdmin = emailHtmlForAdmin;
const emailHtmlForCompany = (companyName, email, password) => {
    const mail = `<h1>Welcome to Plutus<h1>
                    <p>Hello ${companyName},</p><br>
                    <p> Thank you for registering your company with Plutus. Here you have access to attract a lot of investors to your company and scale your business so high.</p>
                    <p>Please use the details below to log into your account.</p><br>
                    <p>email: ${email}</p><br>
                    <p>password: ${password}</p><br>
                    <p>Don't hesistate in reaching out via our customer service mail to resolve any issues or concerns regarding your account.</p><br>
                    <p>Thank You</p><br>
                    <p>Best Regards,</p>
                    <p>From </P>
                    <P>Team Plutus</p>`;
    return mail;
};
exports.emailHtmlForCompany = emailHtmlForCompany;
const emailHtmlForCompanyTransferToInvestor = (investor_name, expectedReturn, companyName, roi, amount, actual_duration, monthlyReturn, date) => {
    const mail = `
                    <p>Dear <strong>${investor_name}</strong>,</p><br>
                    <p>Your account has been credited with <span style = "color:green"><strong>$${expectedReturn}</strong></span> from <strong>${companyName}</strong> on <strong>${date}</strong>.</p>
                    <p style = "color:red">Please see your investment details highlighted below:</p><br>

                    <p>Investment Company: <span><strong>${companyName}</strong></span></p>
                    <p>ROI: <span style = "color:green">${roi}</span></p>
                    <p>Investment Capital: <span style = "color:green"> $${amount}</span></p>
                    <p>Duration: <span style = "color:green">${actual_duration} months</span></p>
                    <p>Monthly Return: <span style = "color:green">$${monthlyReturn}</span></p>
                    <p>Total Investment Return: <span style = "color:green"><strong>$${expectedReturn}</strong></span></p><br>

                    <p>You can also check out other investment plans on the plutus app and inspect for other opportunities from <strong>${companyName}</strong>.</p><br>

                    <p>Thank you for considering <span style = "color:blue"><strong>PLUTUS</strong></span> as your investment option. We are always ready to serve you better.</p><br>

                    <p>Best Regards,</p>
                    <p>From </P>
                    <P><strong style = "color:blue">Team PLUTUS</strong>.</p>`;
    return mail;
};
exports.emailHtmlForCompanyTransferToInvestor = emailHtmlForCompanyTransferToInvestor;
