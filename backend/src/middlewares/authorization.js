/**
 * Authorization Middleware
 * Verifies user has required role for protected routes
 * Must be called after authenticateUser middleware
 */

/**
 * Check if user has ADMIN role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Admin privileges required.',
      userRole: req.user.role
    });
  }

  next();
};

/**
 * Check if user has USER role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authorizeUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'USER' && req.user.role !== 'ADMIN') {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. User privileges required.'
    });
  }

  next();
};

module.exports = {
  authorizeAdmin,
  authorizeUser
};
