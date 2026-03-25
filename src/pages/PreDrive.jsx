import { useState, useEffect } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import { getVehicleImage } from '../data/mockData';
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

  const vehicleImg = getVehicleImage(selectedVehicle?.model);

  useEffect(() => {
    if (step === STEPS.APPROACHING) {
      const timer = setTimeout(() => setStep(STEPS.DAMAGE_CHECK), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleNoDamage = () => {
    showToast('Hasar kontrolü tamamlandı', 'success');
    setStep(STEPS.QR_SCAN);
  };

  const handleReportDamage = () => {
    showToast('Hasar raporu oluşturuldu. Destek ekibi bilgilendirildi.', 'info');
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
        showToast('Kapılar açıldı!', 'success');
      }
    }, 80);
  };

  // APPROACHING
  if (step === STEPS.APPROACHING) {
    return (
      <div className="screen" style={{
        background: 'var(--togg-navy)',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 'var(--space-lg)',
      }}>
        <StatusBar />

        <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          {/* Vehicle with pulse ring */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              inset: '-20px',
              borderRadius: '50%',
              border: '2px solid rgba(0,212,170,0.2)',
              animation: 'pulseGlow 2s ease-in-out infinite',
            }} />
            <div style={{
              width: '180px',
              height: '120px',
              borderRadius: '20px',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(79,172,254,0.05))',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img src={vehicleImg} alt={selectedVehicle?.model} style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
              }} />
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>
              Araca Yaklaşıyorsunuz
            </h2>
            <p style={{ color: 'var(--togg-gray-400)', fontSize: '14px' }}>
              {selectedVehicle?.model || 'TOGG T10X'} · {selectedVehicle?.plate || '34 TG 1001'}
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--togg-teal)',
            fontSize: '13px',
            fontWeight: 600,
            background: 'rgba(0,212,170,0.08)',
            padding: '8px 16px',
            borderRadius: '20px',
          }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'var(--togg-teal)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
            Konum doğrulanıyor...
          </div>
        </div>
      </div>
    );
  }

  // DAMAGE CHECK
  if (step === STEPS.DAMAGE_CHECK) {
    return (
      <div className="screen" style={{ background: 'var(--togg-navy)' }}>
        <StatusBar />
        <div style={{ padding: '0 20px 20px' }}>
          <button onClick={() => navigateTo(APP_STATES.MAP)} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px', width: '40px', height: '40px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', cursor: 'pointer',
          }}>←</button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 20px' }}>
          <div className="animate-fadeInUp">
            {/* Vehicle preview with image */}
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(255,165,2,0.08), rgba(255,165,2,0.03))',
              border: '1px solid rgba(255,165,2,0.15)',
              marginBottom: '24px',
            }}>
              <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                <img src={vehicleImg} alt={selectedVehicle?.model} style={{
                  height: '100%', objectFit: 'contain',
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
                }} />
              </div>
              <div style={{ padding: '0 16px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '15px' }}>{selectedVehicle?.model || 'TOGG T10X'}</h3>
                  <p style={{ color: 'var(--togg-gray-400)', fontSize: '12px' }}>
                    {selectedVehicle?.plate || '34 TG 1001'} · {selectedVehicle?.color || 'Anadolu Mavisi'}
                  </p>
                </div>
              </div>
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
              Hasar Kontrolü
            </h1>
            <p style={{ color: 'var(--togg-gray-300)', fontSize: '14px', marginBottom: '32px', lineHeight: 1.6 }}>
              Araçta daha önce mevcut olmayan yeni bir hasar görüyor musunuz?
            </p>
          </div>
        </div>

        <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className="btn btn-primary btn-lg btn-full" onClick={handleNoDamage}
            style={{ borderRadius: '16px', fontWeight: 800 }}>
            Her Şey Yolunda
          </button>
          <button className="btn btn-full" onClick={handleReportDamage} style={{
            background: 'rgba(255,165,2,0.1)', border: '1px solid rgba(255,165,2,0.2)',
            borderRadius: '16px', padding: '16px', color: '#ffa502', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '15px',
          }}>
            📷 Hasar Bildir
          </button>
        </div>
      </div>
    );
  }

  // QR SCAN
  if (step === STEPS.QR_SCAN) {
    return (
      <div className="screen" style={{
        background: 'var(--togg-navy)',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 'var(--space-lg)',
      }}>
        <StatusBar />

        <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>QR Kodu Okutun</h1>
          <p style={{ color: 'var(--togg-gray-300)', fontSize: '14px', maxWidth: '280px', lineHeight: 1.6 }}>
            Kapı kolunun yanındaki QR kodu okutarak kilidi açın
          </p>

          <button
            onClick={handleScanQR}
            disabled={isScanning}
            style={{
              width: '200px', height: '200px', borderRadius: '28px',
              background: isScanning ? 'rgba(0,212,170,0.06)' : 'rgba(255,255,255,0.04)',
              border: `3px solid ${isScanning ? 'var(--togg-teal)' : 'rgba(255,255,255,0.08)'}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '12px', cursor: isScanning ? 'default' : 'pointer', position: 'relative', overflow: 'hidden',
              transition: 'all 300ms ease', color: '#fff',
            }}
          >
            {isScanning && (
              <>
                <div style={{
                  position: 'absolute', inset: '-4px', borderRadius: '32px',
                  border: '3px solid transparent', borderTopColor: 'var(--togg-teal)',
                  animation: 'spin 1s linear infinite',
                }} />
                <div style={{
                  position: 'absolute', left: '10%', right: '10%', height: '3px',
                  background: 'linear-gradient(90deg, transparent, var(--togg-teal), transparent)',
                  boxShadow: '0 0 15px var(--togg-teal)',
                  top: `${scanProgress}%`, transition: 'top 80ms linear',
                }} />
              </>
            )}
            <div style={{ fontSize: '60px', zIndex: 1 }}>{isScanning ? '📡' : '📱'}</div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: isScanning ? 'var(--togg-teal)' : 'var(--togg-gray-300)', zIndex: 1 }}>
              {isScanning ? `Taranıyor... ${scanProgress}%` : 'Dokunarak Tara'}
            </span>
          </button>

          <div style={{
            background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '14px',
            maxWidth: '300px', display: 'flex', alignItems: 'center', gap: '10px',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ fontSize: '18px', flexShrink: 0 }}>💡</div>
            <p style={{ fontSize: '12px', color: 'var(--togg-gray-400)', lineHeight: 1.5 }}>
              QR kod genellikle sürücü tarafı kapı kolunun hemen yanında bulunur
            </p>
          </div>
        </div>
      </div>
    );
  }

  // UNLOCKED
  return (
    <div className="screen" style={{
      background: 'var(--togg-navy)',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: 'var(--space-lg)',
    }}>
      <StatusBar />

      <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        {/* Vehicle with success glow */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: '-16px', borderRadius: '30px',
            background: 'rgba(0,212,170,0.08)',
            animation: 'pulseGlow 2s ease-in-out infinite',
          }} />
          <div style={{
            width: '200px', height: '130px', borderRadius: '22px', overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(46,213,115,0.1), rgba(0,212,170,0.06))',
            border: '2px solid rgba(46,213,115,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px',
          }}>
            <img src={vehicleImg} alt={selectedVehicle?.model} style={{
              height: '100%', objectFit: 'contain',
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
            }} />
          </div>
        </div>

        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--togg-green)', marginBottom: '6px' }}>
            Kapılar Açıldı!
          </h1>
          <p style={{ color: 'var(--togg-gray-300)', fontSize: '14px', maxWidth: '280px', lineHeight: 1.6 }}>
            Arabanın içindeki <strong style={{ color: '#fff' }}>Start/Stop</strong> tuşuna basarak motoru çalıştırın
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '320px' }}>
          {[
            { num: 1, text: 'Araca binin', done: true },
            { num: 2, text: 'Emniyet kemerinizi takın', done: false },
            { num: 3, text: 'Start/Stop tuşuna basın', done: false },
          ].map((s) => (
            <div key={s.num} style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '14px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: '1px solid rgba(255,255,255,0.04)',
            }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: s.done ? 'var(--togg-teal)' : 'rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 700,
                color: s.done ? 'var(--togg-navy)' : 'var(--togg-gray-400)',
                flexShrink: 0,
              }}>
                {s.done ? '✓' : s.num}
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: s.done ? 'var(--togg-gray-300)' : '#fff' }}>
                {s.text}
              </span>
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary btn-lg btn-full"
          onClick={() => startDrive()}
          style={{
            maxWidth: '320px', borderRadius: '16px', fontWeight: 800, fontSize: '16px',
            boxShadow: '0 8px 32px rgba(0,212,170,0.3)',
          }}
        >
          Sürüşe Başla
        </button>
      </div>
    </div>
  );
}
