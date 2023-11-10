"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transferController_1 = require("../controllers/all_transfers/transferController");
const adminQueryController_1 = require("../controllers/admin/adminQueryController");
const companyMutationController_1 = require("../controllers/company/companyMutationController");
// import { DeleteTransactions } from '../controllers/admin/adminMutationController'
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/transactions', auth_1.auth, transferController_1.transferToBeneficiary);
router.put('/savings', auth_1.auth, transferController_1.transferToSavingsWallet);
router.post('/investment', auth_1.auth, transferController_1.transferToInvestmentCompany);
router.get("/successfultransactions", auth_1.auth, adminQueryController_1.trackSuccessfulTransaction);
router.get("/failedtransactions", auth_1.auth, adminQueryController_1.trackFailedTransaction);
router.post("/roitransfer", auth_1.companyAuth, companyMutationController_1.companyTransferToInvestor);
// router.delete('/delete/:id', auth, DeleteTransactions)
exports.default = router;
