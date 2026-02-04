const express = require('express');
const router = express.Router();

const {
  addQuestion,
  getQuestionsByQuizId,
  updateQuestion,
  deleteQuestion
} = require('../controllers/questionController');

const authenticateUser = require('../middlewares/auth');
const { authorizeAdmin } = require('../middlewares/authorization');

/**
 * Question Routes
 * 
 * Admin Routes:
 * POST   /api/questions          - Add question to quiz (admin)
 * PUT    /api/questions/:id      - Update question (admin)
 * DELETE /api/questions/:id      - Delete question (admin)
 * 
 * User Routes:
 * GET    /api/questions/:quizId  - Get questions for quiz (user/admin)
 */

// User/Admin routes
router.get('/:quizId', authenticateUser, getQuestionsByQuizId);

// Admin routes
router.post('/', authenticateUser, authorizeAdmin, addQuestion);
router.put('/:id', authenticateUser, authorizeAdmin, updateQuestion);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteQuestion);

module.exports = router;
