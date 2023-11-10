"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {createInvestor} from '../controllers/investorController'
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
// import {
//   getInvestment,
//   //   getTotalInvestment,
// } from "../controllers/investorController";
const clientQueryController_1 = require("../controllers/client/clientQueryController");
const companyQueryController_1 = require("../controllers/company/companyQueryController");
const router = (0, express_1.Router)();
router.get("/get", auth_1.companyAuth, companyQueryController_1.getInvestor);
router.get("/getinvestment/", auth_1.auth, clientQueryController_1.getInvestment);
router.get("/getInvestmentsByUser", auth_1.auth, clientQueryController_1.getInvestmentsByUser);
// router.get("/getinvestment/", auth, getInvestment);
// router.get("/gettotalinvestment", auth, getTotalInvestment);
// router.post('/register/:id', createInvestor);
exports.default = router;
