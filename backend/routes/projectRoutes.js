const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const auth = require('../middleware/auth');

// GET /api/projects - Public
router.get('/', getProjects);

// POST /api/projects - Protected
router.post('/', auth, createProject);

// PUT /api/projects/:id - Protected
router.put('/:id', auth, updateProject);

// DELETE /api/projects/:id - Protected
router.delete('/:id', auth, deleteProject);

module.exports = router;
