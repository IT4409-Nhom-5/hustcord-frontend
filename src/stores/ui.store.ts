import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  
  createChannelModalOpen: boolean;
  setCreateChannelModalOpen: (open: boolean) => void;
  
  userProfileModalOpen: boolean;
  setUserProfileModalOpen: (open: boolean) => void;
  
  activeVideoCallId: string | null;
  setActiveVideoCallId: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  createChannelModalOpen: false,
  setCreateChannelModalOpen: (open) => set({ createChannelModalOpen: open }),
  
  userProfileModalOpen: false,
  setUserProfileModalOpen: (open) => set({ userProfileModalOpen: open }),
  
  activeVideoCallId: null,
  setActiveVideoCallId: (id) => set({ activeVideoCallId: id }),
}));
