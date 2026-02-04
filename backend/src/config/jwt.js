/**
 * JWT Configuration and Token Generation
 * Handles JWT token creation and verification setup
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key_change_in_production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '24h';

/**
 * Generate JWT token for user
 * @param {ObjectId} userId - User's MongoDB ID
 * @param {String} role - User's role (USER or ADMIN)
 * @returns {String} - JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    {
      userId,
      role
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRE
    }
  );
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 * @throws {Error} - If token is invalid or expired
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = {
  JWT_SECRET,
  JWT_EXPIRE,
  generateToken,
  verifyToken
};
