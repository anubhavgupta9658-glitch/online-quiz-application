const express = require('express');
const router = express.Router();

const { register, login, getCurrentUser } = require('../controllers/authController');
const authenticateUser = require('../middlewares/auth');

/**
 * Authentication Routes
 * 
 * POST   /api/auth/register    - Register new user
 * POST   /api/auth/login       - Login user
 * GET    /api/auth/me          - Get current user (protected)
 */

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticateUser, getCurrentUser);

module.exports = router;
