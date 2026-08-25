import { useState, useEffect, useCallback } from 'react';
import { streakService, StreakData, StreakUpdateResult } from '@/services/streakService';

export function useStreak() {
  const [streak, setStreak] = useState<StreakData>({
    lastDate: '',
    streakCount: 0,
    highestStreak: 0,
  });
  const [loading, setLoading] = useState(true);

  // Load streak data from storage
  const loadStreak = useCallback(async () => {
    setLoading(true);
    const data = await streakService.getStreak();
    setStreak(data);
    setLoading(false);
  }, []);

  // Update streak with today's date
  const updateStreak = useCallback(async (): Promise<StreakUpdateResult> => {
    const result = await streakService.updateStreak();
    if (result.updated) {
      setStreak(result.data);
    }
    return result;
  }, []);

  // Reset streak (for testing)
  const resetStreak = useCallback(async () => {
    await streakService.resetStreak();
    setStreak({ lastDate: '', streakCount: 0, highestStreak: 0 });
  }, []);

  // Load streak on mount
  useEffect(() => {
    loadStreak();
  }, [loadStreak]);

  return { 
    streak, 
    loading, 
    updateStreak, 
    resetStreak, 
    refresh: loadStreak 
  };
}