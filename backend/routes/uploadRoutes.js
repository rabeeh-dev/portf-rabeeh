const express = require('express');
const { uploadProjectImageHandler } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/project', protect, uploadProjectImageHandler);

module.exports = router;
