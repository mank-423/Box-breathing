import { create } from 'zustand';

type Store = {
  boxBreathingState: number;
  setBreathingState: (count: number) => void;
};

const useStore = create<Store>((set) => ({
  boxBreathingState: 1,
  setBreathingState: (count: number) => set({ boxBreathingState: count }),
}));

export default useStore;