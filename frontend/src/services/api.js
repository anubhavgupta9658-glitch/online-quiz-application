import axios from 'axios';

/**
 * API Service
 * Handles all HTTP requests to backend
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('[API] Base URL:', API_BASE_URL);

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  config => {
    console.log('[API] Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  error => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  response => {
    console.log('[API] Response:', response.status, response.config.url, response.data);
    return response;
  },
  error => {
    console.error('[API] Response error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

/**
 * Set authorization header
 * Call this after login with the JWT token
 */
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

/**
 * Remove authorization header
 * Call this after logout
 */
export const removeAuthToken = () => {
  delete apiClient.defaults.headers.common['Authorization'];
};

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

export const authService = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getCurrentUser: () => apiClient.get('/auth/me')
};

// ============================================
// QUIZ ENDPOINTS
// ============================================

export const quizService = {
  getAllQuizzes: () => apiClient.get('/quizzes'),
  getAdminQuizzes: () => apiClient.get('/quizzes/admin/all'),
  getQuizById: (id) => apiClient.get(`/quizzes/${id}`),
  createQuiz: (data) => apiClient.post('/quizzes', data),
  updateQuiz: (id, data) => apiClient.put(`/quizzes/${id}`, data),
  publishQuiz: (id) => apiClient.put(`/quizzes/${id}/publish`),
  deleteQuiz: (id) => apiClient.delete(`/quizzes/${id}`)
};

// ============================================
// QUESTION ENDPOINTS
// ============================================

export const questionService = {
  getQuestionsByQuizId: (quizId) => apiClient.get(`/questions/${quizId}`),
  addQuestion: (data) => apiClient.post('/questions', data),
  updateQuestion: (id, data) => apiClient.put(`/questions/${id}`, data),
  deleteQuestion: (id) => apiClient.delete(`/questions/${id}`)
};

// ============================================
// RESULT/ATTEMPT ENDPOINTS
// ============================================

export const resultService = {
  submitQuiz: (data) => apiClient.post('/results/submit', data),
  getResultById: (id) => apiClient.get(`/results/${id}`),
  getUserAttempts: () => apiClient.get('/results/user/attempts'),
  getQuizAttempts: (quizId) => apiClient.get(`/results/quiz/${quizId}`),
  getAdminStatistics: () => apiClient.get('/results/admin/statistics')
};

export default apiClient;
