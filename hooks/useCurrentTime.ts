
import { useState, useEffect } from 'react';

// Updates every second for a smoother clock display, but logic can still poll less frequently.
export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for clock accuracy

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return currentTime;
};
