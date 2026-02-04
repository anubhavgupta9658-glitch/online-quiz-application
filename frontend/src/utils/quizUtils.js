/**
 * Quiz utilities
 * Helper functions for quiz operations
 */

/**
 * Calculate score percentage
 */
export const calculatePercentage = (obtained, total) => {
  return total > 0 ? (obtained / total) * 100 : 0;
};

/**
 * Format time in seconds to readable format
 */
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs}s`;
};

/**
 * Get performance feedback based on score
 */
export const getPerformanceFeedback = (score) => {
  if (score >= 90) return { message: 'Excellent! Outstanding performance! 🌟', color: 'text-green-600' };
  if (score >= 80) return { message: 'Great! Very good performance! ✅', color: 'text-green-500' };
  if (score >= 70) return { message: 'Good! You performed well. 👍', color: 'text-blue-600' };
  if (score >= 60) return { message: 'Fair! Need some improvement. 📚', color: 'text-yellow-600' };
  if (score >= 40) return { message: 'You can do better. Keep practicing! 💪', color: 'text-orange-600' };
  return { message: 'Need more preparation. Better luck next time! 🎯', color: 'text-red-600' };
};

/**
 * Get badge color based on status
 */
export const getBadgeColor = (status) => {
  switch(status) {
    case 'passed':
      return 'bg-green-100 text-green-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export default {
  calculatePercentage,
  formatTime,
  getPerformanceFeedback,
  getBadgeColor,
  validateEmail,
  validatePassword
};
