"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
class Company extends sequelize_1.Model {
    static associate(models) {
        Company.hasMany(models.Investor, {
            foreignKey: "companyId",
            as: "Company",
        });
    }
}
Company.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    companyName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    company_description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    otp: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    accountNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    wallet: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    businessType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    roi: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    noOfInvestors: {
        type: sequelize_1.DataTypes.INTEGER,
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
    duration: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    min_investment_amount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    max_investment_amount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    imageUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    zipCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    country: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: config_1.db,
    tableName: "Company",
});
exports.default = Company;
