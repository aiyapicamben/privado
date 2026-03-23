import { useState, useEffect } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import StatusBar from '../components/StatusBar';

const STEPS = {
  APPROACHING: 'approaching',
  DAMAGE_CHECK: 'damage_check',
  QR_SCAN: 'qr_scan',
  UNLOCKED: 'unlocked',
};

export default function PreDrive() {
  const { navigateTo, selectedVehicle, showToast, startDrive } = useApp();
  const [step, setStep] = useState(STEPS.APPROACHING);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Auto-transition from approaching
  useEffect(() => {
    if (step === STEPS.APPROACHING) {
      const timer = setTimeout(() => {
        setStep(STEPS.DAMAGE_CHECK);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleNoDamage = () => {
    showToast('Hasar kontrolü tamamlandı ✅', 'success');
    setStep(STEPS.QR_SCAN);
  };

  const [showDamageForm, setShowDamageForm] = useState(false);
  const [damagePhotoTaken, setDamagePhotoTaken] = useState(false);
  const [damageNote, setDamageNote] = useState('');

  const handleReportDamage = () => {
    setShowDamageForm(true);
  };

  const handleSubmitDamage = () => {
    showToast('Hasar raporu gönderildi. Destek ekibi bilgilendirildi. 📋', 'success');
    setShowDamageForm(false);
    setStep(STEPS.QR_SCAN);
  };

  const handleScanQR = () => {
    setIsScanning(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setStep(STEPS.UNLOCKED);
        showToast('Kapılar açıldı! 🔓', 'success');
      }
    }, 100);
  };

  const handleStartDrive = () => {
    startDrive();
  };

  // APPROACHING step
  if (step === STEPS.APPROACHING) {
    return (
      <div className="screen" style={{
        background: 'var(--gradient-dark)',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 'var(--space-lg)',
      }}>
        <StatusBar />
        <div className="animate-fadeInUp" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-lg)',
        }}>
          <div style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '64px',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              inset: '-8px',
              borderRadius: '50%',
              border: '3px solid transparent',
              borderTopColor: 'var(--togg-teal)',
              animation: 'spin 1.5s linear infinite',
            }} />
            🚘
          </div>
          <div>
            <h2 style={{
              fontSize: 'var(--font-xl)',
              fontWeight: 700,
              marginBottom: 'var(--space-sm)',
            }}>
              Araca Yaklaşıyorsunuz
            </h2>
            <p style={{
              color: 'var(--togg-gray-400)',
              fontSize: 'var(--font-base)',
            }}>
              {selectedVehicle?.plate || '34 TG 1001'}
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: 'var(--space-md)',
              color: 'var(--togg-teal)',
              fontSize: 'var(--font-sm)',
              fontWeight: 600,
            }}>
              <div className="animate-pulse" style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--togg-teal)',
              }} />
              Konum doğrulanıyor...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DAMAGE CHECK step
  if (step === STEPS.DAMAGE_CHECK) {
    return (
      <div className="screen" style={{ background: 'var(--gradient-dark)' }}>
        <StatusBar />
        <div style={{ padding: 'var(--space-lg)' }}>
          <button
            onClick={() => navigateTo(APP_STATES.MAP)}
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
          display: 'flex',
          flexDirection: 'column',
          padding: '0 var(--space-lg)',
        }}>
          <div className="animate-fadeInUp">
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '28px',
              background: 'rgba(255, 165, 2, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              marginBottom: 'var(--space-lg)',
            }}>
              🔍
            </div>

            <h1 style={{
              fontSize: 'var(--font-2xl)',
              fontWeight: 800,
              marginBottom: 'var(--space-sm)',
            }}>
              Hasar Kontrolü
            </h1>
            <p style={{
              color: 'var(--togg-gray-400)',
              fontSize: 'var(--font-base)',
              marginBottom: 'var(--space-2xl)',
              lineHeight: 1.6,
            }}>
              Araçta daha önce mevcut olmayan yeni bir hasar görüyor musunuz?
            </p>

            {/* Vehicle preview card */}
            <div className="glass-card" style={{
              padding: 'var(--space-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
              marginBottom: 'var(--space-2xl)',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--togg-navy-mid)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
              }}>
                🚘
              </div>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 'var(--font-lg)' }}>
                  {selectedVehicle?.model || 'TOGG T10X'}
                </h3>
                <p style={{ color: 'var(--togg-gray-400)', fontSize: 'var(--font-sm)' }}>
                  {selectedVehicle?.plate || '34 TG 1001'} • {selectedVehicle?.color || 'Anadolu Mavisi'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{
          padding: '0 var(--space-lg) var(--space-2xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
        }}>
          {!showDamageForm ? (
            <>
              <button
                className="btn btn-primary btn-lg btn-full"
                onClick={handleNoDamage}
              >
                ✅ Her Şey Yolunda
              </button>
              <button
                className="btn btn-secondary btn-full"
                onClick={handleReportDamage}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                📷 Hasar Bildir
              </button>
            </>
          ) : (
            <div className="animate-fadeInUp" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-md)',
            }}>
              {/* Photo area */}
              <button
                onClick={() => setDamagePhotoTaken(true)}
                style={{
                  width: '100%',
                  height: '140px',
                  borderRadius: 'var(--radius-lg)',
                  border: `2px dashed ${damagePhotoTaken ? 'var(--togg-green)' : 'var(--glass-border)'}`,
                  background: damagePhotoTaken ? 'rgba(46,213,115,0.08)' : 'var(--glass-bg)',
                  color: damagePhotoTaken ? 'var(--togg-green)' : 'var(--togg-gray-400)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: 'var(--font-sm)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                }}
              >
                {damagePhotoTaken ? (
                  <>
                    <span style={{ fontSize: '28px' }}>✅</span>
                    <span>Fotoğraf çekildi</span>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: '28px' }}>📸</span>
                    <span>Hasarın fotoğrafını çekin</span>
                  </>
                )}
              </button>

              {/* Note */}
              <textarea
                value={damageNote}
                onChange={(e) => setDamageNote(e.target.value)}
                placeholder="Hasarı açıklayın (isteğe bağlı)..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--togg-navy-mid)',
                  border: '2px solid transparent',
                  color: 'var(--togg-white)',
                  fontSize: 'var(--font-sm)',
                  fontFamily: 'var(--font-family)',
                  resize: 'none',
                  outline: 'none',
                  transition: 'border-color var(--transition-fast)',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--togg-teal)'}
                onBlur={(e) => e.target.style.borderColor = 'transparent'}
              />

              {/* Buttons */}
              <button
                className="btn btn-primary btn-full"
                onClick={handleSubmitDamage}
                disabled={!damagePhotoTaken}
                style={{
                  opacity: damagePhotoTaken ? 1 : 0.5,
                  cursor: damagePhotoTaken ? 'pointer' : 'not-allowed',
                }}
              >
                📋 Hasar Raporunu Gönder
              </button>
              <button
                className="btn btn-secondary btn-full"
                onClick={() => setShowDamageForm(false)}
                style={{ fontSize: 'var(--font-sm)' }}
              >
                ← Geri Dön
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // QR SCAN step
  if (step === STEPS.QR_SCAN) {
    return (
      <div className="screen" style={{
        background: 'var(--gradient-dark)',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 'var(--space-lg)',
      }}>
        <StatusBar />
        
        <div className="animate-fadeInUp" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-xl)',
        }}>
          <h1 style={{
            fontSize: 'var(--font-2xl)',
            fontWeight: 800,
          }}>
            QR Kodu Okutun
          </h1>
          <p style={{
            color: 'var(--togg-gray-400)',
            fontSize: 'var(--font-base)',
            maxWidth: '280px',
            lineHeight: 1.6,
          }}>
            Kapı kolunun yanındaki QR kodu okutarak kilidi açın
          </p>

          {/* QR Scanner area */}
          <button
            onClick={handleScanQR}
            disabled={isScanning}
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '24px',
              background: isScanning ? 'rgba(0,212,170,0.1)' : 'var(--glass-bg)',
              border: `3px solid ${isScanning ? 'var(--togg-teal)' : 'var(--glass-border)'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-md)',
              cursor: isScanning ? 'default' : 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all var(--transition-base)',
              color: 'var(--togg-white)',
            }}
          >
            {isScanning && (
              <>
                <div style={{
                  position: 'absolute',
                  inset: '-4px',
                  borderRadius: '28px',
                  border: '3px solid transparent',
                  borderTopColor: 'var(--togg-teal)',
                  animation: 'spin 1s linear infinite',
                }} />
                {/* Scan line */}
                <div style={{
                  position: 'absolute',
                  left: '10%',
                  right: '10%',
                  height: '2px',
                  background: 'var(--togg-teal)',
                  boxShadow: '0 0 10px var(--togg-teal)',
                  top: `${scanProgress}%`,
                  transition: 'top 100ms linear',
                }} />
              </>
            )}
            
            <span style={{ fontSize: '56px', zIndex: 1 }}>
              {isScanning ? '📡' : '📱'}
            </span>
            <span style={{
              fontSize: 'var(--font-sm)',
              fontWeight: 600,
              color: isScanning ? 'var(--togg-teal)' : 'var(--togg-gray-300)',
              zIndex: 1,
            }}>
              {isScanning ? `Taranıyor... ${scanProgress}%` : 'Dokunarak Tara'}
            </span>
          </button>

          {/* Instructions */}
          <div className="glass-card" style={{
            padding: 'var(--space-md)',
            maxWidth: '300px',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
          }}>
            <span style={{ fontSize: '20px' }}>💡</span>
            <p style={{
              fontSize: 'var(--font-xs)',
              color: 'var(--togg-gray-400)',
              lineHeight: 1.5,
            }}>
              QR kod genellikle sürücü tarafı kapı kolunun hemen yanında bulunur
            </p>
          </div>
        </div>
      </div>
    );
  }

  // UNLOCKED step
  return (
    <div className="screen" style={{
      background: 'var(--gradient-dark)',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: 'var(--space-lg)',
    }}>
      <StatusBar />
      
      <div className="animate-fadeInUp" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-xl)',
      }}>
        {/* Success animation */}
        <div style={{
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          background: 'rgba(0, 212, 170, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '64px',
          animation: 'pulseGlow 2s ease-in-out infinite',
        }}>
          🔓
        </div>

        <div>
          <h1 style={{
            fontSize: 'var(--font-2xl)',
            fontWeight: 800,
            color: 'var(--togg-green)',
            marginBottom: 'var(--space-sm)',
          }}>
            Kapılar Açıldı!
          </h1>
          <p style={{
            color: 'var(--togg-gray-300)',
            fontSize: 'var(--font-base)',
            maxWidth: '280px',
            lineHeight: 1.6,
          }}>
            Arabanın içindeki <strong style={{ color: 'var(--togg-white)' }}>Start/Stop</strong> tuşuna basarak motoru çalıştırın
          </p>
        </div>

        {/* Steps list */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
          width: '100%',
          maxWidth: '320px',
        }}>
          {[
            { num: 1, text: 'Araca binin', done: true },
            { num: 2, text: 'Emniyet kemerinizi takın', done: false },
            { num: 3, text: 'Start/Stop tuşuna basın', done: false },
          ].map((s) => (
            <div
              key={s.num}
              className="glass-card"
              style={{
                padding: 'var(--space-md)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: s.done ? 'var(--togg-teal)' : 'var(--togg-navy-mid)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--font-sm)',
                fontWeight: 700,
                color: s.done ? 'var(--togg-navy)' : 'var(--togg-gray-400)',
                flexShrink: 0,
              }}>
                {s.done ? '✓' : s.num}
              </div>
              <span style={{
                fontSize: 'var(--font-sm)',
                fontWeight: 500,
                color: s.done ? 'var(--togg-gray-300)' : 'var(--togg-white)',
              }}>
                {s.text}
              </span>
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary btn-lg btn-full"
          onClick={handleStartDrive}
          style={{
            maxWidth: '320px',
            animation: 'pulseGlow 2s ease-in-out infinite',
          }}
        >
          🚀 Sürüşe Başla
        </button>
      </div>
    </div>
  );
}
