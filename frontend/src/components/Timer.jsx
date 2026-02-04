import React from 'react';

/**
 * Timer Component
 * Displays countdown timer with progress bar
 */
const Timer = ({ displayTime, progress, isWarning = false }) => {
  const textColor = isWarning ? 'text-red-600' : 'text-gray-800';
  const progressColor = isWarning ? 'bg-red-600' : 'bg-blue-600';

  return (
    <div className="flex flex-col items-center">
      <div className={`text-4xl font-bold ${textColor} mb-2`}>
        {displayTime}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${progressColor} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;
