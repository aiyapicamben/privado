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
  WALLET: 'wallet',
};

const initialDriveState = {
  isActive: false,
  isPaused: false,
  startTime: null,
  elapsedSeconds: 0,
  totalCostTL: 0,
  drivingSeconds: 0,
  waitingSeconds: 0,
};

export function AppProvider({ children }) {
  const [appState, setAppState] = useState(APP_STATES.WELCOME);
  const [user, setUser] = useState({
    phone: '',
    isVerified: false,
    kycStatus: 'none',
  });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [driveState, setDriveState] = useState(initialDriveState);
  const [toast, setToast] = useState(null);
  const [toastTimeout, setToastTimeout] = useState(null);

  // Wallet & Trip History
  const [balance, setBalance] = useState(500.00);
  const [tripHistory, setTripHistory] = useState([
    {
      id: 1,
      date: '2026-03-22',
      model: 'TOGG T10X',
      plate: '34 TG 1003',
      durationMin: 28,
      cost: 210.50,
    },
    {
      id: 2,
      date: '2026-03-20',
      model: 'TOGG T10X',
      plate: '34 TG 1001',
      durationMin: 15,
      cost: 112.00,
    },
    {
      id: 3,
      date: '2026-03-18',
      model: 'TOGG T10F',
      plate: '06 TG 2001',
      durationMin: 42,
      cost: 340.00,
    },
  ]);

  const showToast = useCallback((message, type = 'info') => {
    setToastTimeout(prev => {
      if (prev) clearTimeout(prev);
      return null;
    });
    setToast({ message, type });
    const id = setTimeout(() => setToast(null), 3000);
    setToastTimeout(id);
  }, []);

  const navigateTo = useCallback((state) => {
    setAppState(state);
  }, []);

  const startDrive = useCallback(() => {
    setDriveState({
      ...initialDriveState,
      isActive: true,
      startTime: Date.now(),
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

  // Save trip to history and deduct from balance
  const saveTripToHistory = useCallback((trip) => {
    setTripHistory(prev => [trip, ...prev]);
    setBalance(prev => Math.max(0, prev - trip.cost));
  }, []);

  const resetAll = useCallback(() => {
    setAppState(APP_STATES.MAP);
    setSelectedVehicle(null);
    setDriveState(initialDriveState);
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
    balance,
    setBalance,
    tripHistory,
    saveTripToHistory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
