import { create } from 'zustand';

interface useScreenId_interface {

    // Screen ID
    screenId: string | null;
    setScreenId: (state: string | null) => void;

    // LoadingState for 'Sync Screen' button
    loadingState: boolean;
    setLoadingState: (state: boolean) => void;

    // Run the 'get screen' function when Screen ID is entered 
    runGetScreenFunction: boolean;
    setRunGetScreenFunction: (state: boolean) => void;

     // isAutoUpdate Selection
     isAutoUpdate: boolean;
     setIsAutoUpdate: (state: boolean) => void;
}

export const useScreenId = create<useScreenId_interface>((set) => ({
    screenId: null,
    setScreenId: (state) => set({ screenId: state }),

    loadingState: false,
    setLoadingState: (state => set({ loadingState: state })),

    runGetScreenFunction: false,
    setRunGetScreenFunction: (state => set({ runGetScreenFunction: state })),

    isAutoUpdate: true,
    setIsAutoUpdate: (state => set({ isAutoUpdate: state })),
}));

export default useScreenId;