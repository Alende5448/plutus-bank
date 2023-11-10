"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const beneficiaryQueryController_1 = require("../controllers/beneficiary/beneficiaryQueryController");
const beneficiaryMutationController_1 = require("../controllers/beneficiary/beneficiaryMutationController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/get', auth_1.auth, beneficiaryQueryController_1.getBeneficiaries);
router.post('/create', auth_1.auth, beneficiaryMutationController_1.createBeneficiaries);
router.delete('/delete', auth_1.auth, beneficiaryMutationController_1.deleteBeneficiary);
exports.default = router;
