import { create } from 'zustand';

export const useAdminStore = create((set) => ({
  isAuthenticated: false,
  jwt: null,
  socket: null,
  fleetData: [],
  telemetryData: {}, // { vehicleId: { speed, battery, lat, lng } }
  safeModeAlerts: [],
  
  setAuth: (status, token) => set({ isAuthenticated: status, jwt: token }),
  setSocket: (socketInstance) => set({ socket: socketInstance }),
  updateFleetData: (data) => set({ fleetData: data }),
  updateTelemetry: (vehicleId, data) => set((state) => ({
    telemetryData: {
      ...state.telemetryData,
      [vehicleId]: data
    }
  })),
  addSafeModeAlert: (alert) => set((state) => ({
    safeModeAlerts: [alert, ...state.safeModeAlerts]
  })),
  clearAlerts: () => set({ safeModeAlerts: [] }),
}));
