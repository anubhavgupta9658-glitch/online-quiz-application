const express = require('express');
const router = express.Router();

const {
  submitQuiz,
  getResultById,
  getUserAttempts,
  getQuizAttempts,
  getAdminStatistics
} = require('../controllers/resultController');

const authenticateUser = require('../middlewares/auth');
const { authorizeAdmin } = require('../middlewares/authorization');

/**
 * Result/Attempt Routes
 * 
 * User Routes:
 * POST   /api/results/submit        - Submit quiz
 * GET    /api/results/:resultId     - Get result details
 * GET    /api/results/user/attempts - Get user's attempts
 * 
 * Admin Routes:
 * GET    /api/results/quiz/:quizId          - Get all attempts for quiz (admin)
 * GET    /api/admin/statistics              - Get dashboard statistics (admin)
 */

// User routes
router.post('/submit', authenticateUser, submitQuiz);
router.get('/user/attempts', authenticateUser, getUserAttempts);
router.get('/:resultId', authenticateUser, getResultById);

// Admin routes
router.get('/quiz/:quizId', authenticateUser, authorizeAdmin, getQuizAttempts);
router.get('/admin/statistics', authenticateUser, authorizeAdmin, getAdminStatistics);

module.exports = router;
