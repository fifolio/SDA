import { create } from 'zustand';

interface useLoadingScreen_interface {
    loadingScreen: boolean;
    setLoadingScreen: (state: boolean) => void;
}

export const useLoadingScreen = create<useLoadingScreen_interface>((set) => ({
    loadingScreen: false,
    setLoadingScreen: (state) => set({ loadingScreen: state }),
}));

export default useLoadingScreen;