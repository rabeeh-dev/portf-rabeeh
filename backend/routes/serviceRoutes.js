const express = require('express');
const router = express.Router();
const {
  getServices,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const auth = require('../middleware/auth');

// GET /api/services - Public
router.get('/', getServices);

// POST /api/services - Protected
router.post('/', auth, createService);

// PUT /api/services/:id - Protected
router.put('/:id', auth, updateService);

// DELETE /api/services/:id - Protected
router.delete('/:id', auth, deleteService);

module.exports = router;
