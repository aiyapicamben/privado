import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export const APP_STATES = {
  WELCOME: 'welcome',
  REGISTER: 'register',
  OTP: 'otp',
  KYC: 'kyc',
  KYC_PENDING: 'kyc_pending',
  MAP: 'map',
  VEHICLE_SELECTED: 'vehicle_selected',
  RESERVED: 'reserved',
  PRE_DRIVE: 'pre_drive',
  DAMAGE_CHECK: 'damage_check',
  QR_SCAN: 'qr_scan',
  UNLOCKED: 'unlocked',
  ACTIVE_DRIVE: 'active_drive',
  WAITING_MODE: 'waiting_mode',
  END_DRIVE: 'end_drive',
  PHOTO_PROOF: 'photo_proof',
  TRIP_SUMMARY: 'trip_summary',
};

export function AppProvider({ children }) {
  const [appState, setAppState] = useState(APP_STATES.WELCOME);
  const [user, setUser] = useState({
    phone: '',
    isVerified: false,
    kycStatus: 'none', // none, pending, approved
  });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [driveState, setDriveState] = useState({
    isActive: false,
    isPaused: false,
    startTime: null,
    elapsedSeconds: 0,
    totalCostTL: 0,
    drivingSeconds: 0,
    waitingSeconds: 0,
  });
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const navigateTo = useCallback((state) => {
    setAppState(state);
  }, []);

  const startDrive = useCallback(() => {
    setDriveState({
      isActive: true,
      isPaused: false,
      startTime: Date.now(),
      elapsedSeconds: 0,
      totalCostTL: 0,
      drivingSeconds: 0,
      waitingSeconds: 0,
    });
    setAppState(APP_STATES.ACTIVE_DRIVE);
  }, []);

  const togglePause = useCallback(() => {
    setDriveState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const endDrive = useCallback(() => {
    setDriveState(prev => ({ ...prev, isActive: false }));
    setAppState(APP_STATES.END_DRIVE);
  }, []);

  const resetAll = useCallback(() => {
    setAppState(APP_STATES.MAP);
    setSelectedVehicle(null);
    setDriveState({
      isActive: false,
      isPaused: false,
      startTime: null,
      elapsedSeconds: 0,
      totalCostTL: 0,
      drivingSeconds: 0,
      waitingSeconds: 0,
    });
  }, []);

  const value = {
    appState,
    setAppState,
    user,
    setUser,
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
