import { useState } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import { getVehicleImage } from '../data/mockData';
import StatusBar from '../components/StatusBar';
import StarRating from '../components/StarRating';
import AppleEmoji from '../components/AppleEmoji';

const STEPS = { PARK_CHECK: 'park_check', PHOTO_PROOF: 'photo_proof', SUMMARY: 'summary' };

export default function EndDrive() {
  const { navigateTo, selectedVehicle, driveState, resetAll, showToast, user, processPayment } = useApp();
  const [step, setStep] = useState(STEPS.PARK_CHECK);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [rating, setRating] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const defaultCard = user?.cards?.find(c => c.isDefault) || user?.cards?.[0];
  const [selectedPaymentCardId, setSelectedPaymentCardId] = useState(defaultCard?.id);

  const vehicleImg = getVehicleImage(selectedVehicle?.model);
  const drivingRate = selectedVehicle?.pricing?.driving || 10;
  const waitingRate = selectedVehicle?.pricing?.waiting || 2;
  const hasRealData = driveState.elapsedSeconds > 0;
  const totalMinutes = hasRealData ? Math.ceil(driveState.elapsedSeconds / 60) : 12;
  const drivingMinutes = hasRealData ? Math.ceil(driveState.drivingSeconds / 60) : 9;
  const waitingMinutes = hasRealData ? Math.floor(driveState.waitingSeconds / 60) : 3;
  const totalCost = hasRealData ? driveState.totalCostTL : ((9 * drivingRate) + (3 * waitingRate));

  const handleFinish = () => {
    setIsProcessingPayment(true);
    
    setTimeout(() => {
      const result = processPayment(totalCost);
      setIsProcessingPayment(false);
      setShowSuccess(true);
      
      const selectedCard = user.cards.find(c => c.id === selectedPaymentCardId) || user.cards[0];
      
      let msg = 'Ödeme başarıyla alındı!';
      if (result.chargedToBalance > 0 && result.chargedToCard > 0) {
        msg = `${result.chargedToBalance.toFixed(2)}₺ bakiyeden, ${result.chargedToCard.toFixed(2)}₺ karttan (**** ${selectedCard.last4}) çekildi.`;
      } else if (result.chargedToBalance > 0) {
        msg = `${totalCost.toFixed(2)}₺ bakiyeden düşüldü.`;
      } else {
        msg = `${totalCost.toFixed(2)}₺ kartınızdan (**** ${selectedCard.last4}) çekildi.`;
      }
      
      showToast(msg, 'success');
      setTimeout(() => resetAll(), 2500);
    }, 1500);
  };

  // PARK CHECK
  if (step === STEPS.PARK_CHECK) {
    return (
      <div className="screen" style={{
        background: 'var(--togg-navy)',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px',
      }}>
        <StatusBar />
        <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          {/* Vehicle */}
          <div style={{
            width: '160px', height: '110px', borderRadius: '20px', overflow: 'hidden',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <img src={vehicleImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>Park Kontrolü</h1>
            <p style={{ color: 'var(--togg-gray-300)', fontSize: '14px', maxWidth: '300px', lineHeight: 1.6 }}>
              İzin verilen bir park alanında olduğunuzdan emin olun ve motoru kapatın.
            </p>
          </div>

          {/* Warning */}
          <div style={{
            background: 'rgba(255,165,2,0.06)', borderRadius: '14px', padding: '14px',
            maxWidth: '320px', width: '100%', display: 'flex', alignItems: 'flex-start', gap: '10px',
            border: '1px solid rgba(255,165,2,0.15)', textAlign: 'left',
          }}>
            <AppleEmoji symbol="⚠️" size={24} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#ffa502', marginBottom: '2px' }}>Önemli Uyarı</p>
              <p style={{ fontSize: '11px', color: 'var(--togg-gray-400)', lineHeight: 1.5 }}>
                Yasak bölgede park ederseniz ek ücret yansıtılabilir.
              </p>
            </div>
          </div>

          {/* Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '320px' }}>
            {['İzin verilen alandayım', 'Motoru kapattım', 'El frenini çektim'].map((text, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '14px',
                display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(255,255,255,0.04)',
              }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '7px',
                  background: 'rgba(46,213,115,0.15)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0,
                  color: '#2ed573',
                }}>✓</div>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>

          <button className="btn btn-primary btn-lg btn-full" onClick={() => setStep(STEPS.PHOTO_PROOF)}
            style={{ maxWidth: '320px', borderRadius: '16px', fontWeight: 800 }}>
            Onaylıyorum, Devam Et
          </button>
        </div>
      </div>
    );
  }

  // PHOTO PROOF
  if (step === STEPS.PHOTO_PROOF) {
    return (
      <div className="screen" style={{ background: 'var(--togg-navy)' }}>
        <StatusBar />
        <div style={{ padding: '24px 20px 20px' }}>
          <button onClick={() => setStep(STEPS.PARK_CHECK)} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px', width: '40px', height: '40px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', cursor: 'pointer',
          }}>←</button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px' }}>
          <div className="animate-fadeInUp" style={{ textAlign: 'center', width: '100%' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Fotoğraf Kanıtı</h1>
            <p style={{ color: 'var(--togg-gray-400)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
              Park halindeki aracın çevresini gösterecek şekilde bir fotoğraf çekin
            </p>

            <button onClick={() => { setPhotoTaken(true); showToast('Fotoğraf kaydedildi', 'success'); }} style={{
              width: '100%', maxWidth: '320px', aspectRatio: '4/3', borderRadius: '20px',
              background: photoTaken ? 'rgba(46,213,115,0.06)' : 'rgba(255,255,255,0.03)',
              border: `2px dashed ${photoTaken ? 'rgba(46,213,115,0.4)' : 'rgba(255,255,255,0.1)'}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '12px', cursor: 'pointer', transition: 'all 300ms ease', color: '#fff', margin: '0 auto',
            }}>
              {photoTaken ? (
                <>
                  <img src={vehicleImg} alt="" style={{ height: '80px', objectFit: 'contain', opacity: 0.8 }} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#2ed573' }}>Fotoğraf çekildi ✓</span>
                </>
              ) : (
                <>
                  <AppleEmoji symbol="📷" size={48} />
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--togg-gray-400)' }}>
                    Fotoğraf çekmek için dokunun
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        <div style={{ padding: '20px 20px 40px' }}>
          <button className="btn btn-primary btn-lg btn-full" onClick={() => setStep(STEPS.SUMMARY)}
            style={{
              opacity: photoTaken ? 1 : 0.3, pointerEvents: photoTaken ? 'auto' : 'none',
              borderRadius: '16px', fontWeight: 800,
            }}>
            Fotoğrafı Gönder
          </button>
        </div>
      </div>
    );
  }

  // SUCCESS
  if (showSuccess) {
    return (
      <div className="screen" style={{
        background: 'var(--togg-navy)', justifyContent: 'center',
        alignItems: 'center', textAlign: 'center', padding: '20px',
      }}>
        <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ animation: 'float 2s ease-in-out infinite' }}><AppleEmoji symbol="🎉" size={72} /></div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#2ed573' }}>Teşekkürler!</h1>
          <p style={{ color: 'var(--togg-gray-300)', fontSize: '14px' }}>Haritaya yönlendiriliyorsunuz...</p>
        </div>
      </div>
    );
  }

  // SUMMARY
  return (
    <div className="screen" style={{ background: 'var(--togg-navy)' }}>
      <StatusBar />

      <div style={{ flex: 1, padding: '12px 20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div className="animate-fadeInUp">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(0,212,170,0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 10px', border: '1px solid rgba(0,212,170,0.15)',
            }}><AppleEmoji symbol="🏁" size={32} /></div>
            <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Sürüş Özeti</h1>
          </div>

          {/* Reassuring Provision Refund Alert */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(46,213,115,0.1) 0%, rgba(0,212,170,0.05) 100%)',
            border: '1.5px solid rgba(46,213,115,0.3)',
            borderRadius: '16px',
            padding: '14px 18px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ fontSize: '26px' }}>🔓</div>
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#2ed573', marginBottom: '2px' }}>Provizyon İadesi Başlatıldı</h4>
              <p style={{ fontSize: '11px', color: 'var(--togg-gray-300)', lineHeight: '1.4' }}>
                Kartınızdaki <strong>5.000 TL</strong> provizyon blokajı kaldırılmıştır. 1-3 iş günü içinde hesabınıza yansıyacaktır.
              </p>
            </div>
          </div>

          {/* Vehicle card */}
          <div style={{
            background: 'rgba(255,255,255,0.04)', borderRadius: '18px',
            padding: '16px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.04)',
          }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px',
              paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{
                width: '90px', height: '60px', borderRadius: '12px', overflow: 'hidden',
                background: 'rgba(255,255,255,0.03)',
              }}>
                <img src={vehicleImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '16px' }}>{selectedVehicle?.model || 'TOGG T10X'}</h3>
                <p style={{ fontSize: '12px', color: 'var(--togg-gray-400)' }}>{selectedVehicle?.plate || '34 TG 1001'}</p>
              </div>
            </div>

            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Toplam Süre', value: `${totalMinutes} dakika`, icon: '⏱️' },
                { label: 'Sürüş Süresi', value: `${drivingMinutes} dk × ${drivingRate} ₺`, icon: '🚗' },
                { label: 'Bekleme Süresi', value: `${waitingMinutes} dk × ${waitingRate} ₺`, icon: '⏸️' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--togg-gray-400)', fontSize: '13px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <AppleEmoji symbol={row.icon} size={16} /> {row.label}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{row.value}</span>
                </div>
              ))}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '16px' }}>Toplam Tutar</span>
                <span style={{
                  fontWeight: 900, fontSize: '26px',
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  {totalCost.toFixed(2)} ₺
                </span>
              </div>
            </div>
          </div>

          {/* ECO Gamification Box */}
          <div className="animate-fadeInUp" style={{
            background: 'linear-gradient(135deg, rgba(46,213,115,0.15), rgba(0,212,170,0.05))',
            borderRadius: '18px', padding: '16px', marginBottom: '16px',
            border: '1px solid rgba(46,213,115,0.25)', position: 'relative', overflow: 'hidden',
            animationDelay: '100ms'
          }}>
            <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1, transform: 'rotate(15deg)' }}><AppleEmoji symbol="🌍" size={80} /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px', position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(46,213,115,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}><AppleEmoji symbol="🌱" size={24} /></div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#2ed573', marginBottom: '2px' }}>Doğa Dostu Sürüş</h3>
                <p style={{ fontSize: '12px', color: 'var(--togg-gray-200)', lineHeight: 1.4 }}>
                  Tebrikler! Elektrikli TOGG ile <strong>{(totalMinutes * 0.18).toFixed(1)} kg CO₂</strong> salınımını önlediniz.
                </p>
              </div>
            </div>
            
            {/* Gamified visual progress bar */}
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '14px' }}>
              <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #2ed573, #00d4aa)', borderRadius: '4px' }} />
            </div>

            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.25)', 
              padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' 
            }}>
              <AppleEmoji symbol="🏆" size={18} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--togg-white)' }}>
                Kazanılan Rozet: <span style={{ color: '#00d4aa' }}>Sıfır Emisyon Elçisi</span>
              </span>
            </div>
          </div>
          
          {/* Payment Method Details */}
          <div style={{
            background: 'rgba(0,212,170,0.05)', borderRadius: '16px',
            padding: '16px', marginBottom: '16px', border: '1px solid rgba(0,212,170,0.1)',
          }}>
            <h3 style={{ fontSize: '13px', color: 'var(--togg-gray-300)', marginBottom: '12px' }}>Ödeme Yöntemi</h3>
            
            {user.balance >= totalCost ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,212,170,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AppleEmoji symbol="💰" size={16} /></div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>Cüzdan Bakiyesi</div>
                    <div style={{ fontSize: '11px', color: 'var(--togg-teal)' }}>Mevcut: {user.balance.toFixed(2)} ₺</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--togg-teal)' }}>-{totalCost.toFixed(2)} ₺</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {user.balance > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,212,170,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AppleEmoji symbol="💰" size={16} /></div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>Cüzdan Bakiyesi</div>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--togg-teal)' }}>-{user.balance.toFixed(2)} ₺</div>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AppleEmoji symbol="💳" size={16} /></div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>Kredi Kartı</div>
                      <div style={{ fontSize: '11px', color: 'var(--togg-gray-400)' }}>
                        **** **** **** {user.cards.find(c => c.id === selectedPaymentCardId)?.last4 || user.cards[0].last4}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>-{(totalCost - user.balance > 0 ? totalCost - user.balance : totalCost).toFixed(2)} ₺</div>
                </div>

                {/* Card Selection */}
                <div style={{ marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--togg-gray-400)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                    Ödeme Yapılacak Kartı Seçin
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {user.cards.map((card) => (
                      <div 
                        key={card.id}
                        onClick={() => setSelectedPaymentCardId(card.id)}
                        style={{
                          background: selectedPaymentCardId === card.id ? 'rgba(0, 212, 170, 0.08)' : 'rgba(255,255,255,0.03)',
                          border: `1.5px solid ${selectedPaymentCardId === card.id ? 'var(--togg-teal)' : 'rgba(255,255,255,0.06)'}`,
                          borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px',
                          cursor: 'pointer', transition: 'all 200ms ease'
                        }}
                      >
                        <div style={{ fontSize: '14px' }}>💳</div>
                        <div style={{ flex: 1, fontSize: '12px', fontWeight: 600 }}>
                          •••• •••• •••• {card.last4} ({card.type})
                        </div>
                        {selectedPaymentCardId === card.id && (
                          <div style={{ color: 'var(--togg-teal)', fontSize: '12px', fontWeight: 800 }}>✓</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {['📄 Fatura', '📧 E-posta', '📱 Paylaş'].map((label, i) => (
              <button key={i} style={{
                flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px', padding: '12px 8px', color: '#fff',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              }}>{label}</button>
            ))}
          </div>

          {/* Rating */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>Sürüşü Değerlendirin</h3>
            <p style={{ color: 'var(--togg-gray-400)', fontSize: '13px', marginBottom: '14px' }}>
              Deneyiminizi 1-5 arası puanlayın
            </p>
            <StarRating rating={rating} onRatingChange={setRating} />
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 20px 36px' }}>
        <button 
          className="btn btn-primary btn-lg btn-full" 
          onClick={handleFinish}
          disabled={isProcessingPayment}
          style={{ 
            borderRadius: '16px', fontWeight: 800,
            opacity: isProcessingPayment ? 0.7 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
        >
          {isProcessingPayment ? (
            <>
              <div className="animate-spin" style={{ width: '18px', height: '18px', border: '2px solid #0a0f1e', borderTopColor: 'transparent', borderRadius: '50%' }} />
              Ödeme Alınıyor...
            </>
          ) : (
            'Ödemeyi Tamamla'
          )}
        </button>
      </div>
    </div>
  );
}
