import AsyncStorage from '@react-native-async-storage/async-storage';

const STREAK_KEY = '@breathing_streak_data';

export interface StreakData {
  lastDate: string;
  streakCount: number;
  highestStreak: number;
}

export interface StreakUpdateResult {
  data: StreakData;
  updated: boolean;
}

export const streakService = {
  async getStreak(): Promise<StreakData> {
    try {
      const saved = await AsyncStorage.getItem(STREAK_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        // ✅ Ensure highestStreak is a number (handle null)
        return {
          lastDate: data.lastDate || '',
          streakCount: data.streakCount || 0,
          highestStreak: data.highestStreak !== null ? data.highestStreak : 0 , 
        };
      }
      return { lastDate: '', streakCount: 0, highestStreak: 0 };
    } catch (error) {
      console.error('Error loading streak:', error);
      return { lastDate: '', streakCount: 0, highestStreak: 0 };
    }
  },

  async updateStreak(): Promise<StreakUpdateResult> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      const currentData = await this.getStreak();
      const { lastDate, streakCount, highestStreak } = currentData;

      console.log("current:", currentData);

      // If already completed today, return without updating
      if (lastDate === today) {
        return { data: currentData, updated: false };
      }

      let newStreakCount: number;

      if (lastDate === yesterday || streakCount === 0) {
        newStreakCount = streakCount + 1;
      } else {
        newStreakCount = 1;
      }

      // ✅ Ensure highestStreak is a number before Math.max
      const currentHighest = highestStreak ?? 0;
      const newHighestStreak = Math.max(newStreakCount, currentHighest);

      const newData: StreakData = {
        lastDate: today,
        streakCount: newStreakCount,
        highestStreak: newHighestStreak,
      };

      console.log("new:", newData);

      await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(newData));
      return { data: newData, updated: true };
    } catch (error) {
      console.error('Error updating streak:', error);
      return {
        data: { lastDate: '', streakCount: 0, highestStreak: 0 },
        updated: false,
      };
    }
  },

  async resetStreak(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STREAK_KEY);
    } catch (error) {
      console.error('Error resetting streak:', error);
    }
  },
};