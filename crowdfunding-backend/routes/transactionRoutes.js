// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Récupérer toutes les transactions (normalement réservé à un admin)
router.get('/', transactionController.getAllTransactions);

// Récupérer une transaction
router.get('/:id', transactionController.getTransactionById);

// Simuler le process / refund
router.post('/:id/process', transactionController.processTransaction);
router.post('/:id/refund', transactionController.refundTransaction);

module.exports = router;
