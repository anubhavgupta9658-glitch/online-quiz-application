import React from 'react';

/**
 * Alert/Toast Component
 * Displays error, success, or info messages
 */
const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const alertStyles = {
    error: 'bg-red-100 text-red-800 border-red-400',
    success: 'bg-green-100 text-green-800 border-green-400',
    info: 'bg-blue-100 text-blue-800 border-blue-400',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-400'
  };

  return (
    <div className={`border-l-4 p-4 mb-4 rounded ${alertStyles[type]}`}>
      <div className="flex justify-between items-center">
        <p>{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-lg font-bold hover:opacity-75"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
