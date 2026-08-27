import { StreakData, streakService } from '@/services/streakService';
import { create } from 'zustand';

type Store = {
  boxBreathingState: number;
  sighBreathingState: number;
  fourSevenEightState: number;
  setBoxBreathingState: (count: number) => void;
  setSighBreathingState: (count: number) => void;
  setFourSevenEightState: (count: number) => void;
  streakData: StreakData;
  streakLoading: boolean;
  loadStreak: () => Promise<void>;
  updateStreak: () => Promise<{ data: StreakData; updated: boolean }>;
  resetStreak: () => Promise<void>;
};

const useStore = create<Store>((set) => ({
  boxBreathingState: 1,
  sighBreathingState: 1,
  fourSevenEightState: 1,
  streakData: { lastDate: '', streakCount: 0, highestStreak: 0 },
  streakLoading: true,
  setBoxBreathingState: (count: number) => set({ boxBreathingState: count }),
  setSighBreathingState: (count: number) => set({ sighBreathingState: count }),
  setFourSevenEightState: (count: number) => set({ fourSevenEightState: count }),
  loadStreak: async () => {
    set({ streakLoading: true });
    const data = await streakService.getStreak();
    set({ streakData: data, streakLoading: false });
  },

  updateStreak: async () => {
    const result = await streakService.updateStreak();
    if (result.updated) {
      set({ streakData: result.data });
    }
    return result;
  },

  resetStreak: async () => {
    await streakService.resetStreak();
    set({ streakData: { lastDate: '', streakCount: 0, highestStreak: 0 } });
  },
}));

export default useStore;