const express = require('express');
const router = express.Router();
const { login, getProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

// POST /api/auth/login - Public
router.post('/login', login);

// GET /api/auth/profile - Protected
router.get('/profile', auth, getProfile);

module.exports = router;
