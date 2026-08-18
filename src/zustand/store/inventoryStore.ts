import { create } from "zustand";
import type { InventoryGroup } from "@/types/inventory";

interface InventoryState {
  jsonData: InventoryGroup[] | null;
  fileName: string;
  isBar: boolean;
  forceAllBtl: boolean;

  setJsonData: (data: InventoryGroup[] | null) => void;
  setFileName: (name: string) => void;
  setIsBar: (isBar: boolean) => void;
  setForceAllBtl: (forceAllBtl: boolean) => void;
  resetFile: () => void;
}

const useInventoryStore = create<InventoryState>((set) => ({
  jsonData: null,
  fileName: "",
  isBar: true,
  forceAllBtl: false,

  setJsonData: (data) => set({ jsonData: data }),

  setFileName: (name) => set({ fileName: name }),

  setIsBar: (isBar) => set({ isBar }),

  setForceAllBtl: (forceAllBtl) => set({ forceAllBtl }),

  resetFile: () =>
    set({
      jsonData: null,
      fileName: "",
    }),
}));

export default useInventoryStore;
