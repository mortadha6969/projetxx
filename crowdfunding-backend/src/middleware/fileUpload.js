const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Get upload path from environment variable or use default
const uploadDir = process.env.UPLOAD_PATH
    ? path.resolve(process.env.UPLOAD_PATH)
    : path.join(__dirname, '../../uploads');

console.log(`Using upload directory: ${uploadDir}`);

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created upload directory: ${uploadDir}`);
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

// File filter with enhanced security
const fileFilter = (req, file, cb) => {
    // Accept only specific file types
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    // Check file mimetype
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Invalid file type. Only images (JPEG, PNG, GIF) and documents (PDF, DOC, DOCX) are allowed.'), false);
    }

    // Validate file extension
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx'];

    if (!allowedExtensions.includes(fileExtension)) {
        return cb(new Error(`Invalid file extension: ${fileExtension}. Allowed extensions: ${allowedExtensions.join(', ')}`), false);
    }

    // Additional security check: verify that extension matches mimetype
    const validCombinations = {
        '.jpg': ['image/jpeg'],
        '.jpeg': ['image/jpeg'],
        '.png': ['image/png'],
        '.gif': ['image/gif'],
        '.pdf': ['application/pdf'],
        '.doc': ['application/msword'],
        '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    };

    if (!validCombinations[fileExtension].includes(file.mimetype)) {
        return cb(new Error('File extension does not match file type'), false);
    }

    // File passed all checks
    cb(null, true);
};

// Configure multer with enhanced security
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE) : 5 * 1024 * 1024, // Use env var or default to 5MB
        files: 5, // Max 5 files per upload
        fieldNameSize: 100, // Max field name size
        fieldSize: 1024 * 1024, // Max field value size (1MB)
        parts: 20 // Max number of parts (fields + files)
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
