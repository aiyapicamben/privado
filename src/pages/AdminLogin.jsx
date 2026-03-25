import { useState } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import StatusBar from '../components/StatusBar';

export default function AdminLogin() {
  const { navigateTo, showToast, addLog } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  const verifyPin = (currentPin) => {
    if (currentPin === '2023') { // Secret PIN
      addLog('ADMIN_LOGIN', 'Yönetici paneline başarılı giriş yapıldı.', 'success');
      setTimeout(() => navigateTo(APP_STATES.ADMIN), 300);
    } else {
      setError(true);
      showToast('Hatalı PIN Kodu!', 'error');
      addLog('ADMIN_FAILED_LOGIN', 'Yönetici paneline hatalı giriş denemesi.', 'error');
      setTimeout(() => setPin(''), 500);
    }
  };

  return (
    <div className="screen" style={{ background: '#0a0f1e', display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      
      <div style={{ padding: '20px', display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigateTo(APP_STATES.MAP)} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px', width: '40px', height: '40px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', cursor: 'pointer',
        }}>←</button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '24px' }}>
          🛡️
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Yönetici Girişi</h1>
        <p style={{ fontSize: '14px', color: 'var(--togg-gray-400)', marginBottom: '40px', textAlign: 'center' }}>
          Operasyon paneline erişmek için 4 haneli PIN kodunu girin.
        </p>

        {/* PIN Indicators */}
        <div className={error ? 'animate-shake' : ''} style={{ display: 'flex', gap: '16px', marginBottom: '60px' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: i < pin.length ? 'var(--togg-teal)' : 'rgba(255,255,255,0.1)',
              transition: 'all 200ms ease',
              border: error ? '1px solid #ff4757' : 'none'
            }} />
          ))}
        </div>

        {/* Custom Numpad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', width: '100%', maxWidth: '300px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button key={num} onClick={() => handleKeyPress(num.toString())} style={{
              aspectRatio: '1', borderRadius: '50%', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)', color: '#fff', fontSize: '24px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 100ms ease'
            }} onPointerDown={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onPointerUp={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
              {num}
            </button>
          ))}
          <div /> {/* Empty space */}
          <button onClick={() => handleKeyPress('0')} style={{
            aspectRatio: '1', borderRadius: '50%', background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)', color: '#fff', fontSize: '24px', fontWeight: 600,
            cursor: 'pointer', transition: 'all 100ms ease'
          }}>
            0
          </button>
          <button onClick={handleBackspace} style={{
            aspectRatio: '1', borderRadius: '50%', background: 'transparent',
            border: 'none', color: 'var(--togg-gray-400)', fontSize: '20px', cursor: 'pointer'
          }}>
            ⌫
          </button>
        </div>
      </div>
    </div>
  );
}
