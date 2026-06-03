const express = require('express');
const router = express.Router();
const {
  getApprovedTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonialController');
const auth = require('../middleware/auth');

// GET /api/testimonials - Public (approved only)
router.get('/', getApprovedTestimonials);

// GET /api/testimonials/all - Protected (all testimonials)
router.get('/all', auth, getAllTestimonials);

// POST /api/testimonials - Protected
router.post('/', auth, createTestimonial);

// PUT /api/testimonials/:id - Protected
router.put('/:id', auth, updateTestimonial);

// DELETE /api/testimonials/:id - Protected
router.delete('/:id', auth, deleteTestimonial);

module.exports = router;
