import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { setAuthToken, removeAuthToken } from './services/api';
import { useAuth } from './hooks/useAuth';

// Import Pages
import LoginPage from './pages/LoginPage';
import LoginPageDebug from './pages/LoginPageDebug';
import RegisterPage from './pages/RegisterPage';
import QuizListPage from './pages/QuizListPage';
import QuizAttemptPage from './pages/QuizAttemptPage';
import ResultPage from './pages/ResultPage';
import AdminDashboard from './pages/AdminDashboard';

/**
 * Main App Routes
 * Handles all routing and protected route logic
 */
function AppRoutes() {
  const { token, user } = useAuth();

  // Update auth token in API client whenever it changes
  useEffect(() => {
    if (token) {
      setAuthToken(token);
    } else {
      removeAuthToken();
    }
  }, [token]);

  return (
    <Routes>
      {/* ============================================
          PUBLIC ROUTES (Authentication)
          ============================================ */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login-debug" element={<LoginPageDebug />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ============================================
          PROTECTED USER ROUTES
          ============================================ */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <QuizListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quizzes"
        element={
          <ProtectedRoute>
            <QuizListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz/:quizId"
        element={
          <ProtectedRoute>
            <QuizAttemptPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/result/:resultId"
        element={
          <ProtectedRoute>
            <ResultPage />
          </ProtectedRoute>
        }
      />

      {/* ============================================
          ADMIN ROUTES
          ============================================ */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ============================================
          REDIRECT & 404 ROUTES
          ============================================ */}
      <Route
        path="/"
        element={
          token ? (
            user?.role === 'ADMIN' ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/**
 * Main App Component
 * Wraps entire app with AuthProvider and Router
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
