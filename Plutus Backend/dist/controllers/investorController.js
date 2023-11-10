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
exports.getInvestment = exports.getInvestor = void 0;
const investor_1 = __importDefault(require("../model/investor"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getInvestor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        console.log(token);
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        const companyId = decodedToken.id;
        // console.log(companyId);
        const investor = yield investor_1.default.findAll({
            where: { companyId: companyId },
        });
        // console.log("INVESTOR", investor);
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
const getInvestment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        // console.log(token);
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        const email = decodedToken.email;
        // console.log("EMAIL", email);
        const investment = yield investor_1.default.findAll({
            where: { email: email },
        });
        // console.log("INVESTOR", investment);
        const allInvestment = yield investor_1.default.findAll();
        console.log(allInvestment);
        if (investment) {
            const totalInvestedCapital = yield investor_1.default.sum("investedCapital", {
                where: { email: email },
            });
            console.log("TOTAL", totalInvestedCapital);
            const totalInvestments = yield investor_1.default.count({
                where: { email: email },
            });
            return res.status(200).json({
                message: "Fetching Investor Successfully",
                data: investment,
                totalInvestedCapital: totalInvestedCapital,
                totalInvestments: totalInvestments,
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
exports.getInvestment = getInvestment;
// export const createInvestor = async (req: Request, res: Response) => {
//     try {
//       const {
//         firstName,
//         lastName,
//         accountNumber,
//         email,
//         investedCapital,
//         expectedReturn,
//         monthlyReturn,
//     }  = req.body
//         const companyId = req.params.id
//         const existingCompany = await Company.findOne({where : {id : companyId}})
//         if(!existingCompany){
//             return res.status(400).json({
//                 message: "Invalid already exists"
//              });
//         }
//         const existingInvestor = await Investor.findOne({ where: { email } }) as unknown as INVESTOR;
//         if(!existingInvestor){
//             return res.status(400).json({
//                 message: "Invalid already exists"
//              });
//         }
//           // OTP
//         const OTP = generateOTP()
//         const newInvestor = await Investor.create({
//             id : v4(),
//             firstName,
//             lastName,
//             accountNumber,
//             email,
//             investedCapital,
//             expectedReturn,
//             monthlyReturn,
//             active: true,
//             companyId,
//             otp: OTP
//         }) as unknown as INVESTOR;
//         const investor = await Investor.findOne({ where: { email } }) as unknown as INVESTOR
//          const token = jwt.sign({ email: investor.email, id: investor.id }, process.env.APP_SECRET!, {
//             expiresIn: '1d'})
//         //RETURN NEW INVESTOR
//             const html = emailHtml(email, OTP)
//             await sendmail(`${process.env.GMAIL_INVESTOR}`, email, "Welcome", html)
//             return res.status(200).json({
//                 message:`User created successfully`,
//                 newInvestor,
//                 token
//             });
//     } catch (error) {
//         console.log(error);
//     }
// }
// import { Sequelize, literal } from "sequelize";
// export const getTotalInvestment = async (req: Request, res: Response) => {
//   try {
//     const token: any = req.headers.authorization;
//     // console.log(token);
//     const token_info = token.split(" ")[1];
//     const decodedToken: any = jwt.verify(token_info, process.env.APP_SECRET!);
//     const email = decodedToken.email;
//     console.log("EMAIL", email);
//     const investor = await Investor.findAll({
//       where: { email: email },
//     });
//     console.log("INVESTOR", investor);
//     if (investor) {
//       // Calculate total invested capital using sequelize.literal
//       const totalInvestedCapital = await Investor.sum("investedCapital", {
//         where: { email: email },
//       });
//       console.log("TOTAL", totalInvestedCapital);
//       const totalInvestments = await Investor.count({
//         where: { email: email },
//       });
//       return res.status(200).json({
//         message: "Fetching Investor Successfully",
//         data: investor,
//         totalInvestedCapital: totalInvestedCapital,
//         totalInvestments: totalInvestments,
//       });
//     } else {
//       res.status(400).json({
//         message: "Error Fetching Investor",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
