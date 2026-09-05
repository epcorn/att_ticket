import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (userData) => set({ user: userData }),
      logoutUser: () => set({ user: null }),
    }),
    {
      name: "att_user_storage", // Unique key in localStorage
    }
  ),
  
);