/**
 * Error handler utility
 * Formats error messages from API responses
 */

export const getErrorMessage = (error) => {
  // API error with response
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // API error with errors array
  if (error.response?.data?.errors?.length > 0) {
    return error.response.data.errors[0].message;
  }

  // Network error
  if (error.message === 'Network Error') {
    return 'Network error. Please check your connection.';
  }

  // Generic error
  return error.message || 'An error occurred. Please try again.';
};

/**
 * Format validation errors from API
 */
export const formatValidationErrors = (errors) => {
  if (!Array.isArray(errors)) return [];
  
  return errors.reduce((acc, err) => {
    acc[err.field] = err.message;
    return acc;
  }, {});
};

export default {
  getErrorMessage,
  formatValidationErrors
};
