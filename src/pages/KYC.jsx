import { useState, useEffect } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import StatusBar from '../components/StatusBar';

const DOC_STEPS = [
  { key: 'id_front', icon: '🪪', title: 'Kimlik Ön Yüzü', desc: 'TC kimlik kartı ön yüzü' },
  { key: 'id_back', icon: '🔁', title: 'Kimlik Arka Yüzü', desc: 'TC kimlik kartı arka yüzü' },
  { key: 'license', icon: '🚗', title: 'Ehliyet', desc: 'Sürücü belgeniz' },
];

export default function KYC() {
  const { navigateTo, setUser, showToast } = useApp();
  const [uploads, setUploads] = useState({});
  const [isPending, setIsPending] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [approvalProgress, setApprovalProgress] = useState(0);

  const handleUpload = (key) => {
    setUploads(prev => ({ ...prev, [key]: true }));
    showToast('Belge yüklendi ✅', 'success');
  };

  const allUploaded = DOC_STEPS.every(s => uploads[s.key]);
  const uploadedCount = Object.keys(uploads).length;

  const handleSubmit = () => {
    setIsPending(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsApproved(true);
          setUser(prev => ({ ...prev, kycStatus: 'approved' }));
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
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '24px', textAlign: 'center', gap: '24px',
        }}>
          {!isApproved ? (
            <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              {/* Spinner */}
              <div style={{
                width: '100px', height: '100px', borderRadius: '50%',
                background: 'rgba(0,212,170,0.08)',
                border: '1px solid rgba(0,212,170,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', inset: '-3px', borderRadius: '50%',
                  border: '3px solid transparent',
                  borderTopColor: '#00d4aa',
                  animation: 'spin 0.9s linear infinite',
                }} />
                <span style={{ fontSize: '42px' }}>📋</span>
              </div>

              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
                  Belgeler Kontrol Ediliyor
                </h2>
                <p style={{ color: 'var(--togg-gray-400)', fontSize: '14px', lineHeight: 1.6 }}>
                  Yapay zeka ile analiz ediliyor...
                </p>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', maxWidth: '260px' }}>
                <div style={{
                  height: '6px', borderRadius: '99px',
                  background: 'rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${approvalProgress}%`,
                    background: 'linear-gradient(90deg, #00d4aa, #4facfe)',
                    borderRadius: '99px',
                    transition: 'width 300ms ease',
                  }} />
                </div>
                <p style={{ color: '#00d4aa', fontSize: '12px', fontWeight: 700, marginTop: '8px' }}>
                  %{Math.round(approvalProgress)}
                </p>
              </div>
            </div>
          ) : (
            <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '100px', height: '100px', borderRadius: '50%',
                background: 'rgba(46,213,115,0.12)',
                border: '1px solid rgba(46,213,115,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '48px',
              }}>
                ✅
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#2ed573' }}>Onaylandı!</h2>
              <p style={{ color: 'var(--togg-gray-400)', fontSize: '14px' }}>
                Haritaya yönlendiriliyorsunuz...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="screen" style={{ background: 'var(--gradient-dark)', position: 'relative' }}>
      <div style={{
        position: 'absolute', top: '-5%', left: '-20%',
        width: '280px', height: '280px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,172,254,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <StatusBar />

      {/* Header row */}
      <div style={{ padding: '4px 20px 8px' }}>
        <button
          onClick={() => navigateTo(APP_STATES.REGISTER)}
          style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px', width: '40px', height: '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '18px', cursor: 'pointer',
          }}
        >
          ←
        </button>
      </div>

      <div style={{ flex: 1, padding: '8px 24px', display: 'flex', flexDirection: 'column' }}>
        <div className="animate-fadeInUp">
          {/* Title block */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'rgba(79,172,254,0.1)', border: '1px solid rgba(79,172,254,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '26px', marginBottom: '20px',
            }}>
              🛡️
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '6px', letterSpacing: '-0.5px' }}>
              Belge Doğrulama
            </h1>
            <p style={{ color: 'var(--togg-gray-400)', fontSize: '14px', lineHeight: 1.6 }}>
              Güvenli sürüş için kimlik ve ehliyet belgelerinizi yükleyin
            </p>
          </div>

          {/* Progress indicator */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px',
          }}>
            <div style={{
              flex: 1, height: '5px', borderRadius: '99px',
              background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${(uploadedCount / DOC_STEPS.length) * 100}%`,
                background: 'linear-gradient(90deg, #00d4aa, #4facfe)',
                borderRadius: '99px', transition: 'width 400ms ease',
              }} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#00d4aa', minWidth: '32px' }}>
              {uploadedCount}/{DOC_STEPS.length}
            </span>
          </div>

          {/* Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {DOC_STEPS.map((step, i) => {
              const done = uploads[step.key];
              return (
                <div
                  key={step.key}
                  className="animate-fadeInUp"
                  onClick={() => !done && handleUpload(step.key)}
                  style={{
                    padding: '16px',
                    display: 'flex', alignItems: 'center', gap: '14px',
                    cursor: done ? 'default' : 'pointer',
                    animationDelay: `${i * 80}ms`,
                    animationFillMode: 'backwards',
                    background: done ? 'rgba(46,213,115,0.06)' : 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${done ? 'rgba(46,213,115,0.25)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '16px',
                    transition: 'all 200ms ease',
                  }}
                >
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: done ? 'rgba(46,213,115,0.12)' : 'rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', flexShrink: 0,
                    transition: 'background 200ms ease',
                  }}>
                    {done ? '✅' : step.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '15px', fontWeight: 700,
                      color: done ? '#2ed573' : '#fff', marginBottom: '2px',
                    }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--togg-gray-400)' }}>
                      {done ? 'Yüklendi' : step.desc}
                    </p>
                  </div>
                  {!done && (
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
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

      <div style={{ padding: '16px 24px 40px' }}>
        <button
          className="btn btn-primary btn-full"
          onClick={handleSubmit}
          style={{
            padding: '18px', fontSize: '16px', fontWeight: 800, borderRadius: '16px',
            opacity: allUploaded ? 1 : 0.35,
            pointerEvents: allUploaded ? 'auto' : 'none',
            transition: 'opacity 200ms ease',
          }}
        >
          Belgeleri Gönder →
        </button>
      </div>
    </div>
  );
}
