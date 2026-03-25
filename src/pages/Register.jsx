import { useState, useRef, useEffect } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import StatusBar from '../components/StatusBar';

export default function Register() {
  const { navigateTo, setUser, showToast } = useApp();
  const [phone, setPhone] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const otpRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (showOtp && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev <= 1 ? (clearInterval(timerRef.current), 0) : prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [showOtp, timer]);

  const handlePhoneSubmit = () => {
    if (phone.length < 10) { showToast('Geçerli bir telefon numarası girin', 'error'); return; }
    setShowOtp(true);
    showToast('Doğrulama kodu gönderildi', 'success');
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (newOtp.every(d => d !== '')) {
      setIsVerifying(true);
      setTimeout(() => {
        setUser(prev => ({ ...prev, phone: `+90${phone}`, isVerified: true }));
        showToast('Telefon doğrulandı', 'success');
        setTimeout(() => navigateTo(APP_STATES.KYC), 500);
      }, 1500);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const formatPhone = (val) => {
    const d = val.replace(/\D/g, '').slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
    return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
  };

  return (
    <div className="screen" style={{ background: 'var(--togg-navy)' }}>
      <StatusBar />

      <div style={{ padding: '0 20px 20px' }}>
        <button
          onClick={() => showOtp ? setShowOtp(false) : navigateTo(APP_STATES.WELCOME)}
          style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px', width: '40px', height: '40px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', cursor: 'pointer',
          }}
        >←</button>
      </div>

      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column' }}>
        {!showOtp ? (
          <div className="animate-fadeInUp">
            {/* Branding hint */}
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px', overflow: 'hidden',
              marginBottom: '20px', border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}>
              <img src="/privado/images/togg-logo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>Telefon Numaranız</h1>
            <p style={{ color: 'var(--togg-gray-400)', fontSize: '14px', marginBottom: '28px', lineHeight: 1.6 }}>
              Size bir doğrulama kodu göndereceğiz
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: '14px',
                padding: '14px 14px', display: 'flex', alignItems: 'center', gap: '8px',
                fontSize: '16px', fontWeight: 600, color: 'var(--togg-gray-300)',
                minWidth: '88px', border: '1px solid rgba(255,255,255,0.06)',
              }}>
                🇹🇷 +90
              </div>
              <input
                type="tel"
                value={formatPhone(phone)}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="5XX XXX XXXX"
                autoFocus
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.04)',
                  border: '2px solid rgba(255,255,255,0.06)', borderRadius: '14px',
                  padding: '14px 16px', fontSize: '17px', letterSpacing: '2px',
                  fontWeight: 600, color: '#fff', fontFamily: 'var(--font-family)',
                }}
              />
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '14px',
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              border: '1px solid rgba(255,255,255,0.04)',
            }}>
              <span style={{ fontSize: '14px', lineHeight: 1 }}>🔒</span>
              <p style={{ fontSize: '11px', color: 'var(--togg-gray-400)', lineHeight: 1.5 }}>
                Bilgileriniz 256-bit SSL şifreleme ile korunmaktadır. Numaranız üçüncü taraflarla paylaşılmaz.
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-fadeInUp">
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>Doğrulama Kodu</h1>
            <p style={{ color: 'var(--togg-gray-400)', fontSize: '14px', marginBottom: '28px', lineHeight: 1.6 }}>
              <span style={{ color: '#fff', fontWeight: 600 }}>+90 {formatPhone(phone)}</span>
              {' '}numarasına gönderilen 6 haneli kodu girin
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px' }}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  type="text" inputMode="numeric" maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  autoFocus={i === 0}
                  disabled={isVerifying}
                  style={{
                    width: '46px', height: '54px', borderRadius: '14px',
                    background: 'rgba(255,255,255,0.04)',
                    border: `2px solid ${digit ? 'var(--togg-teal)' : 'rgba(255,255,255,0.06)'}`,
                    color: '#fff', fontSize: '24px', fontWeight: 700,
                    textAlign: 'center', transition: 'all 150ms ease', fontFamily: 'var(--font-family)',
                  }}
                />
              ))}
            </div>

            {isVerifying && (
              <div className="animate-fadeIn" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px',
              }}>
                <div className="animate-spin" style={{
                  width: '18px', height: '18px', border: '2px solid var(--togg-teal)',
                  borderTopColor: 'transparent', borderRadius: '50%',
                }} />
                <span style={{ color: 'var(--togg-teal)', fontWeight: 600, fontSize: '13px' }}>Doğrulanıyor...</span>
              </div>
            )}

            <div style={{ textAlign: 'center' }}>
              {timer > 0 ? (
                <p style={{ color: 'var(--togg-gray-400)', fontSize: '13px' }}>Yeni kod gönder ({timer}s)</p>
              ) : (
                <button onClick={() => { setTimer(60); showToast('Yeni kod gönderildi', 'info'); }}
                  style={{ background: 'none', color: 'var(--togg-teal)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                  Yeni kod gönder
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {!showOtp && (
        <div style={{ padding: '0 20px 40px' }}>
          <button className="btn btn-primary btn-lg btn-full" onClick={handlePhoneSubmit}
            style={{
              opacity: phone.length >= 10 ? 1 : 0.3, pointerEvents: phone.length >= 10 ? 'auto' : 'none',
              borderRadius: '16px', fontWeight: 800,
            }}>
            Devam Et
          </button>
        </div>
      )}
    </div>
  );
}
