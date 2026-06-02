import { createContext, useContext, useEffect } from 'react';
import { useAppStore, APP_STATES } from '../store/useAppStore';
import { useUserStore } from '../store/useUserStore';
import { useVehicleStore } from '../store/useVehicleStore';
import { useRideStore } from '../store/useRideStore';

const AppContext = createContext(null);

export { APP_STATES };

export function AppProvider({ children }) {
  const appState = useAppStore((state) => state.appState);
  const setAppState = useAppStore((state) => state.setAppState);
  const navigateTo = useAppStore((state) => state.navigateTo);
  const toast = useAppStore((state) => state.toast);
  const showToast = useAppStore((state) => state.showToast);
  const logs = useAppStore((state) => state.logs);
  const addLog = useAppStore((state) => state.addLog);
  const sendTelemetryCommand = useAppStore((state) => state.sendTelemetryCommand);

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const balance = useUserStore((state) => state.user.balance);
  const addBalance = useUserStore((state) => state.addBalance);
  const processPayment = useUserStore((state) => state.processPayment);
  const tripHistory = useUserStore((state) => state.tripHistory);
  const saveTripToHistory = useUserStore((state) => state.saveTripToHistory);

  const selectedVehicle = useVehicleStore((state) => state.selectedVehicle);
  const setSelectedVehicle = useVehicleStore((state) => state.setSelectedVehicle);
  const preferredModel = useVehicleStore((state) => state.preferredModel);
  const setPreferredModel = useVehicleStore((state) => state.setPreferredModel);

  const driveState = useRideStore((state) => state);
  const setDriveState = useRideStore((state) => state.setDriveState);
  const startDrive = useRideStore((state) => state.startDrive);
  const togglePause = useRideStore((state) => state.togglePause);
  const endDrive = useRideStore((state) => state.endDrive);
  const resetAll = useRideStore((state) => state.resetAll);

  const value = {
    appState,
    setAppState,
    user,
    setUser,
    preferredModel,
    setPreferredModel,
    selectedVehicle,
    setSelectedVehicle,
    driveState,
    setDriveState,
    toast,
    showToast,
    navigateTo,
    startDrive,
    togglePause,
    endDrive,
    resetAll,
    balance,
    addBalance,
    processPayment,
    tripHistory,
    saveTripToHistory,
    logs,
    addLog,
    sendTelemetryCommand,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
