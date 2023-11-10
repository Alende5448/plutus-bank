"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const user_1 = __importDefault(require("./user"));
class Beneficiary extends sequelize_1.Model {
}
// class Beneficiary extends Model<BeneficiaryDetails> {
//     public static associate(models: { User: typeof User}): void {
//         Beneficiary.belongsTo(models.User, { foreignKey: "userId", as: "User"})
//     }
// }
Beneficiary.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: user_1.default,
            key: "id",
        },
    },
    beneficiaryName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    accountNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize: config_1.db,
    tableName: "Beneficiary",
    modelName: "Beneficiary",
});
exports.default = Beneficiary;
