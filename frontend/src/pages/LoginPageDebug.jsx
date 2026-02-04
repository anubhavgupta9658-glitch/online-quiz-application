import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService, setAuthToken } from '../services/api';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import { validateEmail } from '../utils/quizUtils';
import { getErrorMessage } from '../utils/errorHandler';

/**
 * Login Page Component - WITH DEBUG LOGGING
 * User login form with comprehensive debugging
 */
const LoginPageDebug = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});

  // Log on mount
  useEffect(() => {
    const msg = `[DEBUG] LoginPage mounted\n- useAuth context available: ${!!setAuth}\n- navigate available: ${!!navigate}\n`;
    console.log(msg);
    setDebugInfo(prev => prev + msg);
  }, []);

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
    const newDebug = `[DEBUG] Form submitted\n- Email: ${formData.email}\n`;
    console.log(newDebug);
    setDebugInfo(prev => prev + newDebug);
    
    setError(null);
    setFieldErrors({});

    // Validation
    if (!formData.email.trim()) {
      setFieldErrors(prev => ({ ...prev, email: 'Email is required' }));
      return;
    }
    if (!validateEmail(formData.email)) {
      setFieldErrors(prev => ({ ...prev, email: 'Invalid email format' }));
      return;
    }
    if (!formData.password) {
      setFieldErrors(prev => ({ ...prev, password: 'Password is required' }));
      return;
    }
    if (formData.password.length < 6) {
      setFieldErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      return;
    }

    try {
      setLoading(true);
      const debugMsg = `[DEBUG] Calling authService.login...\n`;
      console.log(debugMsg);
      setDebugInfo(prev => prev + debugMsg);
      
      const response = await authService.login(formData);
      
      const successMsg = `[SUCCESS] Login response received\n- Status: ${response.status}\n- User: ${response.data.data.user.email}\n`;
      console.log(successMsg);
      setDebugInfo(prev => prev + successMsg);
      
      // Set auth and token
      setAuthToken(response.data.data.token);
      setAuth(response.data.data.user, response.data.data.token);
      
      // Redirect based on role
      const user = response.data.data.user;
      const redirectMsg = `[DEBUG] Redirecting to ${user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}\n`;
      console.log(redirectMsg);
      setDebugInfo(prev => prev + redirectMsg);
      
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMsg = `[ERROR] Login failed\n- Error: ${err.message}\n- Response: ${err.response?.data?.message || 'N/A'}\n`;
      console.error(errorMsg, err);
      setDebugInfo(prev => prev + errorMsg);
      
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
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back (DEBUG)</h1>
        <p className="text-center text-gray-600 mb-6">Login to QuizHub - Debug Version</p>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        {debugInfo && (
          <div className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg">
            <p className="text-xs text-gray-700 font-mono whitespace-pre-wrap">{debugInfo}</p>
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
                className={`input ${fieldErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="your@email.com"
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
                className={`input ${fieldErrors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="••••••"
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
              <p className="font-mono text-blue-600">user@test.com</p>
              <p className="mt-1"><strong>Password:</strong></p>
              <p className="font-mono text-blue-600">password</p>
            </div>
            <div className="p-2 bg-white rounded border border-green-100">
              <p><strong>Admin Email:</strong></p>
              <p className="font-mono text-blue-600">admin@test.com</p>
              <p className="mt-1"><strong>Password:</strong></p>
              <p className="font-mono text-blue-600">password</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPageDebug;
