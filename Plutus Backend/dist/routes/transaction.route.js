"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clientQueryController_1 = require("../controllers/client/clientQueryController");
const adminQueryController_1 = require("../controllers/admin/adminQueryController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/getAllTransactions', auth_1.auth, adminQueryController_1.getAllTransactions);
router.get('/getUserDetails', auth_1.auth, clientQueryController_1.getUserDetails);
router.get('/getAllExpenses', auth_1.auth, clientQueryController_1.getAllExpenses);
router.get('/getAllIncome', auth_1.auth, clientQueryController_1.getAllIncome);
exports.default = router;
