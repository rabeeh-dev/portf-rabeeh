const Testimonial = require('../models/Testimonial');

// @desc    Get approved testimonials
// @route   GET /api/testimonials
// @access  Public
const getApprovedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ approved: true }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error('Get approved testimonials error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all testimonials (including unapproved)
// @route   GET /api/testimonials/all
// @access  Protected
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error('Get all testimonials error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Protected
const createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Create testimonial error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
// @access  Protected
const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.json(testimonial);
  } catch (error) {
    console.error('Update testimonial error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Protected
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.json({ message: 'Testimonial deleted' });
  } catch (error) {
    console.error('Delete testimonial error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getApprovedTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
