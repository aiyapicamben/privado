import { useState, useEffect } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import { getVehicleImage } from '../data/mockData';
import StatusBar from '../components/StatusBar';
import AppleEmoji from '../components/AppleEmoji';
import SwipeButton from '../components/SwipeButton';

const STEPS = {
  PROVISION: 'provision',
  APPROACHING: 'approaching',
  DAMAGE_CHECK: 'damage_check',
  QR_SCAN: 'qr_scan',
  UNLOCKED: 'unlocked',
};

export default function PreDrive() {
  const { navigateTo, selectedVehicle, showToast, startDrive, user } = useApp();
  const [step, setStep] = useState(STEPS.PROVISION);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [hasUpsellSigorta, setHasUpsellSigorta] = useState(null); // null = not chosen, true = accepted, false = rejected
  const [completedSteps, setCompletedSteps] = useState({ 1: false, 2: false, 3: false });

  const defaultCard = user?.cards?.find(c => c.isDefault) || user?.cards?.[0];
  const [selectedProvisionCardId, setSelectedProvisionCardId] = useState(defaultCard?.id);

  const handleStepClick = (num) => {
    if (num === 1) {
      setCompletedSteps(prev => {
        const nextVal = !prev[1];
        return {
          1: nextVal,
          2: nextVal ? prev[2] : false,
          3: nextVal ? prev[3] : false,
        };
      });
    } else if (num === 2) {
      if (!completedSteps[1]) {
        showToast('Lütfen önce araca binin!', 'info');
        return;
      }
      setCompletedSteps(prev => {
        const nextVal = !prev[2];
        return {
          ...prev,
          2: nextVal,
          3: nextVal ? prev[3] : false,
        };
      });
    } else if (num === 3) {
      if (!completedSteps[2]) {
        showToast('Lütfen önce emniyet kemerinizi takın!', 'info');
        return;
      }
      setCompletedSteps(prev => ({
        ...prev,
        3: !prev[3],
      }));
    }
  };

  const vehicleImg = getVehicleImage(selectedVehicle?.model);

  const handleProvisionAccepted = () => {
    showToast('Provizyon blokesi alındı ve sigorta tercihi kaydedildi!', 'success');
    setStep(STEPS.APPROACHING);
  };

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
        setTimeout(() => {
          setIsScanning(false);
          setStep(STEPS.UNLOCKED);
          showToast('Kapılar açıldı!', 'success');
        }, 800); // Small pause to show the green checkmark/success animation
      }
    }, 60);
  };

  // PROVISION & UPSELL STEP
  if (step === STEPS.PROVISION) {
    return (
      <div className="screen" style={{ background: 'var(--togg-navy)', padding: '20px' }}>
        <StatusBar />
        
        <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', paddingBottom: '20px' }}>
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px', marginTop: '20px' }}>
              <span className="brand-glow-sm" style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--togg-teal)' }}>Sürüş Güvencesi</span>
              <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', marginTop: '6px' }}>Ön Onay ve Provizyon</h1>
            </div>

            {/* Upsell Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(79,172,254,0.1) 0%, rgba(0,212,170,0.05) 100%)',
              border: '1px solid rgba(79,172,254,0.25)',
              borderRadius: '24px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--togg-blue)', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '4px 8px', borderRadius: '10px', textTransform: 'uppercase' }}>
                Önerilen
              </div>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{ fontSize: '32px' }}>🛡️</div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>Ferdi Kaza Sigortası</h3>
                  <p style={{ fontSize: '12px', color: 'var(--togg-gray-300)', lineHeight: '1.4' }}>Sadece <span style={{ color: 'var(--togg-teal)', fontWeight: 700 }}>10 TL</span> farkla, olası kazalara karşı tam <span style={{ color: 'var(--togg-blue)', fontWeight: 700 }}>1.000.000 TL</span> teminat güvencesi kazanın.</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button 
                  onClick={() => setHasUpsellSigorta(false)}
                  style={{
                    flex: 1,
                    background: hasUpsellSigorta === false ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                    border: hasUpsellSigorta === false ? '1.5px solid var(--togg-gray-400)' : '1px solid rgba(255,255,255,0.08)',
                    color: hasUpsellSigorta === false ? '#fff' : 'var(--togg-gray-400)',
                    padding: '10px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 200ms ease'
                  }}
                >
                  Hayır, İstemiyorum
                </button>
                <button 
                  onClick={() => setHasUpsellSigorta(true)}
                  style={{
                    flex: 1,
                    background: hasUpsellSigorta === true ? 'linear-gradient(135deg, #00d4aa, #4facfe)' : 'rgba(0,212,170,0.1)',
                    border: hasUpsellSigorta === true ? 'none' : '1px solid rgba(0,212,170,0.2)',
                    color: hasUpsellSigorta === true ? '#0a0f1e' : 'var(--togg-teal)',
                    padding: '10px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    boxShadow: hasUpsellSigorta === true ? '0 4px 15px rgba(0,212,170,0.3)' : 'none'
                  }}
                >
                  Güvenceyi Ekle (+10 TL)
                </button>
              </div>
            </div>

            {/* Provision Details Box */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '20px',
              padding: '18px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--togg-gray-400)' }}>Provizyon Tutarı</span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>5.000 TL</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '16px' }}>ℹ️</span>
                <p style={{ fontSize: '11px', color: 'var(--togg-gray-400)', lineHeight: '1.5' }}>
                  Bu tutar, olası trafik cezaları veya hasar tespiti için geçici olarak kartınızda bloke edilir. Sürüşünüz güvenle bittikten sonra en geç 24 saat içinde blokeniz kaldırılacaktır.
                </p>
              </div>
            </div>

            {/* Provision Card Selection */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '20px',
              padding: '18px',
              marginBottom: '24px'
            }}>
              <label style={{ fontSize: '12px', color: 'var(--togg-gray-400)', fontWeight: 600, display: 'block', marginBottom: '10px' }}>
                Bloke Edilecek Kredi Kartı
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {user?.cards?.map((card) => (
                  <div 
                    key={card.id}
                    onClick={() => setSelectedProvisionCardId(card.id)}
                    style={{
                      background: selectedProvisionCardId === card.id ? 'rgba(0, 212, 170, 0.08)' : 'rgba(255,255,255,0.03)',
                      border: `1.5px solid ${selectedProvisionCardId === card.id ? 'var(--togg-teal)' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px',
                      cursor: 'pointer', transition: 'all 200ms ease'
                    }}
                  >
                    <div style={{ fontSize: '16px' }}>💳</div>
                    <div style={{ flex: 1, fontSize: '13px', fontWeight: 600 }}>
                      •••• •••• •••• {card.last4} ({card.type})
                    </div>
                    {selectedProvisionCardId === card.id && (
                      <div style={{ color: 'var(--togg-teal)', fontSize: '14px', fontWeight: 800 }}>✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Swipe-to-Accept Button */}
          <div style={{ width: '100%', maxWidth: '360px', margin: '0 auto' }}>
            <SwipeButton 
              onSwipe={handleProvisionAccepted} 
              label="Bloke ve Şartları Onayla" 
              icon="✓" 
            />
            <p style={{ fontSize: '10px', color: 'var(--togg-gray-500)', textAlign: 'center', marginTop: '12px' }}>
              Onaylamak için butonu sağa doğru kaydırın
            </p>
          </div>
        </div>
      </div>
    );
  }

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
        <StatusBar />
        <div style={{ padding: '24px 20px 20px', position: 'relative', zIndex: 1 }}>
          <button onClick={() => setStep(STEPS.APPROACHING)} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', width: '44px', height: '44px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}>←</button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 20px', position: 'relative', zIndex: 1 }}>
          <div className="animate-fadeInUp">
            
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
        <StatusBar />

        <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', zIndex: 1 }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Akıllı Anahtar</h1>
            <p style={{ color: 'var(--togg-gray-300)', fontSize: '15px', maxWidth: '300px', lineHeight: 1.6 }}>
              Şoför kapısı kolundaki ekranı okutarak araca giriş yapın.
            </p>
          </div>

          {/* Scanner view frame & laser sweep animation */}
          <div
            onClick={handleScanQR}
            style={{
              width: '260px',
              height: '260px',
              borderRadius: '32px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isScanning ? 'default' : 'pointer',
              background: 'rgba(0,0,0,0.3)',
              border: `2px solid ${isScanning ? 'var(--togg-teal)' : 'rgba(255,255,255,0.15)'}`,
              overflow: 'hidden',
              boxShadow: isScanning ? '0 0 35px rgba(0,212,170,0.35)' : '0 10px 25px rgba(0,0,0,0.4)',
              transition: 'all 300ms ease'
            }}
          >
            {/* Corner Markers */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', width: '25px', height: '25px', borderTop: '4px solid var(--togg-teal)', borderLeft: '4px solid var(--togg-teal)', borderRadius: '8px 0 0 0' }} />
            <div style={{ position: 'absolute', top: '16px', right: '16px', width: '25px', height: '25px', borderTop: '4px solid var(--togg-teal)', borderRight: '4px solid var(--togg-teal)', borderRadius: '0 8px 0 0' }} />
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', width: '25px', height: '25px', borderBottom: '4px solid var(--togg-teal)', borderLeft: '4px solid var(--togg-teal)', borderRadius: '0 0 0 8px' }} />
            <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '25px', height: '25px', borderBottom: '4px solid var(--togg-teal)', borderRight: '4px solid var(--togg-teal)', borderRadius: '0 0 8px 0' }} />

            {/* Sweep Laser Line */}
            {isScanning && (
              <div 
                style={{
                  position: 'absolute',
                  left: '10px',
                  right: '10px',
                  height: '3px',
                  background: '#00d4aa',
                  boxShadow: '0 0 15px #00d4aa, 0 0 8px #fff',
                  zIndex: 2,
                  animation: 'laserSweep 2s ease-in-out infinite'
                }}
              />
            )}

            {/* Animation state checks */}
            {scanProgress >= 100 ? (
              <div className="animate-scaleIn" style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: '#2ed573',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 25px rgba(46,213,115,0.6)',
                  animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}>
                  <span style={{ fontSize: '36px', color: '#fff' }}>✓</span>
                </div>
                <span style={{ color: '#2ed573', fontWeight: 800, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Başarılı</span>
              </div>
            ) : (
              <>
                <div style={{ zIndex: 1, transition: 'all 300ms ease', transform: isScanning ? 'scale(1.05)' : 'scale(1)' }}>
                  <AppleEmoji symbol={isScanning ? '📡' : '📱'} size={72} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.5px', color: isScanning ? 'var(--togg-teal)' : '#fff', zIndex: 1, marginTop: '14px', textTransform: 'uppercase' }}>
                  {isScanning ? `Taranıyor... %${scanProgress}` : 'Tarama Başlat'}
                </span>
              </>
            )}
          </div>

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
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <div style={{
            position: 'absolute', inset: '-30px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(46,213,115,0.2) 0%, transparent 70%)',
            animation: 'pulseGlow 2.5s ease-in-out infinite',
          }} />
          <div style={{
            width: '260px', height: '160px', borderRadius: '30px',
            background: 'linear-gradient(135deg, rgba(46,213,115,0.08) 0%, rgba(0,212,170,0.02) 100%)',
            border: '1.5px solid rgba(46,213,115,0.35)',
            boxShadow: '0 20px 45px rgba(0,0,0,0.45), inset 0 1px 10px rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
            backdropFilter: 'blur(20px)'
          }}>
            <img src={vehicleImg} alt={selectedVehicle?.model} style={{
              width: '90%',
              height: '90%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.6))',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '320px' }}>
          {[
            { num: 1, text: 'Araca binin' },
            { num: 2, text: 'Emniyet kemerinizi takın' },
            { num: 3, text: 'Start/Stop tuşuna basın' },
          ].map((s) => {
            const done = completedSteps[s.num];
            const isClickable = s.num === 1 || (s.num === 2 && completedSteps[1]) || (s.num === 3 && completedSteps[2]);
            
            return (
              <div 
                key={s.num} 
                onClick={() => handleStepClick(s.num)}
                style={{
                  background: done 
                    ? 'rgba(46,213,115,0.08)' 
                    : isClickable 
                      ? 'rgba(0, 212, 170, 0.04)' 
                      : 'rgba(255,255,255,0.02)',
                  borderRadius: '18px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  border: done 
                    ? '1.5px solid rgba(46,213,115,0.3)' 
                    : isClickable 
                      ? '1.5px dashed rgba(0, 212, 170, 0.4)' 
                      : '1.5px solid rgba(255,255,255,0.04)',
                  cursor: isClickable ? 'pointer' : 'not-allowed',
                  opacity: isClickable ? 1 : 0.4,
                  transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isClickable && !done ? '0 0 10px rgba(0, 212, 170, 0.08)' : 'none',
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: done 
                    ? '#2ed573' 
                    : isClickable 
                      ? 'rgba(0, 212, 170, 0.15)' 
                      : 'rgba(255,255,255,0.05)',
                  boxShadow: done ? '0 4px 12px rgba(46,213,115,0.3)' : 'none',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 250ms ease',
                }}>
                  {done ? (
                    <AppleEmoji symbol="✅" size={16} />
                  ) : (
                    <span style={{ 
                      fontSize: '13px', 
                      fontWeight: 800, 
                      color: isClickable ? 'var(--togg-teal)' : 'var(--togg-gray-500)' 
                    }}>
                      {s.num}
                    </span>
                  )}
                </div>
                <span style={{ 
                  fontSize: '15px', 
                  fontWeight: done ? 700 : 500, 
                  color: done ? '#2ed573' : isClickable ? '#fff' : 'var(--togg-gray-400)',
                  transition: 'all 250ms ease',
                }}>
                  {s.text}
                </span>
              </div>
            );
          })}
        </div>

        {(() => {
          const allCompleted = completedSteps[1] && completedSteps[2] && completedSteps[3];
          return (
            <button
              className="btn btn-primary btn-lg btn-full"
              onClick={() => startDrive()}
              disabled={!allCompleted}
              style={{
                maxWidth: '320px', 
                borderRadius: '20px', 
                fontWeight: 800, 
                fontSize: '18px',
                padding: '20px', 
                marginTop: '12px',
                opacity: allCompleted ? 1 : 0.35,
                background: allCompleted ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.06)',
                border: allCompleted ? 'none' : '1px solid rgba(255,255,255,0.08)',
                color: allCompleted ? '#0a0f1e' : 'var(--togg-gray-400)',
                boxShadow: allCompleted ? '0 8px 32px rgba(0,212,170,0.35)' : 'none',
                letterSpacing: '0.5px',
                cursor: allCompleted ? 'pointer' : 'not-allowed',
                pointerEvents: allCompleted ? 'auto' : 'none',
                transition: 'all 300ms ease',
              }}
            >
              Sürüşe Başla
            </button>
          );
        })()}
      </div>
    </div>
  );
}
