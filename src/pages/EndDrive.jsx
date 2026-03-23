import { useState } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import StatusBar from '../components/StatusBar';
import StarRating from '../components/StarRating';

const STEPS = {
  PARK_CHECK: 'park_check',
  PHOTO_PROOF: 'photo_proof',
  SUMMARY: 'summary',
};

export default function EndDrive() {
  const { navigateTo, selectedVehicle, driveState, resetAll, showToast, saveTripToHistory } = useApp();
  const [step, setStep] = useState(STEPS.PARK_CHECK);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [rating, setRating] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const totalSeconds = driveState.elapsedSeconds || 720;
  const totalMinutes = Math.ceil(totalSeconds / 60);
  const totalCost = driveState.totalCostTL > 0 ? driveState.totalCostTL : 87.5;

  // Use real tracked segments written by ActiveDrive
  const drivingSeconds = driveState.drivingSeconds || Math.round(totalSeconds * 0.8);
  const waitingSeconds = driveState.waitingSeconds || Math.max(0, totalSeconds - drivingSeconds);
  const drivingMin = Math.ceil(drivingSeconds / 60);
  const waitingMin = Math.ceil(waitingSeconds / 60);

  const handleParkConfirm = () => {
    setStep(STEPS.PHOTO_PROOF);
  };

  const handleTakePhoto = () => {
    setPhotoTaken(true);
    showToast('Fotoğraf kaydedildi ✓', 'success');
  };

  const handleSubmitPhoto = () => {
    setStep(STEPS.SUMMARY);
  };

  const handleFinish = () => {
    // Save trip to wallet history
    saveTripToHistory({
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      model: selectedVehicle?.model || 'TOGG T10X',
      plate: selectedVehicle?.plate || '34 TG 1001',
      durationMin: totalMinutes,
      cost: parseFloat(totalCost.toFixed(2)),
    });
    setShowSuccess(true);
    showToast('Teşekkürler! İyi yolculuklar 🎉', 'success');
    setTimeout(() => {
      resetAll();
    }, 2000);
  };

  // PARK CHECK step
  if (step === STEPS.PARK_CHECK) {
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
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '24px', width: '100%', maxWidth: '340px',
        }}>
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%',
            background: 'rgba(255, 165, 2, 0.1)', border: '1px solid rgba(255, 165, 2, 0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '52px',
          }}>
            🅿️
          </div>

          <div>
            <h1 style={{ fontSize: '30px', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.5px' }}>
              Park Kontrolü
            </h1>
            <p style={{ color: 'var(--togg-gray-400)', fontSize: '15px', lineHeight: 1.6 }}>
              İzin verilen bir park alanında olduğunuzdan emin olun ve motoru kapatın.
            </p>
          </div>

          {/* Warning card */}
          <div className="card-premium" style={{
            padding: '16px', width: '100%', display: 'flex', alignItems: 'flex-start',
            gap: '12px', border: '1px solid rgba(255, 165, 2, 0.2)', textAlign: 'left',
          }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <div>
              <p style={{
                fontSize: '14px', fontWeight: 700, color: '#ffa502', marginBottom: '2px',
              }}>
                Önemli Uyarı
              </p>
              <p style={{ fontSize: '12px', color: 'var(--togg-gray-400)', lineHeight: 1.5 }}>
                Yasak bölgede park ederseniz ek ücret yansıtılabilir. Haritadaki yeşil bölgeleri tercih edin.
              </p>
            </div>
          </div>

          {/* Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            {[
              { text: 'İzin verilen alandayım', icon: '✅' },
              { text: 'Motoru kapattım', icon: '🔑' },
              { text: 'El frenini çektim', icon: '🅿️' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px', textAlign: 'left',
              }}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span style={{ fontSize: '15px', fontWeight: 600 }}>{item.text}</span>
              </div>
            ))}
          </div>

          <button
            className="btn btn-primary btn-full"
            onClick={handleParkConfirm}
            style={{ fontSize: '16px', padding: '18px', fontWeight: 800, marginTop: '12px' }}
          >
            Onaylıyorum, Devam Et
          </button>
        </div>
      </div>
    );
  }

  // PHOTO PROOF step
  if (step === STEPS.PHOTO_PROOF) {
    return (
      <div className="screen" style={{ background: 'var(--gradient-dark)' }}>
        <StatusBar />

        <div style={{ padding: 'var(--space-lg)' }}>
          <button
            onClick={() => setStep(STEPS.PARK_CHECK)}
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
            }}
          >
            ←
          </button>
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 var(--space-lg)',
        }}>
          <div className="animate-fadeInUp" style={{ width: '100%', textAlign: 'center' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.5px' }}>
              Fotoğraf Kanıtı
            </h1>
            <p style={{
              color: 'var(--togg-gray-400)', fontSize: '15px',
              marginBottom: '32px', lineHeight: 1.6,
            }}>
              Park halindeki aracın çevresini gösterecek şekilde bir fotoğraf çekin
            </p>

            {/* Camera area */}
            <button
              onClick={handleTakePhoto}
              style={{
                width: '100%', maxWidth: '320px', height: '220px', borderRadius: '20px',
                background: photoTaken ? 'rgba(46,213,115,0.08)' : 'rgba(255,255,255,0.03)',
                border: `2px dashed ${photoTaken ? 'rgba(46,213,115,0.5)' : 'rgba(255,255,255,0.1)'}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '12px', cursor: 'pointer', margin: '0 auto', transition: 'all 200ms ease',
                color: photoTaken ? '#2ed573' : 'var(--togg-gray-400)',
              }}
            >
              <span style={{ fontSize: '56px' }}>
                {photoTaken ? '✅' : '📷'}
              </span>
              <span style={{
                fontSize: 'var(--font-sm)',
                fontWeight: 600,
                color: photoTaken ? 'var(--togg-green)' : 'var(--togg-gray-400)',
              }}>
                {photoTaken ? 'Fotoğraf çekildi' : 'Fotoğraf çekmek için dokunun'}
              </span>
            </button>

            {/* Tip */}
            <div className="glass-card" style={{
              padding: 'var(--space-md)',
              marginTop: 'var(--space-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              maxWidth: '320px',
              margin: 'var(--space-lg) auto 0',
              textAlign: 'left',
            }}>
              <span style={{ fontSize: '18px' }}>💡</span>
              <p style={{
                fontSize: 'var(--font-xs)',
                color: 'var(--togg-gray-400)',
                lineHeight: 1.5,
              }}>
                Aracın tamamının ve çevresinin görünür olduğundan emin olun
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: 'var(--space-lg) var(--space-lg) var(--space-2xl)' }}>
          <button
            className="btn btn-primary btn-lg btn-full"
            onClick={handleSubmitPhoto}
            style={{
              opacity: photoTaken ? 1 : 0.4,
              pointerEvents: photoTaken ? 'auto' : 'none',
            }}
          >
            Fotoğrafı Gönder
          </button>
        </div>
      </div>
    );
  }

  // SUMMARY step
  if (showSuccess) {
    return (
      <div className="screen" style={{
        background: 'var(--gradient-dark)',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 'var(--space-lg)',
      }}>
        <div className="animate-fadeInUp" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-lg)',
        }}>
          <div style={{
            fontSize: '80px',
            animation: 'float 2s ease-in-out infinite',
          }}>
            🎉
          </div>
          <h1 style={{
            fontSize: 'var(--font-2xl)',
            fontWeight: 800,
            color: 'var(--togg-green)',
          }}>
            Teşekkürler!
          </h1>
          <p style={{ color: 'var(--togg-gray-300)' }}>
            Haritaya yönlendiriliyorsunuz...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen" style={{ background: 'var(--gradient-dark)' }}>
      <StatusBar />

      <div style={{
        flex: 1,
        padding: 'var(--space-lg)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div className="animate-fadeInUp" style={{ width: '100%', textAlign: 'center' }}>
          {/* Success header */}
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'rgba(0, 212, 170, 0.1)', border: '1px solid rgba(0, 212, 170, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', margin: '0 auto 24px',
            }}>
              🏁
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '32px', letterSpacing: '-0.5px' }}>
              Sürüş Özeti
            </h1>
          </div>

          {/* Summary Card */}
          <div className="card-premium" style={{ padding: '20px', marginBottom: '24px', width: '100%' }}>
            {/* Vehicle info */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '16px',
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', border: '1px solid rgba(255,255,255,0.05)',
              }}>
                🚘
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontWeight: 800, fontSize: '18px', color: '#fff', marginBottom: '2px' }}>
                  {selectedVehicle?.model || 'TOGG T10X'}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--togg-gray-400)' }}>
                  {selectedVehicle?.plate || '34 TG 1001'}
                </p>
              </div>
            </div>

            {/* Details grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--togg-gray-400)', fontSize: '14px' }}>⏱️ Toplam Süre</span>
                <span style={{ fontWeight: 700, fontSize: '15px', color: '#fff' }}>{totalMinutes} dk</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--togg-gray-400)', fontSize: '14px' }}>🚗 Sürüş</span>
                <span style={{ fontWeight: 600, fontSize: '15px', color: '#fff' }}>{drivingMin} dk × {selectedVehicle?.pricing?.driving || 10} ₺</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--togg-gray-400)', fontSize: '14px' }}>⏸️ Bekleme</span>
                <span style={{ fontWeight: 600, fontSize: '15px', color: '#fff' }}>{waitingMin} dk × {selectedVehicle?.pricing?.waiting || 2} ₺</span>
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '16px', color: '#fff' }}>Toplam Tutar</span>
                <span style={{ fontWeight: 900, fontSize: '24px', color: '#00d4aa' }}>
                  {totalCost.toFixed(2)} ₺
                </span>
              </div>
            </div>
          </div>

          {/* Receipt actions */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-xl)',
          }}>
            <button className="btn btn-secondary" style={{ flex: 1, fontSize: 'var(--font-sm)' }}>
              📄 Fatura
            </button>
            <button className="btn btn-secondary" style={{ flex: 1, fontSize: 'var(--font-sm)' }}>
              📧 E-posta
            </button>
            <button className="btn btn-secondary" style={{ flex: 1, fontSize: 'var(--font-sm)' }}>
              📱 Paylaş
            </button>
          </div>

          {/* Rating */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>
                Sürüşü Değerlendirin
              </h3>
              <p style={{ color: 'var(--togg-gray-400)', fontSize: '14px', marginBottom: '16px' }}>
                Deneyiminizi 1-5 arası puanlayın
              </p>
              <StarRating rating={rating} onRating={setRating} />
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={handleFinish}
              disabled={rating === 0}
              style={{
                opacity: rating > 0 ? 1 : 0.4, pointerEvents: rating > 0 ? 'auto' : 'none',
                fontSize: '16px', fontWeight: 800, padding: '18px', transition: 'opacity 200ms ease',
              }}
            >
              Tamamla ✓
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}
