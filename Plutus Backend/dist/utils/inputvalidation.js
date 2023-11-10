"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyChange_Password = exports.createUser_Image = exports.verifyChangePassword_Email = exports.forgot_password = exports.userProfileUpdate = exports.transferToSavings_Wallet = exports.transfer_InvestmentCompany = exports.transfer_Beneficiary = exports.createBeneficiary = exports.companyLogin = exports.clientLogin = exports.createCompanySchema = exports.createAdminSchema = exports.signUpUser = void 0;
const joi_1 = __importDefault(require("joi"));
exports.signUpUser = joi_1.default.object({
    firstName: joi_1.default.string().required()
        .messages({
        'any.required': 'Firstname is required'
    }),
    lastName: joi_1.default.string().required()
        .messages({
        'any.required': 'Lastname is required'
    }),
    email: joi_1.default.string().email().required()
        .messages({
        'any.required': 'Email is required'
    }),
    password: joi_1.default.string().min(7)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .required()
        .messages({
        'string.base': 'Password must be a string',
        'string.min': 'Password must be at least 7 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
        'any.required': 'Password is required',
    })
});
exports.createAdminSchema = joi_1.default.object({
    firstName: joi_1.default.string().required()
        .messages({
        'any.required': 'Firstname is required'
    }),
    lastName: joi_1.default.string().required()
        .messages({
        'any.required': 'Lastname is required'
    }),
    email: joi_1.default.string().email().required()
        .messages({
        'any.required': 'Email is required'
    }),
    password: joi_1.default.string().min(7)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .required()
        .messages({
        'string.base': 'Password must be a string',
        'string.min': 'Password must be at least 7 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
        'any.required': 'Password is required',
    })
});
exports.createCompanySchema = joi_1.default.object({
    companyName: joi_1.default.string().required()
        .messages({
        'any.required': 'Please provide company name.'
    }),
    company_description: joi_1.default.string().required()
        .messages({
        'any.required': 'Please provide company description.'
    }),
    email: joi_1.default.string().email().required()
        .messages({
        'any.required': 'Email is required'
    }),
    password: joi_1.default.string().min(7)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .required()
        .messages({
        'string.base': 'Password must be a string',
        'string.min': 'Password must be at least 7 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
        'any.required': 'Password is required',
    }),
    businessType: joi_1.default.string().required()
        .messages({
        'any.required': 'Business type is required'
    }),
    roi: joi_1.default.any().required(),
    investment_category: joi_1.default.string().required()
        .messages({
        'any.required': 'Investment category is required'
    }),
    investment_description: joi_1.default.string().required()
        .messages({
        'any.required': 'Please provide a description for this investment'
    }),
    duration: joi_1.default.string().required(),
    min_investment_amount: joi_1.default.number().required()
        .messages({
        'any.required': 'Minimum investment amount is required'
    }),
    max_investment_amount: joi_1.default.number().required()
        .messages({
        'any.required': 'Maximum investment amount is required'
    }),
});
exports.clientLogin = joi_1.default.object({
    email: joi_1.default.string().email().required()
        .messages({
        'any.required': 'email is required'
    }),
    password: joi_1.default.string().min(7)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .required()
        .messages({
        'string.base': 'Password must be a string',
        'string.min': 'Password must be at least 7 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
        'any.required': 'Password is required',
    })
});
exports.companyLogin = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(7)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .required()
        .messages({
        'string.base': 'Password must be a string',
        'string.min': 'Password must be at least 7 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
        'any.required': 'Password is required',
    })
});
exports.createBeneficiary = joi_1.default.object({
    beneficiaryName: joi_1.default.string().required()
        .messages({
        'any.required': 'Beneficiary name is required'
    }),
    accountNumber: joi_1.default.string().required()
        .messages({
        'any.required': 'Account number is required'
    })
});
exports.transfer_Beneficiary = joi_1.default.object({
    beneficiary_name: joi_1.default.string().required()
        .messages({
        'any.required': 'Beneficiary name is required'
    }),
    accountNumber: joi_1.default.string().required()
        .messages({
        'any.required': 'Account number is required'
    }),
    amount: joi_1.default.number().required()
        .messages({
        'any.required': 'Amount is required'
    }),
    beneficiary_email: joi_1.default.string().email().required(),
    payer_reference: joi_1.default.string().required()
        .messages({
        'any.required': 'Payer reference is required'
    }),
    information_for_beneficiary: joi_1.default.string().required()
        .messages({
        'any.required': 'Please provide beneficiary information'
    }),
    transfer_purpose: joi_1.default.string().required(),
});
exports.transfer_InvestmentCompany = joi_1.default.object({
    amount: joi_1.default.number().required()
        .messages({
        'any.required': 'Please enter amount',
    }),
    company_account_number: joi_1.default.string().required()
        .messages({
        'any.required': 'Please provide company account number',
    }),
});
exports.transferToSavings_Wallet = joi_1.default.object({
    amount: joi_1.default.number().required()
        .messages({
        'any.required': 'Please enter amount',
    }),
});
exports.userProfileUpdate = joi_1.default.object({
    firstName: joi_1.default.string(),
    lastName: joi_1.default.string(),
    email: joi_1.default.string().email(),
    phoneNumber: joi_1.default.string(),
    address: joi_1.default.string(),
    zipCode: joi_1.default.string(),
    city: joi_1.default.string(),
    state: joi_1.default.string(),
    country: joi_1.default.string(),
});
exports.forgot_password = joi_1.default.object({
    email: joi_1.default.string().email().messages({
        'string.email': 'email is required',
    }),
});
exports.verifyChangePassword_Email = joi_1.default.object({
    email: joi_1.default.string().email()
        .messages({
        'string.email': 'email is required',
    }),
});
exports.createUser_Image = joi_1.default.object({
    email: joi_1.default.string().email().messages({
        'string.email': 'email is required',
    }),
});
exports.verifyChange_Password = joi_1.default.object({
    oldPassword: joi_1.default.string().min(7)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .required()
        .messages({
        'string.base': 'Password must be a string',
        'string.min': 'Password must be at least 7 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
        'any.required': 'Password is required',
    }),
    newPassword: joi_1.default.string().min(7)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .required()
        .messages({
        'string.base': 'Password must be a string',
        'string.min': 'Password must be at least 7 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
        'any.required': 'Password is required',
    }),
    confirm_password: joi_1.default.ref("newPassword")
});
