const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes (require authentication)
router.use(auth); // Apply auth middleware to all routes below this
router.post('/create-campaign', userController.createCampaign);
router.post('/donate', userController.makeDonation);

module.exports = router;
