import { useState } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import StatusBar from '../components/StatusBar';

export default function Wallet() {
  const { navigateTo, user, addBalance, showToast } = useApp();
  const [showTopUp, setShowTopUp] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTopUp = (amount) => {
    setIsProcessing(true);
    setTimeout(() => {
      addBalance(amount);
      setIsProcessing(false);
      setShowTopUp(false);
      showToast(`${amount} ₺ bakiye yüklendi`, 'success');
    }, 1500);
  };

  return (
    <div className="screen" style={{ background: 'var(--togg-navy)' }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigateTo(APP_STATES.MAP)} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px', width: '40px', height: '40px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', cursor: 'pointer',
        }}>←</button>
        <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Cüzdanım</h1>
      </div>

      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div className="animate-fadeInUp">
          
          {/* Balance Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,212,170,0.15), rgba(79,172,254,0.1))',
            borderRadius: '24px', padding: '24px', marginBottom: '24px',
            border: '1px solid rgba(0,212,170,0.2)', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(0,212,170,0.2)', filter: 'blur(30px)', borderRadius: '50%' }} />
            
            <p style={{ color: 'var(--togg-teal)', fontSize: '13px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Mevcut Bakiye
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '20px' }}>
              <span style={{ fontSize: '48px', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
                {user.balance.toFixed(2)}
              </span>
              <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--togg-teal)' }}>₺</span>
            </div>
            
            <button onClick={() => setShowTopUp(true)} style={{
              background: 'var(--togg-teal)', color: '#0a0f1e', border: 'none',
              borderRadius: '14px', padding: '14px 20px', fontWeight: 800, fontSize: '15px',
              width: '100%', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,212,170,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}>
              <span style={{ fontSize: '18px' }}>+</span> Bakiye Yükle
            </button>
          </div>

          {/* TOGG Premium Subscription */}
          <div className="animate-fadeInUp" style={{
            background: 'linear-gradient(135deg, rgba(20, 30, 60, 0.9), rgba(10, 15, 30, 0.9))',
            borderRadius: '24px', padding: '20px', marginBottom: '20px',
            border: '1px solid rgba(79,172,254,0.3)', position: 'relative', overflow: 'hidden',
            animationDelay: '100ms'
          }}>
            <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '100px', opacity: 0.05, transform: 'rotate(-15deg)' }}>💎</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="brand-glow-sm">Tur At</span> Premium
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--togg-gray-300)', marginTop: '4px', maxWidth: '200px', lineHeight: 1.4 }}>
                  Tüm kiralama sürelerinde anında <strong>%20 İndirim</strong> ve ücretsiz rezervasyon ayrıcalığı.
                </p>
              </div>
              <div style={{ background: 'rgba(79,172,254,0.15)', color: '#4facfe', padding: '6px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 800 }}>AYLIK 149₺</div>
            </div>
            <button onClick={() => showToast('Premium üyeliğiniz başlatıldı! 🎉', 'success')} style={{
              background: 'linear-gradient(135deg, #4facfe, #00f2fe)', color: '#0a0f1e', border: 'none',
              borderRadius: '14px', padding: '14px', fontWeight: 800, fontSize: '14px', width: '100%',
              cursor: 'pointer', boxShadow: '0 6px 20px rgba(79,172,254,0.25)', position: 'relative', zIndex: 1
            }}>
              Ayrıcalıklara Katıl 🚀
            </button>
          </div>

          {/* Refer a Friend */}
          <div className="animate-fadeInUp" style={{
            background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '16px', marginBottom: '28px',
            border: '1px dashed rgba(46,213,115,0.3)', display: 'flex', alignItems: 'center', gap: '16px',
            animationDelay: '200ms'
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(46,213,115,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0
            }}>🎁</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>Arkadaşını Davet Et</h3>
              <p style={{ fontSize: '12px', color: 'var(--togg-gray-300)', lineHeight: 1.4 }}>
                Kodunu paylaş, her iki taraf da <strong style={{ color: '#2ed573' }}>150₺</strong> sürüş bakiyesi kazansın.
              </p>
            </div>
            <button onClick={() => showToast('Davet kodu kopyalandı: TURAT26', 'success')} style={{
              background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '12px', width: '40px', height: '40px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer',
              flexShrink: 0, fontSize: '18px'
            }}>🔗</button>
          </div>

          {/* Saved Cards */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'var(--togg-gray-300)' }}>
              Kayıtlı Kartlarım
            </h3>
            
            {user.cards.map((card, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px',
                marginBottom: '12px',
              }}>
                <div style={{
                  width: '48px', height: '36px', borderRadius: '6px', background: '#1a1f33',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{ display: 'flex', gap: '-4px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#eb001b', opacity: 0.9 }} />
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#f79e1b', opacity: 0.9, marginLeft: '-6px' }} />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '15px', color: '#fff', marginBottom: '2px' }}>
                    •••• •••• •••• {card.last4}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--togg-gray-400)' }}>
                    {card.type} {card.isDefault && '· Varsayılan'}
                  </p>
                </div>
                {card.isDefault && (
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(46,213,115,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2ed573', fontSize: '12px' }}>
                    ✓
                  </div>
                )}
              </div>
            ))}

            <button onClick={() => showToast('Yeni kart ekleme ekranı yakında eklenecek', 'info')} style={{
              background: 'transparent', border: '2px dashed rgba(255,255,255,0.1)',
              borderRadius: '16px', padding: '16px', color: 'var(--togg-gray-300)',
              width: '100%', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}>
              <span>+</span> Yeni Kart Ekle
            </button>
          </div>

        </div>
      </div>

      {/* Top Up Bottom Sheet */}
      <div className={`bottom-sheet ${showTopUp ? 'active' : ''}`} style={{ zIndex: 1000, padding: '0' }}>
        <div style={{ padding: '20px' }}>
          <div className="bottom-sheet-handle" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Bakiye Yükle</h2>
            <button onClick={() => !isProcessing && setShowTopUp(false)} style={{
              background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '8px', width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer'
            }}>✕</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            {[50, 100, 250, 500].map((amount) => (
              <button
                key={amount}
                onClick={() => handleTopUp(amount)}
                disabled={isProcessing}
                style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px', padding: '20px 0', color: '#fff', fontWeight: 700, fontSize: '18px',
                  cursor: isProcessing ? 'default' : 'pointer', transition: 'all 200ms ease',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                }}
              >
                <span>{amount} ₺</span>
                {amount >= 250 && <span style={{ fontSize: '11px', color: 'var(--togg-teal)', fontWeight: 600 }}>+%5 Bonus</span>}
              </button>
            ))}
          </div>

          {isProcessing && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--togg-teal)', fontWeight: 600 }}>
              <div className="animate-spin" style={{ width: '20px', height: '20px', border: '2px solid var(--togg-teal)', borderTopColor: 'transparent', borderRadius: '50%' }} />
              İşlem yapılıyor...
            </div>
          )}
        </div>
      </div>
      <div className={`bottom-sheet-overlay ${showTopUp ? 'active' : ''}`} onClick={() => !isProcessing && setShowTopUp(false)} style={{ zIndex: 999 }} />
    </div>
  );
}
