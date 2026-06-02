import { create } from 'zustand';

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

export const useAppStore = create((set) => ({
  appState: APP_STATES.WELCOME,
  toast: null,
  toastTimeout: null,
  logs: [
    { id: 1, time: new Date().toISOString(), action: 'SYSTEM_START', details: 'Turla sistemi başlatıldı.', type: 'info' }
  ],
  setAppState: (state) => set({ appState: state }),
  navigateTo: (state) => set({ appState: state }),
  showToast: (message, type = 'info') => set((state) => {
    if (state.toastTimeout) clearTimeout(state.toastTimeout);
    const id = setTimeout(() => set({ toast: null, toastTimeout: null }), 3000);
    return { toast: { message, type }, toastTimeout: id };
  }),
  addLog: (action, details, type = 'info') => set((state) => ({
    logs: [
      { id: Date.now(), time: new Date().toISOString(), action, details, type },
      ...state.logs
    ].slice(0, 100)
  })),
  sendTelemetryCommand: (vehicleId, command, payload = {}) => {
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

      setTimeout(() => {
        set((state) => ({
          logs: [
            { id: Date.now(), time: new Date().toISOString(), action: 'IOT_CMD', details: `Araç #${vehicleId}: ${msg}`, type: 'success' },
            ...state.logs
          ].slice(0, 100)
        }));
        resolve({ status: 'SUCCESS', vehicleId, command, timestamp: new Date().toISOString() });
      }, 1500);
    });
  }
}));
