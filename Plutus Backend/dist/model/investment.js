"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const company_1 = __importDefault(require("./company"));
var Duration;
(function (Duration) {
    Duration["THREE_MONTH"] = "3 Month";
    Duration["SIX_MONTH"] = "6 Month";
    Duration["TWELVE_MONTH"] = "12 Month";
})(Duration || (Duration = {}));
class Investment extends sequelize_1.Model {
    static associate() {
        Investment.belongsTo(company_1.default, { foreignKey: "company_id", as: "Company" });
    }
}
Investment.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    company_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    companyName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    investment_category: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    investment_description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    returnOnInvestment: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    duration: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(Duration)),
        allowNull: false,
    },
    min_investment_amount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    max_investment_amount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: config_1.db,
    modelName: "Investment",
});
exports.default = Investment;
