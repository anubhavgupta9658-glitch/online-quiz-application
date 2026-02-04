import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService, setAuthToken } from '../services/api';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import { validateEmail, validatePassword } from '../utils/quizUtils';
import { getErrorMessage, formatValidationErrors } from '../utils/errorHandler';

/**
 * Register Page Component
 * User registration form
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear field error when user starts typing
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

    // Basic validation
    if (!formData.firstName.trim()) {
      setFieldErrors(prev => ({ ...prev, firstName: 'First name is required' }));
      return;
    }
    if (!formData.lastName.trim()) {
      setFieldErrors(prev => ({ ...prev, lastName: 'Last name is required' }));
      return;
    }
    if (!validateEmail(formData.email)) {
      setFieldErrors(prev => ({ ...prev, email: 'Invalid email format' }));
      return;
    }
    if (!validatePassword(formData.password)) {
      setFieldErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      return;
    }

    try {
      setLoading(true);
      const response = await authService.register(formData);
      
      // Set auth and token
      setAuthToken(response.data.data.token);
      setAuth(response.data.data.user, response.data.data.token);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      const message = getErrorMessage(err);
      if (err.response?.data?.errors) {
        setFieldErrors(formatValidationErrors(err.response.data.errors));
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Create Account</h1>
        <p className="text-center text-gray-600 mb-6">Join QuizHub today</p>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        {loading ? (
          <LoadingSpinner text="Creating account..." />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input"
                placeholder="John"
              />
              {fieldErrors.firstName && <p className="error-text">{fieldErrors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input"
                placeholder="Doe"
              />
              {fieldErrors.lastName && <p className="error-text">{fieldErrors.lastName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="john@example.com"
              />
              {fieldErrors.email && <p className="error-text">{fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="••••••"
              />
              {fieldErrors.password && <p className="error-text">{fieldErrors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
                placeholder="••••••"
              />
              {fieldErrors.confirmPassword && <p className="error-text">{fieldErrors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full"
            >
              Create Account
            </button>
          </form>
        )}

        {/* Login Link */}
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
