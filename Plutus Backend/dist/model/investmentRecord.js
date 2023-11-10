"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
class investment_Records extends sequelize_1.Model {
}
investment_Records.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    amount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    investor_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    investor_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    investment_company_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    transaction_status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: config_1.db,
    tableName: "investment_Records"
});
exports.default = investment_Records;
// id: v4(),
// amount: amount,
// investor_name: user_firstName + " " + user_lastName,
// investor_id: user_id,
// investment_company_id: company_id,
// transaction_status: "FAILED"
