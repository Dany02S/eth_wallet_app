const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    password_hashed: {type: String, required: true},
    two_factor_enabled: {type: Boolean, default: false},
    two_factor_secret: {type: String, default: ''},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

const accountSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    address: {type: String, required: true},
    name: {type: String, required: true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

const transactionSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    transaction_hash: {type: String, required: true},
    amount: {type: Number, required: true},
    sender_address: {type: String, required: true},
    receiver_address: {type: String, required: true},
    created_at: {type: Date, default: Date.now}
});

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
}

const User = mongoose.model('users', userSchema);
const Account = mongoose.model('accounts', accountSchema);
const Transaction = mongoose.model('transactions', transactionSchema);

module.exports = { User, Account, Transaction };


