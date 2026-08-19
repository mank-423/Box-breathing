import { create } from 'zustand';

type Store = {
  boxBreathingState: number;
  setBreathingState: (count: number) => void;
  sighBreathingState: number,
  setSighBreathingState: (count: number) => void;
};

const useStore = create<Store>((set) => ({
  boxBreathingState: 1,
  setBreathingState: (count: number) => set({ boxBreathingState: count }),
  sighBreathingState: 1,
  setSighBreathingState: (count: number) => set({ sighBreathingState: count }),
}));

export default useStore;