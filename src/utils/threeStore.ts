import create from 'zustand';

interface StoreState {
    device: string;
    setDevice: (device: any) => void;
  }

const useStore = create<StoreState>(set => ({
    device: '',
    setDevice: (newDevice: string) => set({device: newDevice})
}))

export default useStore;