const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passwordComplexity = require('joi-password-complexity');
const Joi = require('joi');
const bcrypt = require('bcrypt');


// Create schemas for the database
const userSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    password_hashed: {type: String, required: true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});
const walletSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    address: {type: String, required: true},
    name: {type: String, required: true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});
const transactionSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    wallet_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    transaction_hash: {type: String, required: true},
    amount: {type: Number, required: true},
    sender_address: {type: String, required: true},
    receiver_address: {type: String, required: true},
    created_at: {type: Date, default: Date.now}
});

// Create methods for the schemas
userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}


// Create models for the schemas
const User = mongoose.model('users', userSchema);
const Wallet = mongoose.model('wallets', walletSchema);
const Transaction = mongoose.model('transactions', transactionSchema);


// Validate user input with Joi from the client
module.exports = { User, Wallet, Transaction};


