import { useState, useEffect } from 'react';

/**
 * Custom hook for countdown timer
 * Used in quiz attempt page
 * 
 * @param {Number} initialSeconds - Initial time in seconds
 * @param {Boolean} isActive - Whether timer should be running
 * @param {Function} onTimeUp - Callback when time runs out
 * @returns {Object} - { timeLeft, displayTime, progress }
 */
export const useTimer = (initialSeconds, isActive = true, onTimeUp = null) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  // Reset timeLeft when initialSeconds changes
  useEffect(() => {
    setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (onTimeUp) {
            // Call onTimeUp without passing prev so it only triggers once
            onTimeUp();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTimeUp]);

  // Format time to MM:SS
  const displayTime = `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`;

  // Calculate progress percentage
  const progress = ((initialSeconds - timeLeft) / initialSeconds) * 100;

  return {
    timeLeft,
    displayTime,
    progress: Math.min(progress, 100)
  };
};

export default useTimer;
