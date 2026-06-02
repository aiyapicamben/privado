import { create } from 'zustand';

export const useVehicleStore = create((set) => ({
  selectedVehicle: null,
  preferredModel: null,
  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
  setPreferredModel: (model) => set({ preferredModel: model }),
}));
