import { useCallback } from 'react';
import { useStreak } from './useStreak';

export function useCompleteSession() {
  const { updateStreak } = useStreak();

  const completeSession = useCallback(async () => {
    const result = await updateStreak();
    return result; 
  }, [updateStreak]);

  return { completeSession };
}