const multer = require('multer');

// Use memory storage so files are available as buffers in req.file.buffer
const storage = multer.memoryStorage();

// Accept only image MIME types
const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});

module.exports = {
  upload
};
