import { useState, useRef, useEffect } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import StatusBar from '../components/StatusBar';

export default function Register() {
  const { navigateTo, setUser, showToast, user } = useApp();
  const [phone, setPhone] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const otpRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!showOtp) return;
    setTimer(60);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [showOtp]);

  const handlePhoneSubmit = () => {
    if (phone.length < 10) {
      showToast('Geçerli bir telefon numarası girin', 'error');
      return;
    }
    setShowOtp(true);
    showToast('Doğrulama kodu gönderildi 📱', 'success');
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
        showToast('Telefon doğrulandı ✅', 'success');
        setTimeout(() => {
          if (user.kycStatus === 'approved') {
            navigateTo(APP_STATES.MAP);
          } else {
            navigateTo(APP_STATES.KYC);
          }
        }, 500);
      }, 1500);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const formatPhone = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  };

  return (
    <div className="screen" style={{ background: 'var(--gradient-dark)', position: 'relative' }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-20%',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,170,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <StatusBar />

      {/* Back button */}
      <div style={{ padding: '4px 20px 8px' }}>
        <button
          onClick={() => showOtp ? setShowOtp(false) : navigateTo(APP_STATES.WELCOME)}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px', width: '40px', height: '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '18px', cursor: 'pointer',
          }}
        >
          ←
        </button>
      </div>

      <div style={{ flex: 1, padding: '8px 24px', display: 'flex', flexDirection: 'column' }}>
        {!showOtp ? (
          <div className="animate-fadeInUp">
            {/* Title */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '26px', marginBottom: '20px',
              }}>
                📱
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.5px' }}>
                Telefon Numaranız
              </h1>
              <p style={{ color: 'var(--togg-gray-400)', fontSize: '15px', lineHeight: 1.6 }}>
                Size bir doğrulama kodu göndereceğiz
              </p>
            </div>

            {/* Phone input */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px',
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1.5px solid rgba(255,255,255,0.1)',
                borderRadius: '14px', padding: '16px 14px',
                display: 'flex', alignItems: 'center', gap: '8px',
                fontSize: '15px', fontWeight: 600, color: 'var(--togg-gray-300)',
                minWidth: '86px', flexShrink: 0,
              }}>
                🇹🇷 +90
              </div>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={formatPhone(phone)}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="5XX XXX XX XX"
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1.5px solid rgba(255,255,255,0.1)',
                  borderRadius: '14px', padding: '16px',
                  fontSize: '18px', fontWeight: 700, letterSpacing: '1.5px',
                  color: '#fff', outline: 'none', fontFamily: 'var(--font-family)',
                  transition: 'border-color 200ms ease',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(0,212,170,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                autoFocus
              />
            </div>

            {/* Security note */}
            <div style={{
              background: 'rgba(0,212,170,0.04)',
              border: '1px solid rgba(0,212,170,0.12)',
              borderRadius: '12px', padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: '10px',
              marginBottom: '24px',
            }}>
              <span style={{ fontSize: '15px', flexShrink: 0 }}>🔒</span>
              <p style={{ fontSize: '12px', color: 'var(--togg-gray-400)', lineHeight: 1.5 }}>
                256-bit SSL ile şifrelenir. Numaranız paylaşılmaz.
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-fadeInUp">
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '26px', marginBottom: '20px',
              }}>
                ✉️
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.5px' }}>
                Doğrulama Kodu
              </h1>
              <p style={{ color: 'var(--togg-gray-400)', fontSize: '15px', lineHeight: 1.6 }}>
                <span style={{ color: '#fff', fontWeight: 700 }}>+90 {formatPhone(phone)}</span>
                {' '}numarasına gönderilen 6 haneli kodu girin
              </p>
            </div>

            {/* OTP boxes */}
            <div style={{
              display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '28px',
            }}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  autoFocus={i === 0}
                  disabled={isVerifying}
                  style={{
                    width: '46px', height: '58px',
                    borderRadius: '14px',
                    background: digit ? 'rgba(0,212,170,0.1)' : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${digit ? 'rgba(0,212,170,0.6)' : 'rgba(255,255,255,0.1)'}`,
                    color: digit ? '#00d4aa' : '#fff',
                    fontSize: '24px', fontWeight: 800, textAlign: 'center',
                    outline: 'none', fontFamily: 'var(--font-family)',
                    transition: 'all 150ms ease',
                  }}
                />
              ))}
            </div>

            {isVerifying && (
              <div className="animate-fadeIn" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '10px', marginBottom: '20px',
              }}>
                <div className="animate-spin" style={{
                  width: '18px', height: '18px',
                  border: '2px solid rgba(0,212,170,0.3)',
                  borderTopColor: '#00d4aa', borderRadius: '50%',
                }} />
                <span style={{ color: '#00d4aa', fontWeight: 600, fontSize: '14px' }}>
                  Doğrulanıyor...
                </span>
              </div>
            )}

            <div style={{ textAlign: 'center' }}>
              {timer > 0 ? (
                <p style={{ color: 'var(--togg-gray-500)', fontSize: '13px' }}>
                  Tekrar gönder {timer}s
                </p>
              ) : (
                <button
                  onClick={() => { setTimer(60); showToast('Yeni kod gönderildi 📱', 'info'); }}
                  style={{
                    background: 'none', color: '#00d4aa',
                    fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                  }}
                >
                  Yeni kod gönder →
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      {!showOtp && (
        <div style={{ padding: '0 24px 40px' }}>
          <button
            className="btn btn-primary btn-full"
            onClick={handlePhoneSubmit}
            style={{
              padding: '18px', fontSize: '16px', fontWeight: 800,
              borderRadius: '16px', letterSpacing: '0.3px',
              opacity: phone.length >= 10 ? 1 : 0.35,
              pointerEvents: phone.length >= 10 ? 'auto' : 'none',
              transition: 'opacity 200ms ease',
            }}
          >
            Devam Et →
          </button>
        </div>
      )}
    </div>
  );
}
