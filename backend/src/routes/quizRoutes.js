const express = require('express');
const router = express.Router();

const {
  createQuiz,
  getAllQuizzes,
  getAdminQuizzes,
  getQuizById,
  updateQuiz,
  publishQuiz,
  deleteQuiz
} = require('../controllers/quizController');

const authenticateUser = require('../middlewares/auth');
const { authorizeAdmin } = require('../middlewares/authorization');

/**
 * Quiz Routes
 * 
 * Admin Routes:
 * POST   /api/quizzes              - Create quiz (admin)
 * GET    /api/quizzes/admin/all    - Get admin's quizzes (admin)
 * PUT    /api/quizzes/:id          - Update quiz (admin)
 * PUT    /api/quizzes/:id/publish  - Publish quiz (admin)
 * DELETE /api/quizzes/:id          - Delete quiz (admin)
 * 
 * User Routes:
 * GET    /api/quizzes              - Get all published quizzes (user)
 * GET    /api/quizzes/:id          - Get quiz details (user)
 */

// User routes (protected)
router.get('/', authenticateUser, getAllQuizzes);
router.get('/:id', authenticateUser, getQuizById);

// Admin routes (protected + authorized)
router.post('/', authenticateUser, authorizeAdmin, createQuiz);
router.get('/admin/all', authenticateUser, authorizeAdmin, getAdminQuizzes);
router.put('/:id', authenticateUser, authorizeAdmin, updateQuiz);
router.put('/:id/publish', authenticateUser, authorizeAdmin, publishQuiz);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteQuiz);

module.exports = router;
