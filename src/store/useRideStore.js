import { create } from 'zustand';
import { useAppStore, APP_STATES } from './useAppStore';
import { useVehicleStore } from './useVehicleStore';

export const useRideStore = create((set) => ({
  isActive: false,
  isPaused: false,
  startTime: null,
  elapsedSeconds: 0,
  totalCostTL: 0,
  drivingSeconds: 0,
  waitingSeconds: 0,
  
  setDriveState: (stateUpdate) => set((state) => ({ ...state, ...stateUpdate })),
  
  startDrive: () => {
    set({
      isPaused: false,
      elapsedSeconds: 0,
      totalCostTL: 0,
      isActive: true,
      startTime: Date.now(),
    });
    const vehicle = useVehicleStore.getState().selectedVehicle;
    useAppStore.getState().setAppState(APP_STATES.ACTIVE_DRIVE);
    useAppStore.getState().addLog('DRIVE_START', `${vehicle?.plate || ''} plakalı ${vehicle?.model || 'araç'} ile sürüş başladı.`, 'success');
  },
  
  togglePause: () => {
    set((state) => {
      const isNowPaused = !state.isPaused;
      useAppStore.getState().addLog(
        isNowPaused ? 'DRIVE_PAUSED' : 'DRIVE_RESUMED', 
        isNowPaused ? 'Sürüş bekleme moduna alındı.' : 'Sürüşe devam ediliyor.', 
        'warning'
      );
      return { isPaused: isNowPaused };
    });
  },
  
  endDrive: () => {
    set({ isActive: false });
    useAppStore.getState().setAppState(APP_STATES.END_DRIVE);
    useAppStore.getState().addLog('DRIVE_END', 'Sürüş sonlandırıldı. Fatura özeti oluşturuluyor.', 'info');
  },
  
  resetAll: () => {
    set({
      isActive: false,
      isPaused: false,
      startTime: null,
      elapsedSeconds: 0,
      totalCostTL: 0,
      drivingSeconds: 0,
      waitingSeconds: 0,
    });
    useVehicleStore.getState().setSelectedVehicle(null);
    useAppStore.getState().setAppState(APP_STATES.MAP);
  }
}));
