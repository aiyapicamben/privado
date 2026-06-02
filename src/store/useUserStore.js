import { create } from 'zustand';

export const useUserStore = create((set, get) => ({
  user: {
    name: 'Kullanıcı',
    email: '',
    phone: null,
    isVerified: false,
    kycStatus: 'pending', // pending, approved, rejected
    balance: 20.0, // Initial free balance
    cards: [{ id: 1, type: 'Mastercard', last4: '4321', isDefault: true }],
  },
  tripHistory: [
    { id: 1, date: '2026-03-22', model: 'TOGG T10X', plate: '34 TG 1003', durationMin: 28, cost: 210.50 },
    { id: 2, date: '2026-03-20', model: 'TOGG T10X', plate: '34 TG 1001', durationMin: 15, cost: 112.00 },
    { id: 3, date: '2026-03-18', model: 'TOGG T10F', plate: '06 TG 2001', durationMin: 42, cost: 340.00 },
  ],
  setUser: (updater) => set((state) => {
    const newUser = typeof updater === 'function' ? updater(state.user) : updater;
    return { user: newUser };
  }),
  addBalance: (amount) => set((state) => ({
    user: { ...state.user, balance: state.user.balance + amount }
  })),
  processPayment: (amount) => {
    const { user } = get();
    let remaining = amount;
    let newBalance = user.balance;

    if (user.balance > 0) {
      if (user.balance >= amount) {
        newBalance -= amount;
        remaining = 0;
      } else {
        remaining -= user.balance;
        newBalance = 0;
      }
    }
    
    set({ user: { ...user, balance: newBalance } });
    return { success: true, chargedToCard: remaining, chargedToBalance: amount - remaining };
  },
  saveTripToHistory: (trip) => set((state) => ({
    tripHistory: [trip, ...state.tripHistory]
  }))
}));
