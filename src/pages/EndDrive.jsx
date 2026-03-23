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
  const { navigateTo, selectedVehicle, driveState, resetAll, showToast } = useApp();
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-xl)',
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(255, 165, 2, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '56px',
          }}>
            🅿️
          </div>

          <div>
            <h1 style={{
              fontSize: 'var(--font-2xl)',
              fontWeight: 800,
              marginBottom: 'var(--space-sm)',
            }}>
              Park Kontrolü
            </h1>
            <p style={{
              color: 'var(--togg-gray-300)',
              fontSize: 'var(--font-base)',
              maxWidth: '300px',
              lineHeight: 1.6,
            }}>
              İzin verilen bir park alanında olduğunuzdan emin olun ve motoru kapatın.
            </p>
          </div>

          {/* Warning card */}
          <div className="glass-card" style={{
            padding: 'var(--space-md)',
            maxWidth: '320px',
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-sm)',
            border: '1px solid rgba(255, 165, 2, 0.3)',
          }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <div>
              <p style={{
                fontSize: 'var(--font-sm)',
                fontWeight: 600,
                color: 'var(--togg-orange)',
                marginBottom: '4px',
              }}>
                Önemli Uyarı
              </p>
              <p style={{
                fontSize: 'var(--font-xs)',
                color: 'var(--togg-gray-400)',
                lineHeight: 1.5,
              }}>
                Yasak bölgede park ederseniz ek ücret yansıtılabilir. Haritadaki yeşil bölgeleri tercih edin.
              </p>
            </div>
          </div>

          {/* Checklist */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-sm)',
            width: '100%',
            maxWidth: '320px',
          }}>
            {[
              { text: 'İzin verilen alandayım', icon: '✅' },
              { text: 'Motoru kapattım', icon: '🔑' },
              { text: 'El frenini çektim', icon: '🅿️' },
            ].map((item, i) => (
              <div key={i} className="glass-card" style={{
                padding: 'var(--space-md)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
              }}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span style={{ fontSize: 'var(--font-sm)', fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
          </div>

          <button
            className="btn btn-primary btn-lg btn-full"
            onClick={handleParkConfirm}
            style={{ maxWidth: '320px' }}
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
          <div className="animate-fadeInUp" style={{
            textAlign: 'center',
            width: '100%',
          }}>
            <h1 style={{
              fontSize: 'var(--font-2xl)',
              fontWeight: 800,
              marginBottom: 'var(--space-sm)',
            }}>
              Fotoğraf Kanıtı
            </h1>
            <p style={{
              color: 'var(--togg-gray-400)',
              fontSize: 'var(--font-base)',
              marginBottom: 'var(--space-xl)',
              lineHeight: 1.6,
            }}>
              Park halindeki aracın çevresini gösterecek şekilde bir fotoğraf çekin
            </p>

            {/* Camera area */}
            <button
              onClick={handleTakePhoto}
              style={{
                width: '100%',
                maxWidth: '320px',
                aspectRatio: '4/3',
                borderRadius: 'var(--radius-lg)',
                background: photoTaken
                  ? 'linear-gradient(135deg, rgba(46,213,115,0.1), rgba(0,212,170,0.1))'
                  : 'var(--togg-navy-mid)',
                border: `2px dashed ${photoTaken ? 'var(--togg-green)' : 'var(--togg-gray-400)'}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-md)',
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
                color: 'var(--togg-white)',
                margin: '0 auto',
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
        <div className="animate-fadeInUp">
          {/* Success header */}
          <div style={{
            textAlign: 'center',
            marginBottom: 'var(--space-xl)',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(0, 212, 170, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              margin: '0 auto var(--space-md)',
            }}>
              🏁
            </div>
            <h1 style={{
              fontSize: 'var(--font-2xl)',
              fontWeight: 800,
            }}>
              Sürüş Özeti
            </h1>
          </div>

          {/* Summary Card */}
          <div className="glass-card" style={{
            padding: 'var(--space-lg)',
            marginBottom: 'var(--space-lg)',
          }}>
            {/* Vehicle info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
              paddingBottom: 'var(--space-md)',
              borderBottom: '1px solid var(--glass-border)',
              marginBottom: 'var(--space-md)',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--togg-navy-mid)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}>
                🚘
              </div>
              <div>
                <h3 style={{ fontWeight: 700 }}>
                  {selectedVehicle?.model || 'TOGG T10X'}
                </h3>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--togg-gray-400)' }}>
                  {selectedVehicle?.plate || '34 TG 1001'}
                </p>
              </div>
            </div>

            {/* Details grid */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-md)',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ color: 'var(--togg-gray-400)', fontSize: 'var(--font-sm)' }}>
                  ⏱️ Toplam Süre
                </span>
                <span style={{ fontWeight: 700, fontSize: 'var(--font-lg)' }}>
                  {totalMinutes} dakika
                </span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ color: 'var(--togg-gray-400)', fontSize: 'var(--font-sm)' }}>
                  🚗 Sürüş Süresi
                </span>
                <span style={{ fontWeight: 600 }}>
                  {drivingMin} dk × {selectedVehicle?.pricing?.driving || 10} ₺
                </span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ color: 'var(--togg-gray-400)', fontSize: 'var(--font-sm)' }}>
                  ⏸️ Bekleme Süresi
                </span>
                <span style={{ fontWeight: 600 }}>
                  {waitingMin} dk × {selectedVehicle?.pricing?.waiting || 2} ₺
                </span>
              </div>

              <div style={{
                height: '1px',
                background: 'var(--glass-border)',
              }} />

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{
                  fontWeight: 700,
                  fontSize: 'var(--font-lg)',
                }}>
                  Toplam Tutar
                </span>
                <span style={{
                  fontWeight: 900,
                  fontSize: 'var(--font-2xl)',
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
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
          <div style={{
            textAlign: 'center',
            marginBottom: 'var(--space-lg)',
          }}>
            <h3 style={{
              fontSize: 'var(--font-lg)',
              fontWeight: 700,
              marginBottom: 'var(--space-sm)',
            }}>
              Sürüşü Değerlendirin
            </h3>
            <p style={{
              color: 'var(--togg-gray-400)',
              fontSize: 'var(--font-sm)',
              marginBottom: 'var(--space-md)',
            }}>
              Deneyiminizi 1-5 arası puanlayın
            </p>
            <StarRating onRate={setRating} />
          </div>
        </div>
      </div>

      {/* Finish button */}
      <div style={{ padding: '0 var(--space-lg) var(--space-2xl)' }}>
        <button
          className="btn btn-primary btn-lg btn-full"
          onClick={handleFinish}
        >
          Tamamla ✓
        </button>
      </div>
    </div>
  );
}
