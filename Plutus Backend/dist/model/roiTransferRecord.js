"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
class roiTransferRecord extends sequelize_1.Model {
    static associate(models) {
        roiTransferRecord.belongsTo(models.Company, { foreignKey: 'companyId', as: 'Company' });
    }
}
roiTransferRecord.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    investor_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    investor_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    transfer_amount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    company_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    company_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    transfer_status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: config_1.db,
    tableName: "roiTransferRecord",
    modelName: "roiTransferRecord"
});
exports.default = roiTransferRecord;
