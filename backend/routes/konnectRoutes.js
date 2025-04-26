const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const konnectController = require('../controllers/konnectController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Initialize payment
router.post(
  '/init-payment',
  authenticateToken,
  [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('campaignId').isNumeric().withMessage('Campaign ID must be a number'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('firstName').optional().isString().withMessage('First name must be a string'),
    body('lastName').optional().isString().withMessage('Last name must be a string'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phoneNumber').optional().isString().withMessage('Phone number must be a string'),
    body('orderId').optional().isString().withMessage('Order ID must be a string')
  ],
  konnectController.initializePayment
);

// Get payment details
router.get(
  '/payment/:paymentRef',
  authenticateToken,
  konnectController.getPaymentDetails
);

// Verify payment
router.get(
  '/verify/:paymentRef',
  authenticateToken,
  konnectController.verifyPayment
);

// Webhook (no authentication required as it's called by Konnect)
router.post(
  '/webhook',
  konnectController.handleWebhook
);

module.exports = router;
