/**
 * Backward compatibility routes for the old API structure
 * This allows the frontend to continue working without immediate changes
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const campaignController = require('../controllers/campaignController');
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');
const upload = require('../middleware/fileUpload');

// User routes (old structure)
router.post('/users/register', userController.register);
router.post('/users/login', userController.login);

// Protected user routes
router.get('/users/profile', auth, userController.getProfile);
router.put('/users/profile', auth, upload.single('profileImage'), userController.updateProfile);
router.put('/users/change-password', auth, userController.changePassword);
router.post('/users/create-campaign', auth, upload.single('image'), campaignController.createCampaign);
router.post('/users/donate', auth, transactionController.createDonation);

// Campaign routes (old structure)
router.get('/campaigns', campaignController.getAllCampaigns);
router.get('/campaigns/:id', campaignController.getCampaignById);
router.post('/campaigns', auth, upload.single('image'), campaignController.createCampaign);
router.put('/campaigns/:id', auth, upload.single('image'), campaignController.updateCampaign);
router.delete('/campaigns/:id', auth, campaignController.deleteCampaign);

// Transaction routes (old structure)
router.post('/transactions', auth, transactionController.createDonation);
router.get('/transactions/user/:userId', auth, transactionController.getUserDonations);
router.get('/transactions/campaign/:campaignId', transactionController.getCampaignDonations);

module.exports = router;
