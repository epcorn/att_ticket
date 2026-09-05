import { create } from "zustand";

export const useMyStore = create((set) => ({
  status: false,
  id: "",
  setToggle: (id, status) => set({ id: id, status: status }),
}));
