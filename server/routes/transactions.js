const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');

// Create deposit request
router.post('/deposit',
    auth,
    [
        body('amount').isFloat({ min: 0.01 }),
        body('currency').isIn(['USD', 'EUR', 'GBP']),
        body('paymentMethod').isIn(['bank_transfer', 'crypto', 'card'])
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { amount, currency, paymentMethod } = req.body;

            const transaction = new Transaction({
                user: req.user._id,
                type: 'deposit',
                amount,
                currency,
                paymentMethod
            });

            await transaction.save();

            res.status(201).json(transaction);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// Create withdrawal request
router.post('/withdraw',
    auth,
    [
        body('amount').isFloat({ min: 0.01 }),
        body('currency').isIn(['USD', 'EUR', 'GBP']),
        body('paymentMethod').isIn(['bank_transfer', 'crypto', 'card'])
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { amount, currency, paymentMethod } = req.body;

            // Check if user has sufficient balance
            if (req.user.balance < amount) {
                return res.status(400).json({ message: 'Insufficient balance' });
            }

            const transaction = new Transaction({
                user: req.user._id,
                type: 'withdrawal',
                amount,
                currency,
                paymentMethod
            });

            await transaction.save();

            res.status(201).json(transaction);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// Get user's transactions
router.get('/my-transactions', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Update transaction status
router.patch('/:id/status',
    [auth, isAdmin],
    [
        body('status').isIn(['completed', 'failed', 'cancelled'])
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { status } = req.body;
            const transaction = await Transaction.findById(req.params.id);

            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found' });
            }

            // Update transaction status
            transaction.status = status;
            await transaction.save();

            // If transaction is completed, update user balance
            if (status === 'completed') {
                const user = await User.findById(transaction.user);
                if (transaction.type === 'deposit') {
                    user.balance += transaction.amount;
                } else if (transaction.type === 'withdrawal') {
                    user.balance -= transaction.amount;
                }
                await user.save();
            }

            res.json(transaction);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// Admin: Get all transactions
router.get('/all',
    [auth, isAdmin],
    async (req, res) => {
        try {
            const transactions = await Transaction.find()
                .populate('user', 'email fullName')
                .sort({ createdAt: -1 });
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }
);

module.exports = router; 