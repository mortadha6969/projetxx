const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Accept images and documents
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images (JPEG, PNG, GIF) and documents (PDF, DOC, DOCX) are allowed.'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
        files: 5 // Max 5 files per upload
    }
});

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
    console.log('File upload error:', err);

    if (err instanceof multer.MulterError) {
        // Multer-specific errors
        console.log('Multer error code:', err.code);
        console.log('Multer error field:', err.field);

        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                return res.status(400).json({
                    message: 'File too large. Maximum size is 5MB.'
                });
            case 'LIMIT_FILE_COUNT':
                return res.status(400).json({
                    message: 'Too many files. Maximum is 5 files.'
                });
            case 'LIMIT_UNEXPECTED_FILE':
                return res.status(400).json({
                    message: `Unexpected field name in form data: ${err.field}`
                });
            default:
                return res.status(400).json({
                    message: `Error uploading file: ${err.code}`
                });
        }
    } else if (err) {
        // Custom errors (like invalid file type)
        return res.status(400).json({
            message: err.message || 'Error uploading file.'
        });
    }
    next();
};

module.exports = {
    upload,
    handleUploadError
};