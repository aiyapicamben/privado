import { useState, useEffect } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import StatusBar from '../components/StatusBar';

const DOC_STEPS = [
  {
    key: 'id_front',
    icon: '🪪',
    title: 'Kimlik Ön Yüzü',
    desc: 'TC Kimlik kartınızın ön yüzünü yükleyin',
  },
  {
    key: 'id_back',
    icon: '🔄',
    title: 'Kimlik Arka Yüzü',
    desc: 'TC Kimlik kartınızın arka yüzünü yükleyin',
  },
  {
    key: 'license',
    icon: '🚗',
    title: 'Ehliyet',
    desc: 'Sürücü belgenizi yükleyin',
  },
];

export default function KYC() {
  const { navigateTo, setUser, showToast } = useApp();
  const [uploads, setUploads] = useState({});
  const [isPending, setIsPending] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [approvalProgress, setApprovalProgress] = useState(0);

  const handleUpload = (key) => {
    setUploads((prev) => ({ ...prev, [key]: true }));
    showToast('Belge yüklendi ✓', 'success');
  };

  const allUploaded = DOC_STEPS.every((s) => uploads[s.key]);

  const handleSubmit = () => {
    setIsPending(true);
    // Simulate approval process
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsApproved(true);
          setUser((prev) => ({ ...prev, kycStatus: 'approved' }));
          showToast('Belgeleriniz onaylandı! 🎉', 'success');
          setTimeout(() => navigateTo(APP_STATES.MAP), 1500);
        }, 500);
      }
      setApprovalProgress(Math.min(progress, 100));
    }, 400);
  };

  if (isPending) {
    return (
      <div className="screen" style={{ background: 'var(--gradient-dark)' }}>
        <StatusBar />
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-lg)',
          textAlign: 'center',
        }}>
          {!isApproved ? (
            <div className="animate-fadeIn">
              {/* Spinning loader */}
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-xl)',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  inset: '-4px',
                  borderRadius: '50%',
                  border: '3px solid transparent',
                  borderTopColor: 'var(--togg-teal)',
                  animation: 'spin 1.2s linear infinite',
                }} />
                <span style={{ fontSize: '48px' }}>📋</span>
              </div>

              <h2 style={{
                fontSize: 'var(--font-xl)',
                fontWeight: 700,
                marginBottom: 'var(--space-sm)',
              }}>
                Belgeler Kontrol Ediliyor
              </h2>
              <p style={{
                color: 'var(--togg-gray-400)',
                fontSize: 'var(--font-base)',
                marginBottom: 'var(--space-xl)',
                maxWidth: '280px',
                lineHeight: 1.6,
              }}>
                Belgeleriniz yapay zeka ile analiz ediliyor...
              </p>

              {/* Progress bar */}
              <div style={{
                width: '100%',
                maxWidth: '280px',
                margin: '0 auto',
              }}>
                <div className="progress-bar" style={{ height: '6px' }}>
                  <div className="progress-bar-fill" style={{
                    width: `${approvalProgress}%`,
                  }} />
                </div>
                <p style={{
                  color: 'var(--togg-teal)',
                  fontSize: 'var(--font-sm)',
                  fontWeight: 600,
                  marginTop: 'var(--space-sm)',
                }}>
                  %{Math.round(approvalProgress)}
                </p>
              </div>
            </div>
          ) : (
            <div className="animate-fadeInUp">
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'rgba(46, 213, 115, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-xl)',
                animation: 'pulse 1s ease-in-out',
              }}>
                <span style={{ fontSize: '56px' }}>✅</span>
              </div>
              <h2 style={{
                fontSize: 'var(--font-xl)',
                fontWeight: 700,
                color: 'var(--togg-green)',
                marginBottom: 'var(--space-sm)',
              }}>
                Onaylandı!
              </h2>
              <p style={{
                color: 'var(--togg-gray-300)',
                fontSize: 'var(--font-base)',
              }}>
                Haritaya yönlendiriliyorsunuz...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="screen" style={{ background: 'var(--gradient-dark)' }}>
      <StatusBar />
      
      {/* Header */}
      <div style={{ padding: 'var(--space-lg)' }}>
        <button
          onClick={() => navigateTo(APP_STATES.REGISTER)}
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
        <div className="animate-fadeInUp">
          <h1 style={{
            fontSize: 'var(--font-2xl)',
            fontWeight: 800,
            marginBottom: 'var(--space-sm)',
          }}>
            Belge Doğrulama
          </h1>
          <p style={{
            color: 'var(--togg-gray-400)',
            fontSize: 'var(--font-base)',
            marginBottom: 'var(--space-lg)',
            lineHeight: 1.6,
          }}>
            Güvenli sürüş için kimlik ve ehliyet belgelerinizi yükleyin
          </p>

          {/* Progress */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-xl)',
          }}>
            <div className="progress-bar" style={{ flex: 1 }}>
              <div className="progress-bar-fill" style={{
                width: `${(Object.keys(uploads).length / DOC_STEPS.length) * 100}%`,
              }} />
            </div>
            <span style={{
              fontSize: 'var(--font-sm)',
              color: 'var(--togg-teal)',
              fontWeight: 600,
            }}>
              {Object.keys(uploads).length}/{DOC_STEPS.length}
            </span>
          </div>

          {/* Document Upload Cards */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)',
          }}>
            {DOC_STEPS.map((step, i) => {
              const isUploaded = uploads[step.key];
              return (
                <div
                  key={step.key}
                  className="animate-fadeInUp glass-card"
                  style={{
                    padding: 'var(--space-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-md)',
                    cursor: isUploaded ? 'default' : 'pointer',
                    animationDelay: `${i * 100}ms`,
                    animationFillMode: 'both',
                    border: isUploaded ? '1px solid rgba(46,213,115,0.3)' : '1px solid var(--glass-border)',
                    transition: 'all var(--transition-base)',
                  }}
                  onClick={() => !isUploaded && handleUpload(step.key)}
                >
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: 'var(--radius-md)',
                    background: isUploaded ? 'rgba(46,213,115,0.15)' : 'var(--togg-navy-mid)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    flexShrink: 0,
                  }}>
                    {isUploaded ? '✅' : step.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: 'var(--font-base)',
                      fontWeight: 600,
                      color: isUploaded ? 'var(--togg-green)' : 'var(--togg-white)',
                      marginBottom: '2px',
                    }}>
                      {step.title}
                    </h3>
                    <p style={{
                      fontSize: 'var(--font-xs)',
                      color: 'var(--togg-gray-400)',
                    }}>
                      {isUploaded ? 'Yüklendi' : step.desc}
                    </p>
                  </div>
                  {!isUploaded && (
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--togg-navy-mid)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                    }}>
                      📷
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div style={{ padding: 'var(--space-lg) var(--space-lg) var(--space-2xl)' }}>
        <button
          className="btn btn-primary btn-lg btn-full"
          onClick={handleSubmit}
          style={{
            opacity: allUploaded ? 1 : 0.4,
            pointerEvents: allUploaded ? 'auto' : 'none',
          }}
        >
          Belgeleri Gönder
        </button>
      </div>
    </div>
  );
}
