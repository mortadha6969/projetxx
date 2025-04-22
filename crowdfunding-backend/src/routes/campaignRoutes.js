const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const auth = require('../middleware/auth');
const upload = require('../middleware/fileUpload');

// Public routes
router.get('/', campaignController.getAllCampaigns);
router.get('/search', campaignController.searchCampaigns);
router.get('/:id', campaignController.getCampaignById);
router.get('/user/:userId', campaignController.getUserCampaigns);

// Protected routes (require authentication)
router.use(auth);
router.post('/', upload.single('image'), campaignController.createCampaign);
router.put('/:id', upload.single('image'), campaignController.updateCampaign);
router.delete('/:id', campaignController.deleteCampaign);
router.get('/my/campaigns', campaignController.getUserCampaigns);

module.exports = router;
