const { uploadProjectImage } = require('../middleware/upload');

const uploadProjectImageHandler = (req, res) => {
  uploadProjectImage(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    const imageUrl = `/uploads/projects/${req.file.filename}`;
    res.status(201).json({ imageUrl });
  });
};

module.exports = { uploadProjectImageHandler };
