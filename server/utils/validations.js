const Joi = require('joi');

// Validations for login and register

exports.loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    return schema.validate(data);
}

exports.registerValidation = (data) => {
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        two_factor_enabled: Joi.boolean()
    });
    return schema.validate(data);
}

// Validations for 2FA

exports.qrValidation = (data) => {
    const schema = Joi.object({
        user_id: Joi.string().required()
    });
    return schema.validate(data);
}

exports.verifyValidation = (data) => {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        verification_code: Joi.string().required()
    });
    return schema.validate(data);
}

exports.change2faValidation = (data) => {
    const schema = Joi.object({
        two_factor_enabled: Joi.boolean()
    });
    return schema.validate(data);
}


// Validations for accounts and transactions

exports.restoreAccountValidation = (data) => {
    const schema = Joi.object({
        password: Joi.string(),
        address: Joi.string(),
    });
    return schema.validate(data);
}

exports.createAccountValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string(),
        address: Joi.string(),
        password: Joi.string(),
    });
    return schema.validate(data);
}

exports.saveTransactionValidation = (data) => {
    const schema = Joi.object({
        transaction_hash: Joi.string().min(64).max(64).required(),
        amount: Joi.number().required(),
        sender_address: Joi.string().min(42).max(42).required(),
        receiver_address: Joi.string().min(42).max(42).required()
    });
    return schema.validate(data);
}

// Validations for AI chat

exports.talkWithAIValidation = (data) => {
    const schema = Joi.object({
        message: Joi.string().required(),
        history: Joi.array().required()
    });
    return schema.validate(data);
}