import { useState, useEffect } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import { getVehicleImage } from '../data/mockData';
import StatusBar from '../components/StatusBar';
import AppleEmoji from '../components/AppleEmoji';

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

  // The car is ready, wait for user to click Aracın Yanındayım

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
        background: 'radial-gradient(circle at 50% 30%, rgba(0,212,170,0.15) 0%, var(--togg-navy) 70%)',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 'var(--space-lg)',
      }}>
        <StatusBar />

        <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
          
          {/* Beautiful Glassmorphic Glow Pedestal */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              inset: '-30px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,212,170,0.2) 0%, transparent 70%)',
              animation: 'pulseGlow 2.5s ease-in-out infinite',
            }} />
            <div style={{
              width: '220px',
              height: '140px',
              borderRadius: '24px',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.4), inset 0 2px 20px rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}>
              <img src={vehicleImg} alt={selectedVehicle?.model} style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.5))',
              }} />
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px', letterSpacing: '0.5px' }}>
              Araca Yaklaşıyorsunuz
            </h2>
            <p style={{ color: 'var(--togg-gray-400)', fontSize: '15px', fontWeight: 500 }}>
              {selectedVehicle?.model || 'TOGG T10X'} <span style={{opacity: 0.5}}>•</span> {selectedVehicle?.plate || '34 TG 1001'}
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--togg-teal)',
            fontSize: '14px',
            fontWeight: 700,
            background: 'rgba(0,212,170,0.1)',
            border: '1px solid rgba(0,212,170,0.2)',
            padding: '12px 20px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0,212,170,0.15)'
          }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: 'var(--togg-teal)',
              boxShadow: '0 0 10px var(--togg-teal)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
            Bluetooth ile Bağlanılıyor...
          </div>
          
          <div style={{ width: '100%', maxWidth: '320px', marginTop: '16px' }}>
            <button className="btn btn-primary btn-lg btn-full" onClick={() => setStep(STEPS.DAMAGE_CHECK)}
              style={{ borderRadius: '16px', fontWeight: 800 }}>
              Aracın Yanındayım
            </button>
          </div>
        </div>
      </div>
    );
  }

  // DAMAGE CHECK
  if (step === STEPS.DAMAGE_CHECK) {
    return (
      <div className="screen" style={{ background: 'var(--togg-navy)' }}>
        <div style={{
          position: 'absolute', top: '-10%', right: '-20%', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(255,165,2,0.05) 0%, transparent 70%)', pointerEvents: 'none'
        }} />
        <StatusBar />
        <div style={{ padding: '0 20px 20px', position: 'relative', zIndex: 1 }}>
          <button onClick={() => navigateTo(APP_STATES.MAP)} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', width: '44px', height: '44px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}>←</button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 20px', position: 'relative', zIndex: 1 }}>
          <div className="animate-fadeInUp">
            
            {/* Premium Header Profile */}
            <div style={{
              borderRadius: '24px',
              overflow: 'hidden',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
              marginBottom: '32px',
              backdropFilter: 'blur(24px)'
            }}>
              <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(255,165,2,0.1), transparent)' }} />
                <img src={vehicleImg} alt={selectedVehicle?.model} style={{
                  height: '100%', objectFit: 'contain', position: 'relative',
                  filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.4))',
                }} />
              </div>
              <div style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontWeight: 800, fontSize: '18px', color: '#fff', marginBottom: '4px' }}>{selectedVehicle?.model || 'TOGG T10X'}</h3>
                <div style={{ display: 'flex', gap: '8px', color: 'var(--togg-gray-400)', fontSize: '13px', fontWeight: 500 }}>
                  <span style={{ color: 'var(--togg-white)', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '6px' }}>{selectedVehicle?.plate || '34 TG 1001'}</span>
                  <span style={{ padding: '2px 4px' }}>{selectedVehicle?.color || 'Anadolu Mavisi'}</span>
                </div>
              </div>
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>
              Hasar Kontrolü
            </h1>
            <p style={{ color: 'var(--togg-gray-300)', fontSize: '15px', marginBottom: '32px', lineHeight: 1.6 }}>
              Sürüşe başlamadan önce araç etrafında bir tur atın. Daha önce raporlanmamış <b>yeni bir hasar</b> veya <b>çizik</b> tespit ettiniz mi?
            </p>
          </div>
        </div>

        <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', zIndex: 1 }}>
          <button className="btn btn-primary btn-lg btn-full" onClick={handleNoDamage}
            style={{ borderRadius: '16px', fontWeight: 800, fontSize: '16px', padding: '18px' }}>
            Araç Kusursuz, Devam Et
          </button>
          <button className="btn btn-full" onClick={handleReportDamage} style={{
            background: 'rgba(255,165,2,0.1)', border: '1px solid rgba(255,165,2,0.2)',
            borderRadius: '16px', padding: '18px', color: '#ffa502', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '15px',
          }}>
            <AppleEmoji symbol="📷" size={20} />
            Sorun Bildir (Fotoğraf Çek)
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
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0,212,170,0.05) 0%, transparent 60%)', pointerEvents: 'none'
        }} />
        <StatusBar />

        <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', zIndex: 1 }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Akıllı Anahtar</h1>
            <p style={{ color: 'var(--togg-gray-300)', fontSize: '15px', maxWidth: '300px', lineHeight: 1.6 }}>
              Şoför kapısı kolundaki ekranı okutarak araca giriş yapın.
            </p>
          </div>

          <button
            onClick={handleScanQR}
            disabled={isScanning}
            style={{
              width: '240px', height: '240px', borderRadius: '36px',
              background: isScanning ? 'rgba(0,212,170,0.05)' : 'rgba(255,255,255,0.03)',
              border: `2px solid ${isScanning ? 'var(--togg-teal)' : 'rgba(255,255,255,0.08)'}`,
              boxShadow: isScanning ? '0 12px 40px rgba(0,212,170,0.2)' : '0 12px 32px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(20px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '16px', cursor: isScanning ? 'default' : 'pointer', position: 'relative', overflow: 'hidden',
              transition: 'all 300ms ease', color: '#fff',
            }}
          >
            {/* Viewfinder corners */}
            <div style={{ position: 'absolute', top: '24px', left: '24px', width: '30px', height: '30px', borderTop: '3px solid rgba(255,255,255,0.3)', borderLeft: '3px solid rgba(255,255,255,0.3)', borderRadius: '8px 0 0 0' }} />
            <div style={{ position: 'absolute', top: '24px', right: '24px', width: '30px', height: '30px', borderTop: '3px solid rgba(255,255,255,0.3)', borderRight: '3px solid rgba(255,255,255,0.3)', borderRadius: '0 8px 0 0' }} />
            <div style={{ position: 'absolute', bottom: '24px', left: '24px', width: '30px', height: '30px', borderBottom: '3px solid rgba(255,255,255,0.3)', borderLeft: '3px solid rgba(255,255,255,0.3)', borderRadius: '0 0 0 8px' }} />
            <div style={{ position: 'absolute', bottom: '24px', right: '24px', width: '30px', height: '30px', borderBottom: '3px solid rgba(255,255,255,0.3)', borderRight: '3px solid rgba(255,255,255,0.3)', borderRadius: '0 0 8px 0' }} />

            {isScanning && (
              <>
                 <div style={{
                  position: 'absolute', inset: '-4px', borderRadius: '40px',
                  border: '3px solid transparent', borderTopColor: 'var(--togg-teal)',
                  animation: 'spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                }} />
                <div style={{
                  position: 'absolute', left: '-10%', right: '-10%', height: '4px',
                  background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.8), transparent)',
                  boxShadow: '0 0 20px var(--togg-teal), 0 0 10px #fff',
                  top: `${scanProgress}%`, transition: 'top 80ms linear',
                  animation: 'pulseGlow 2s infinite'
                }} />
              </>
            )}
            
            <div style={{ zIndex: 1, filter: isScanning ? 'drop-shadow(0 0 10px rgba(0,212,170,0.5))' : 'none', transition: 'all 300ms ease', transform: isScanning ? 'scale(1.1)' : 'scale(1)' }}>
              <AppleEmoji symbol={isScanning ? '📡' : '📱'} size={72} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.5px', color: isScanning ? 'var(--togg-teal)' : 'var(--togg-white)', zIndex: 1, textTransform: 'uppercase' }}>
              {isScanning ? `Bağlanıyor... %${scanProgress}` : 'Dokunarak Tara'}
            </span>
          </button>

          <div style={{
            background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px 20px',
            maxWidth: '320px', display: 'flex', alignItems: 'center', gap: '14px',
            border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
          }}>
            <div style={{ flexShrink: 0 }}>
              <AppleEmoji symbol="💡" size={28} />
            </div>
            <p style={{ fontSize: '13px', color: 'var(--togg-gray-300)', lineHeight: 1.5, textAlign: 'left', fontWeight: 500 }}>
              Telefon ekranınızı, B-Hücresindeki veya şoför kapısındaki QR okuyucuya yaklaştırın.
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

      <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>
        {/* Vehicle with success glow */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: '-24px', borderRadius: '40px',
            background: 'radial-gradient(circle, rgba(0,212,170,0.15) 0%, transparent 70%)',
            animation: 'pulseGlow 2.5s ease-in-out infinite',
          }} />
          <div style={{
            width: '240px', height: '160px', borderRadius: '28px', overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(46,213,115,0.12), rgba(0,212,170,0.04))',
            border: '2px solid rgba(46,213,115,0.3)',
            boxShadow: '0 16px 40px rgba(0,212,170,0.15), inset 0 2px 20px rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
            backdropFilter: 'blur(20px)'
          }}>
            <img src={vehicleImg} alt={selectedVehicle?.model} style={{
              height: '100%', objectFit: 'contain',
              filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.4))',
            }} />
          </div>
        </div>

        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#2ed573', marginBottom: '8px', letterSpacing: '0.5px' }}>
            Kapılar Açıldı!
          </h1>
          <p style={{ color: 'var(--togg-gray-300)', fontSize: '15px', maxWidth: '300px', lineHeight: 1.6, fontWeight: 500 }}>
            Aracın içindeki <strong style={{ color: '#fff' }}>Motor Start/Stop</strong> tuşuna basarak motoru çalıştırın.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '320px' }}>
          {[
            { num: 1, text: 'Araca binin', done: true },
            { num: 2, text: 'Emniyet kemerinizi takın', done: false },
            { num: 3, text: 'Start/Stop tuşuna basın', done: false },
          ].map((s) => (
            <div key={s.num} style={{
              background: s.done ? 'rgba(46,213,115,0.08)' : 'rgba(255,255,255,0.04)',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              border: s.done ? '1px solid rgba(46,213,115,0.2)' : '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: s.done ? '#2ed573' : 'rgba(255,255,255,0.08)',
                boxShadow: s.done ? '0 4px 12px rgba(46,213,115,0.3)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {s.done ? <AppleEmoji symbol="✅" size={16} /> : <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--togg-gray-400)' }}>{s.num}</span>}
              </div>
              <span style={{ fontSize: '15px', fontWeight: s.done ? 700 : 500, color: s.done ? '#2ed573' : '#fff' }}>
                {s.text}
              </span>
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary btn-lg btn-full"
          onClick={() => startDrive()}
          style={{
            maxWidth: '320px', borderRadius: '20px', fontWeight: 800, fontSize: '18px',
            padding: '20px', marginTop: '8px',
            boxShadow: '0 8px 32px rgba(0,212,170,0.35)',
            letterSpacing: '0.5px'
          }}
        >
          Sürüşe Başla
        </button>
      </div>
    </div>
  );
}
