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
    if (!showOtp) return;
    setTimer(60);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
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
    showToast('Doğrulama kodu gönderildi', 'success');
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(d => d !== '')) {
      setIsVerifying(true);
      setTimeout(() => {
        setUser(prev => ({ ...prev, phone: `+90${phone}`, isVerified: true }));
        showToast('Telefon doğrulandı ✓', 'success');
        setTimeout(() => navigateTo(APP_STATES.KYC), 500);
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
    <div className="screen" style={{ background: 'var(--gradient-dark)' }}>
      <StatusBar />
      
      {/* Header */}
      <div style={{ padding: 'var(--space-lg)' }}>
        <button
          onClick={() => showOtp ? setShowOtp(false) : navigateTo(APP_STATES.WELCOME)}
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--togg-white)',
            fontSize: '18px',
            backdropFilter: 'blur(10px)',
          }}
        >
          ←
        </button>
      </div>

      <div style={{
        flex: 1,
        padding: '0 var(--space-lg)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {!showOtp ? (
          /* Phone Input */
          <div className="animate-fadeInUp">
            <h1 style={{
              fontSize: 'var(--font-2xl)',
              fontWeight: 800,
              marginBottom: 'var(--space-sm)',
            }}>
              Telefon Numaranız
            </h1>
            <p style={{
              color: 'var(--togg-gray-400)',
              fontSize: 'var(--font-base)',
              marginBottom: 'var(--space-xl)',
              lineHeight: 1.6,
            }}>
              Size bir doğrulama kodu göndereceğiz
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
              marginBottom: 'var(--space-xl)',
            }}>
              {/* Country code */}
              <div style={{
                background: 'var(--togg-navy-mid)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: 'var(--font-lg)',
                fontWeight: 600,
                color: 'var(--togg-gray-300)',
                minWidth: '90px',
              }}>
                🇹🇷 +90
              </div>
              
              <input
                type="tel"
                className="input-field"
                value={formatPhone(phone)}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="5XX XXX XXXX"
                style={{
                  flex: 1,
                  fontSize: 'var(--font-lg)',
                  letterSpacing: '2px',
                  fontWeight: 600,
                }}
                autoFocus
              />
            </div>

            <div style={{
              background: 'var(--glass-bg)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-md)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-sm)',
              marginBottom: 'var(--space-xl)',
              border: '1px solid var(--glass-border)',
            }}>
              <span style={{ fontSize: '16px' }}>🔒</span>
              <p style={{
                fontSize: 'var(--font-xs)',
                color: 'var(--togg-gray-400)',
                lineHeight: 1.5,
              }}>
                Bilgileriniz 256-bit SSL şifreleme ile korunmaktadır. 
                Numaranız üçüncü taraflarla paylaşılmaz.
              </p>
            </div>
          </div>
        ) : (
          /* OTP Input */
          <div className="animate-fadeInUp">
            <h1 style={{
              fontSize: 'var(--font-2xl)',
              fontWeight: 800,
              marginBottom: 'var(--space-sm)',
            }}>
              Doğrulama Kodu
            </h1>
            <p style={{
              color: 'var(--togg-gray-400)',
              fontSize: 'var(--font-base)',
              marginBottom: 'var(--space-xl)',
              lineHeight: 1.6,
            }}>
              <span style={{ color: 'var(--togg-white)', fontWeight: 600 }}>
                +90 {formatPhone(phone)}
              </span>
              {' '}numarasına gönderilen 6 haneli kodu girin
            </p>

            {/* OTP boxes */}
            <div style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              marginBottom: 'var(--space-xl)',
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
                    width: '48px',
                    height: '56px',
                    borderRadius: 'var(--radius-md)',
                    background: digit ? 'var(--togg-navy-mid)' : 'var(--togg-navy-mid)',
                    border: `2px solid ${digit ? 'var(--togg-teal)' : 'transparent'}`,
                    color: 'var(--togg-white)',
                    fontSize: 'var(--font-2xl)',
                    fontWeight: 700,
                    textAlign: 'center',
                    transition: 'all var(--transition-fast)',
                  }}
                />
              ))}
            </div>

            {isVerifying && (
              <div className="animate-fadeIn" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-sm)',
                marginBottom: 'var(--space-lg)',
              }}>
                <div className="animate-spin" style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid var(--togg-teal)',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                }} />
                <span style={{ color: 'var(--togg-teal)', fontWeight: 600 }}>
                  Doğrulanıyor...
                </span>
              </div>
            )}

            {/* Timer */}
            <div style={{ textAlign: 'center' }}>
              {timer > 0 ? (
                <p style={{ color: 'var(--togg-gray-400)', fontSize: 'var(--font-sm)' }}>
                  Yeni kod gönder ({timer}s)
                </p>
              ) : (
                <button
                  onClick={() => { setTimer(60); showToast('Yeni kod gönderildi', 'info'); }}
                  style={{
                    background: 'none',
                    color: 'var(--togg-teal)',
                    fontWeight: 600,
                    fontSize: 'var(--font-sm)',
                  }}
                >
                  Yeni kod gönder
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      {!showOtp && (
        <div className="animate-fadeInUp" style={{
          padding: '0 var(--space-lg) var(--space-2xl)',
        }}>
          <button
            className="btn btn-primary btn-lg btn-full"
            onClick={handlePhoneSubmit}
            style={{
              opacity: phone.length >= 10 ? 1 : 0.4,
              pointerEvents: phone.length >= 10 ? 'auto' : 'none',
            }}
          >
            Devam Et
          </button>
        </div>
      )}
    </div>
  );
}
