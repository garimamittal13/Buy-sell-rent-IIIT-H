const mongoose = require('mongoose');
const crypto = require('crypto');

const orderSchema = new mongoose.Schema({
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    amount: { type: Number, required: true },
    otpHash: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Method to generate and hash OTP
orderSchema.methods.generateOTP = function() {
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const otpHash = crypto.createHash('sha256').update(otp.toString()).digest('hex');
    return { otp, otpHash };
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
