// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');

// Get all transactions (admin only)
router.get('/', auth, transactionController.getAllTransactions);

// Get transaction by ID
router.get('/:id', auth, transactionController.getTransactionById);

// Process and refund transactions
router.post('/:id/process', auth, transactionController.processTransaction);
router.post('/:id/refund', auth, transactionController.refundTransaction);

module.exports = router;
