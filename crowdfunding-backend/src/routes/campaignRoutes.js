const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const auth = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/fileUpload');

// Public routes
router.get('/', campaignController.getAllCampaigns);
router.get('/user', auth, campaignController.getUserCampaigns);
router.get('/:id', campaignController.getCampaignById);

// Protected routes (require authentication)
router.post('/',
    auth,
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'additionalImages', maxCount: 5 } // Increased to 5 to accommodate PDF files
    ]),
    handleUploadError,
    campaignController.createCampaign
);
router.put('/:id',
    auth,
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'additionalImages', maxCount: 5 } // Increased to 5 to accommodate PDF files
    ]),
    handleUploadError,
    campaignController.updateCampaign
);
router.delete('/:id', auth, campaignController.deleteCampaign);

// Campaign iteration routes
router.post('/:id/iterate', auth, campaignController.startNewIteration);
router.get('/:id/iterations', campaignController.getPreviousIterations);

module.exports = router;
