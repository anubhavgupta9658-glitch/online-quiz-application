import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService, setAuthToken } from '../services/api';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import { validateEmail } from '../utils/quizUtils';
import { getErrorMessage } from '../utils/errorHandler';

/**
 * Login Page Component
 * User login form
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Trim whitespace from email
    const email = formData.email.trim();
    const password = formData.password;

    // Validation
    if (!email) {
      setFieldErrors(prev => ({ ...prev, email: 'Email is required' }));
      return;
    }
    if (!validateEmail(email)) {
      setFieldErrors(prev => ({ ...prev, email: 'Invalid email format' }));
      return;
    }
    if (!password) {
      setFieldErrors(prev => ({ ...prev, password: 'Password is required' }));
      return;
    }
    if (password.length < 6) {
      setFieldErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      
      // Set auth and token
      setAuthToken(response.data.data.token);
      setAuth(response.data.data.user, response.data.data.token);
      
      // Redirect based on role
      const user = response.data.data.user;
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const message = getErrorMessage(err);
      // Check if error is specifically about invalid credentials
      if (message.includes('Invalid email or password') || message.includes('401')) {
        setError('❌ Invalid email or password. Please check your credentials and try again.');
      } else if (message.includes('Validation failed')) {
        setError('❌ Please check your email and password format.');
      } else {
        setError(`❌ Login failed: ${message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back</h1>
        <p className="text-center text-gray-600 mb-6">Login to QuizHub</p>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        {loading ? (
          <LoadingSpinner text="Logging in..." />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className={`input ${fieldErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="your@email.com"
                required
              />
              {fieldErrors.email && <p className="error-text">⚠️ {fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className={`input ${fieldErrors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="••••••"
                required
              />
              {fieldErrors.password && <p className="error-text">⚠️ {fieldErrors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full"
            >
              Login
            </button>
          </form>
        )}

        {/* Register Link */}
        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register now
          </Link>
        </p>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs text-gray-700 font-semibold mb-2">✓ Test Credentials:</p>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="p-2 bg-white rounded border border-green-100">
              <p><strong>User Email:</strong></p>
              <p className="font-mono text-blue-600">user@quizhub.com</p>
              <p className="mt-1"><strong>Password:</strong></p>
              <p className="font-mono text-blue-600">123456</p>
            </div>
            <div className="p-2 bg-white rounded border border-green-100">
              <p><strong>Admin Email:</strong></p>
              <p className="font-mono text-blue-600">admin@quizhub.com</p>
              <p className="mt-1"><strong>Password:</strong></p>
              <p className="font-mono text-blue-600">123456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
