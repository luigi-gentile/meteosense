const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: Number
    },
    otpExpiration: {
        type: Date
    }
});

UserSchema.index({ email: 1 });

module.exports = mongoose.model('User', UserSchema);