const express = require('express');
const router = express.Router();
const {
  submitContact,
  getContacts,
  markRead,
  deleteContact,
} = require('../controllers/contactController');
const auth = require('../middleware/auth');

// POST /api/contacts - Public
router.post('/', submitContact);

// GET /api/contacts - Protected
router.get('/', auth, getContacts);

// PUT /api/contacts/:id/read - Protected
router.put('/:id/read', auth, markRead);

// DELETE /api/contacts/:id - Protected
router.delete('/:id', auth, deleteContact);

module.exports = router;
