const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');

// All transaction routes require authentication
router.use(auth);

router.post('/donate', transactionController.createDonation);
router.get('/user', transactionController.getUserDonations);
router.get('/campaign/:campaignId', transactionController.getCampaignDonations);
router.get('/:id', transactionController.getTransactionById);

module.exports = router;
