import { create } from 'zustand';

type Store = {
  boxBreathingState: number;
  sighBreathingState: number;
  fourSevenEightState: number;
  setBoxBreathingState: (count: number) => void;
  setSighBreathingState: (count: number) => void;
  setFourSevenEightState: (count: number) => void;
};

const useStore = create<Store>((set) => ({
  boxBreathingState: 1,
  sighBreathingState: 1,
  fourSevenEightState: 1,
  setBoxBreathingState: (count: number) => set({ boxBreathingState: count }),
  setSighBreathingState: (count: number) => set({ sighBreathingState: count }),
  setFourSevenEightState: (count: number) => set({ fourSevenEightState: count }),
}));

export default useStore;