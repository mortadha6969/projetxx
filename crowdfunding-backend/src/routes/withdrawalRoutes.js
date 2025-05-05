const express = require('express');
const router = express.Router();
const withdrawalController = require('../controllers/withdrawalController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');

// Request to forward funds to Konnect
router.post(
  '/request',
  auth,
  [
    body('campaignId').isNumeric().withMessage('Campaign ID must be a number')
  ],
  withdrawalController.requestForwardToKonnect
);

// Check eligibility for forwarding funds to Konnect
router.get(
  '/check/:campaignId',
  auth,
  withdrawalController.checkForwardEligibility
);

module.exports = router;
