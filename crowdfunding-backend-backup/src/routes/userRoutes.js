const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/fileUpload');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes (require authentication)
router.use(auth);
router.get('/profile', userController.getProfile);
router.put('/profile', upload.single('profileImage'), userController.updateProfile);
router.put('/change-password', userController.changePassword);

module.exports = router;
