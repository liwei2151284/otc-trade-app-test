const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'cancelled'],
        default: 'pending'
    },
    currency: {
        type: String,
        required: true,
        default: 'USD'
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['bank_transfer', 'crypto', 'card']
    },
    reference: {
        type: String,
        unique: true
    },
    description: String,
    metadata: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

// Generate unique reference before saving
transactionSchema.pre('save', async function(next) {
    if (!this.reference) {
        this.reference = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction; 