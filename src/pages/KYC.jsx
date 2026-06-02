import { useState } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import StatusBar from '../components/StatusBar';
import AppleEmoji from '../components/AppleEmoji';

const DOC_STEPS = [
  { key: 'id_front', icon: '🪪', title: 'Kimlik Ön Yüzü', desc: 'TC Kimlik kartınızın ön yüzünü yükleyin' },
  { key: 'id_back', icon: '🔄', title: 'Kimlik Arka Yüzü', desc: 'TC Kimlik kartınızın arka yüzünü yükleyin' },
  { key: 'license', icon: '🚗', title: 'Ehliyet', desc: 'Sürücü belgenizi yükleyin' },
];

export default function KYC() {
  const { navigateTo, setUser, showToast } = useApp();
  const [uploads, setUploads] = useState({});
  const [isPending, setIsPending] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [approvalProgress, setApprovalProgress] = useState(0);

  const handleUpload = (key) => {
    setUploads(prev => ({ ...prev, [key]: true }));
    showToast('Belge başarıyla tarandı ve yüklendi.', 'success');
  };

  const handleQuickFill = () => {
    const allFilled = {};
    DOC_STEPS.forEach(s => {
      allFilled[s.key] = true;
    });
    setUploads(allFilled);
    showToast('CEO Sunum Modu: Tüm belgeler otomatik doğrulandı!', 'success');
  };

  const allUploaded = DOC_STEPS.every(s => uploads[s.key]);

  const handleSubmit = () => {
    setIsPending(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsApproved(true);
          setUser(prev => ({ ...prev, kycStatus: 'approved' }));
          showToast('Belgeleriniz başarıyla doğrulandı!', 'success');
          setTimeout(() => navigateTo(APP_STATES.MAP), 1500);
        }, 500);
      }
      setApprovalProgress(Math.min(progress, 100));
    }, 80);
  };

  // PENDING / APPROVED
  if (isPending) {
    return (
      <div className="screen" style={{ background: 'var(--togg-navy)' }}>
        <StatusBar />
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center',
        }}>
          {!isApproved ? (
            <div className="animate-fadeIn">
              <div style={{
                width: '120px', height: '120px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px', position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', inset: '-4px', borderRadius: '50%',
                  border: '3px solid transparent', borderTopColor: 'var(--togg-teal)',
                  animation: 'spin 1.2s linear infinite',
                }} />
                <AppleEmoji symbol="📝" size={48} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>Belgeler Kontrol Ediliyor</h2>
              <p style={{ color: 'var(--togg-gray-400)', fontSize: '14px', marginBottom: '24px', maxWidth: '280px', lineHeight: 1.6 }}>
                Belgeleriniz yapay zeka ile analiz ediliyor...
              </p>
              <div style={{ width: '100%', maxWidth: '280px', margin: '0 auto' }}>
                <div className="progress-bar" style={{ height: '6px' }}>
                  <div className="progress-bar-fill" style={{ width: `${approvalProgress}%` }} />
                </div>
                <p style={{ color: 'var(--togg-teal)', fontSize: '13px', fontWeight: 600, marginTop: '8px' }}>
                  %{Math.round(approvalProgress)}
                </p>
              </div>
            </div>
          ) : (
            <div className="animate-fadeInUp">
              <div style={{
                width: '120px', height: '120px', borderRadius: '50%',
                background: 'rgba(46,213,115,0.1)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <AppleEmoji symbol="✅" size={56} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#2ed573', marginBottom: '8px' }}>Onaylandı!</h2>
              <p style={{ color: 'var(--togg-gray-300)', fontSize: '14px' }}>Haritaya yönlendiriliyorsunuz...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // UPLOAD SCREEN
  return (
    <div className="screen" style={{ background: 'var(--togg-navy)' }}>
      <StatusBar />

      <div style={{ padding: '24px 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigateTo(APP_STATES.REGISTER)} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px', width: '40px', height: '40px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', cursor: 'pointer',
        }}>←</button>

        {/* Demo Fast Fill Badge */}
        {!allUploaded && (
          <button 
            onClick={handleQuickFill}
            style={{
              background: 'rgba(0, 212, 170, 0.1)',
              border: '1px solid var(--togg-teal)',
              borderRadius: '20px',
              padding: '6px 12px',
              color: 'var(--togg-teal)',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,212,170,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            ⚡ CEO Hızlı Doldur
          </button>
        )}
      </div>

      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column' }}>
        <div className="animate-fadeInUp">
          {/* Header with vehicle image */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px',
          }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '16px', overflow: 'hidden',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
            }}>
              <img src="/privado/images/togg-t10x.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '2px' }}>Belge Doğrulama</h1>
              <p style={{ color: 'var(--togg-gray-400)', fontSize: '12px' }}>
                Güvenli sürüş için belge yükleyin
              </p>
            </div>
          </div>

          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div className="progress-bar" style={{ flex: 1 }}>
              <div className="progress-bar-fill" style={{
                width: `${(Object.keys(uploads).length / DOC_STEPS.length) * 100}%`,
              }} />
            </div>
            <span style={{ fontSize: '12px', color: 'var(--togg-teal)', fontWeight: 700 }}>
              {Object.keys(uploads).length}/{DOC_STEPS.length}
            </span>
          </div>

          {/* Upload Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {DOC_STEPS.map((step, i) => {
              const isUploaded = uploads[step.key];
              return (
                <div
                  key={step.key}
                  className="animate-fadeInUp"
                  onClick={() => !isUploaded && handleUpload(step.key)}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: '16px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    cursor: isUploaded ? 'default' : 'pointer',
                    animationDelay: `${i * 100}ms`,
                    animationFillMode: 'both',
                    border: isUploaded
                      ? '1px solid rgba(46,213,115,0.2)'
                      : '1px solid rgba(255,255,255,0.04)',
                    transition: 'all 200ms ease',
                  }}
                >
                  <div style={{
                    width: '50px', height: '50px', borderRadius: '14px',
                    background: isUploaded ? 'rgba(46,213,115,0.1)' : 'rgba(255,255,255,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', flexShrink: 0,
                  }}>
                    <AppleEmoji symbol={isUploaded ? '✅' : step.icon} size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '14px', fontWeight: 600,
                      color: isUploaded ? '#2ed573' : '#fff', marginBottom: '2px',
                    }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: '11px', color: 'var(--togg-gray-400)' }}>
                      {isUploaded ? 'Başarıyla yüklendi' : step.desc}
                    </p>
                  </div>
                  {!isUploaded && (
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px',
                      background: 'rgba(255,255,255,0.04)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      <AppleEmoji symbol={'📷'} size={16} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 20px 40px' }}>
        <button className="btn btn-primary btn-lg btn-full" onClick={handleSubmit}
          style={{
            opacity: allUploaded ? 1 : 0.3, pointerEvents: allUploaded ? 'auto' : 'none',
            borderRadius: '16px', fontWeight: 800,
          }}>
          Belgeleri Gönder
        </button>
      </div>
    </div>
  );
}

