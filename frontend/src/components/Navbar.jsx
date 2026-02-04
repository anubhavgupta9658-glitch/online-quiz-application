import React from 'react';

/**
 * Navigation Bar Component
 * Displays app logo, menu, and user info
 */
const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">📝 QuizHub</h1>
          </div>

          {/* User Info */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {user.role === 'ADMIN' ? '👨‍💼 Admin' : '👤 User'}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
