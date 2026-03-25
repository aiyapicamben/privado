import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export const APP_STATES = {
  WELCOME: 'WELCOME',
  REGISTER: 'REGISTER',
  OTP: 'OTP',
  KYC: 'KYC',
  KYC_PENDING: 'KYC_PENDING',
  GARAGE: 'GARAGE',
  MAP: 'MAP',
  VEHICLE_SELECTED: 'VEHICLE_SELECTED',
  RESERVED: 'RESERVED',
  PRE_DRIVE: 'PRE_DRIVE',
  DAMAGE_CHECK: 'DAMAGE_CHECK',
  QR_SCAN: 'QR_SCAN',
  UNLOCKED: 'UNLOCKED',
  ACTIVE_DRIVE: 'ACTIVE_DRIVE',
  WAITING_MODE: 'WAITING_MODE',
  END_DRIVE: 'END_DRIVE',
  TRIP_SUMMARY: 'TRIP_SUMMARY',
  WALLET: 'WALLET',
  SETTINGS: 'SETTINGS',
  INSURANCE: 'INSURANCE',
  ADMIN_LOGIN: 'ADMIN_LOGIN',
  ADMIN: 'ADMIN',
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
  const [state, setState] = useState({
    appState: APP_STATES.WELCOME,
    user: {
      phone: null,
      isVerified: false,
      kycStatus: 'pending', // pending, approved, rejected
      balance: 20.0, // Initial free balance
      cards: [{ id: 1, type: 'Mastercard', last4: '4321', isDefault: true }],
    },
    selectedVehicle: null,
    logs: [
      { id: 1, time: new Date().toISOString(), action: 'SYSTEM_START', details: 'Tur At sistemi başlatıldı.', type: 'info' }
    ],
  });
  const [driveState, setDriveState] = useState(initialDriveState);
  const [toast, setToast] = useState(null);
  const [toastTimeout, setToastTimeout] = useState(null);

  const sendTelemetryCommand = useCallback((vehicleId, command, payload = {}) => {
    return new Promise((resolve) => {
      const logMessages = {
        'START_AC': 'Klima açıldı',
        'STOP_AC': 'Klima kapatıldı',
        'LIGHTS_ON': 'Farlar yakıldı',
        'LIGHTS_OFF': 'Farlar söndürüldü',
        'OPEN_TRUNK': 'Bagaj açıldı',
        'CLOSE_TRUNK': 'Bagaj kapatıldı',
        'LOCK_DOORS': 'Kapılar kilitlendi',
        'UNLOCK_DOORS': 'Kapılar açıldı'
      };
      const msg = logMessages[command] || `${command} komutu tetiklendi`;

      // Simulate real IoT hardware latency (1.5s round trip)
      setTimeout(() => {
        addLog('IOT_CMD', `Araç #${vehicleId}: ${msg}`, 'success');
        resolve({ status: 'SUCCESS', vehicleId, command, timestamp: new Date().toISOString() });
      }, 1500);
    });
  }, []);



  // Wallet & Trip History
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

  const addLog = (action, details, type = 'info') => {
    setState((prev) => ({
      ...prev,
      logs: [
        { id: Date.now(), time: new Date().toISOString(), action, details, type },
        ...prev.logs
      ].slice(0, 100) // Keep last 100 logs
    }));
  };

  const navigateTo = (state) => {
    setState((prev) => ({ ...prev, appState: state }));
  };

  const setUser = (updater) => {
    setState((prev) => {
      const newUser = typeof updater === 'function' ? updater(prev.user) : updater;
      if (newUser.isVerified && !prev.user.isVerified) {
        // We can't call addLog here easily without risking stale state, but we'll log it directly via the setState
        return {
          ...prev,
          user: newUser,
          logs: [
            { id: Date.now(), time: new Date().toISOString(), action: 'USER_REGISTER', details: `${newUser.phone} numaralı kullanıcı kayıt oldu.`, type: 'success' },
            ...prev.logs
          ].slice(0, 100)
        };
      }
      return { ...prev, user: newUser };
    });
  };

  const addBalance = (amount) => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, balance: prev.user.balance + amount },
      logs: [
        { id: Date.now(), time: new Date().toISOString(), action: 'WALLET_TOPUP', details: `Kullanıcı cüzdanına ${amount} ₺ yüklendi.`, type: 'success' },
        ...prev.logs
      ].slice(0, 100)
    }));
  };

  const processPayment = (amount) => {
    const { balance } = state.user;
    let remaining = amount;
    let newBalance = balance;

    if (balance > 0) {
      if (balance >= amount) {
        newBalance -= amount;
        remaining = 0;
      } else {
        remaining -= balance;
        newBalance = 0;
      }
    }

    // The rest (remaining) is charged to the default card
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, balance: newBalance },
      logs: [
        { id: Date.now(), time: new Date().toISOString(), action: 'RIDE_PAYMENT', details: `Sürüş ödemesi: Toplam ${amount.toFixed(2)}₺. (Cüzdandan: ${(amount - remaining).toFixed(2)}₺, Karttan: ${remaining.toFixed(2)}₺)`, type: 'info' },
        ...prev.logs
      ].slice(0, 100)
    }));

    return { success: true, chargedToCard: remaining, chargedToBalance: amount - remaining };
  };

  const startDrive = useCallback(() => {
    setDriveState({
      isPaused: false,
      elapsedSeconds: 0,
      totalCostTL: 0,
      isActive: true,
      startTime: Date.now(),
    });
    setState(prev => ({
      ...prev,
      appState: APP_STATES.ACTIVE_DRIVE,
      logs: [
        { id: Date.now(), time: new Date().toISOString(), action: 'DRIVE_START', details: `${prev.selectedVehicle?.plate} plakalı ${prev.selectedVehicle?.model} aracıyla sürüş başladı.`, type: 'success' },
        ...prev.logs
      ].slice(0, 100)
    }));
  }, []);

  const togglePause = useCallback(() => {
    setDriveState(prev => {
      const isNowPaused = !prev.isPaused;
      setState(s => ({
        ...s,
        logs: [
          { id: Date.now(), time: new Date().toISOString(), action: isNowPaused ? 'DRIVE_PAUSED' : 'DRIVE_RESUMED', details: isNowPaused ? 'Sürüş bekleme moduna alındı.' : 'Sürüşe devam ediliyor.', type: 'warning' },
          ...s.logs
        ].slice(0, 100)
      }));
      return { ...prev, isPaused: isNowPaused };
    });
  }, []);

  const endDrive = useCallback(() => {
    setDriveState(prev => {
      setState(s => ({
        ...s,
        appState: APP_STATES.END_DRIVE,
        logs: [
          { id: Date.now(), time: new Date().toISOString(), action: 'DRIVE_END', details: 'Sürüş sonlandırıldı. Fatura özeti oluşturuluyor.', type: 'info' },
          ...s.logs
        ].slice(0, 100)
      }));
      return { ...prev, isActive: false };
    });
  }, []);

  // Save trip to history and deduct from balance
  const saveTripToHistory = useCallback((trip) => {
    setTripHistory(prev => [trip, ...prev]);
    // Balance deduction is now handled by processPayment
  }, []);

  const resetAll = useCallback(() => {
    navigateTo(APP_STATES.MAP);
    setState(prev => ({ ...prev, selectedVehicle: null }));
    setDriveState(initialDriveState);
  }, [navigateTo]);

  const value = {
    appState: state.appState,
    setAppState: navigateTo,
    user: state.user,
    setUser,
    preferredModel: state.preferredModel,
    setPreferredModel: (model) => setState(prev => ({ ...prev, preferredModel: model })),
    selectedVehicle: state.selectedVehicle,
    setSelectedVehicle: (vehicle) => setState(prev => ({ ...prev, selectedVehicle: vehicle })),
    driveState,
    setDriveState,
    toast,
    showToast,
    navigateTo,
    startDrive,
    togglePause,
    endDrive,
    resetAll,
    balance: state.user.balance, // Expose balance from user state
    addBalance,
    processPayment,
    tripHistory,
    saveTripToHistory,
    logs: state.logs,
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
