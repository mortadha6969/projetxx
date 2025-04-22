const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const auth = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/fileUpload');

// Public routes
router.get('/', campaignController.getAllCampaigns);
router.get('/:id', campaignController.getCampaignById);

// Protected routes (require authentication)
router.post('/', 
    auth, 
    upload.single('image'),
    handleUploadError,
    campaignController.createCampaign
);
router.put('/:id', 
    auth, 
    upload.single('image'),
    handleUploadError,
    campaignController.updateCampaign
);
router.delete('/:id', auth, campaignController.deleteCampaign);

// Campaign iteration routes
router.post('/:id/iterate', auth, campaignController.startNewIteration);
router.get('/:id/iterations', campaignController.getPreviousIterations);

module.exports = router;