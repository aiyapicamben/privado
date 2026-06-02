import { useState, useEffect } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import StatusBar from '../components/StatusBar';

export default function Wallet() {
  const { navigateTo, user, setUser, addBalance, showToast } = useApp();
  const [showTopUp, setShowTopUp] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);

  const defaultCard = user.cards.find(c => c.isDefault) || user.cards[0];
  const [selectedTopUpCardId, setSelectedTopUpCardId] = useState(defaultCard?.id);
  const [selectedTopUpAmount, setSelectedTopUpAmount] = useState(100);

  // Sync selected card when top up sheet opens
  useEffect(() => {
    if (showTopUp) {
      const activeCard = user.cards.find(c => c.isDefault) || user.cards[0];
      setSelectedTopUpCardId(activeCard?.id);
    }
  }, [showTopUp, user.cards]);

  const [cardForm, setCardForm] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: ''
  });

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleTopUp = (amount) => {
    setIsProcessing(true);
    
    // Apply marketing bonus credits
    let bonus = 0;
    if (amount === 250) bonus = 12.5; // +5% Bonus
    else if (amount === 500) bonus = 25; // +5% Bonus
    
    const totalToAdded = amount + bonus;

    setTimeout(() => {
      addBalance(totalToAdded);
      setIsProcessing(false);
      setShowTopUp(false);
      if (bonus > 0) {
        showToast(`${amount} ₺ + ${bonus} ₺ Hediye bakiye yüklendi! 🎉`, 'success');
      } else {
        showToast(`${amount} ₺ bakiye yüklendi`, 'success');
      }
    }, 1500);
  };

  const saveNewCard = (e) => {
    e.preventDefault();
    const cleanNum = cardForm.number.replace(/\s+/g, '');
    if (cleanNum.length < 16) {
      showToast('Lütfen geçerli bir kart numarası girin', 'error');
      return;
    }
    if (cardForm.expiry.length < 5) {
      showToast('Lütfen son kullanma tarihini girin (AA/YY)', 'error');
      return;
    }
    if (cardForm.cvv.length < 3) {
      showToast('Lütfen CVV kodunu girin', 'error');
      return;
    }
    if (!cardForm.holder.trim()) {
      showToast('Lütfen kart sahibinin adını girin', 'error');
      return;
    }

    setIsAddingCard(true);
    setTimeout(() => {
      const last4 = cleanNum.slice(-4);
      const cardType = cleanNum.startsWith('4') ? 'Visa' : cleanNum.startsWith('5') ? 'Mastercard' : 'Troy';
      const newCardId = Date.now();
      
      setUser(prev => ({
        ...prev,
        cards: [...prev.cards, { 
          id: newCardId, 
          type: cardType, 
          last4: last4, 
          isDefault: prev.cards.length === 0 
        }]
      }));

      setIsAddingCard(false);
      setShowAddCard(false);
      setCardForm({ number: '', holder: '', expiry: '', cvv: '' });
      showToast('Yeni kartınız başarıyla güvenle kaydedildi! 💳', 'success');
    }, 1800);
  };

  const handleSelectCard = (cardId) => {
    setUser(prev => ({
      ...prev,
      cards: prev.cards.map(c => ({
        ...c,
        isDefault: c.id === cardId
      }))
    }));
    showToast('Varsayılan kartınız güncellendi', 'success');
  };

  return (
    <div className="screen" style={{ background: 'var(--togg-navy)' }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '24px 20px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                  <span className="brand-glow-sm">Turla</span> Premium
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
            <button onClick={() => showToast('Davet kodu kopyalandı: TURLA26', 'success')} style={{
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
              <div 
                key={i} 
                onClick={() => handleSelectCard(card.id)}
                style={{
                  background: card.isDefault ? 'rgba(0, 212, 170, 0.04)' : 'rgba(255,255,255,0.03)',
                  border: card.isDefault ? '1px solid var(--togg-teal)' : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px',
                  marginBottom: '12px', cursor: 'pointer', transition: 'all 200ms ease',
                }}
              >
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

            <button onClick={() => setShowAddCard(true)} style={{
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

          {/* Card Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', color: 'var(--togg-gray-400)', fontWeight: 600, display: 'block', marginBottom: '10px' }}>
              Ödeme Yapılacak Kart
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {user.cards.map((card) => (
                <div 
                  key={card.id}
                  onClick={() => setSelectedTopUpCardId(card.id)}
                  style={{
                    background: selectedTopUpCardId === card.id ? 'rgba(0, 212, 170, 0.08)' : 'rgba(255,255,255,0.03)',
                    border: `1.5px solid ${selectedTopUpCardId === card.id ? 'var(--togg-teal)' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px',
                    cursor: 'pointer', transition: 'all 200ms ease'
                  }}
                >
                  <div style={{ fontSize: '16px' }}>💳</div>
                  <div style={{ flex: 1, fontSize: '13px', fontWeight: 600 }}>
                    •••• •••• •••• {card.last4} ({card.type})
                  </div>
                  {selectedTopUpCardId === card.id && (
                    <div style={{ color: 'var(--togg-teal)', fontSize: '14px', fontWeight: 800 }}>✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <label style={{ fontSize: '12px', color: 'var(--togg-gray-400)', fontWeight: 600, display: 'block', marginBottom: '10px' }}>
            Yüklenecek Tutar
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            {[50, 100, 250, 500].map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setSelectedTopUpAmount(amount)}
                disabled={isProcessing}
                style={{
                  background: selectedTopUpAmount === amount ? 'rgba(0,212,170,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${selectedTopUpAmount === amount ? 'var(--togg-teal)' : 'rgba(255,255,255,0.08)'}`,
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

          <button 
            onClick={() => handleTopUp(selectedTopUpAmount)}
            disabled={isProcessing || !selectedTopUpCardId}
            style={{
              background: 'var(--togg-teal)', color: '#0a0f1e', border: 'none',
              borderRadius: '14px', padding: '16px', fontWeight: 800, fontSize: '15px',
              width: '100%', cursor: (isProcessing || !selectedTopUpCardId) ? 'default' : 'pointer',
              boxShadow: '0 8px 24px rgba(0,212,170,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              marginTop: '10px'
            }}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin" style={{ width: '18px', height: '18px', border: '2px solid #0a0f1e', borderTopColor: 'transparent', borderRadius: '50%' }} />
                İşlem Yapılıyor...
              </>
            ) : (
              `Öde ve Yükle (${selectedTopUpAmount} ₺)`
            )}
          </button>

          {isProcessing && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--togg-teal)', fontWeight: 600 }}>
              <div className="animate-spin" style={{ width: '20px', height: '20px', border: '2px solid var(--togg-teal)', borderTopColor: 'transparent', borderRadius: '50%' }} />
              İşlem yapılıyor...
            </div>
          )}
        </div>
      </div>
      <div className={`bottom-sheet-overlay ${showTopUp ? 'active' : ''}`} onClick={() => !isProcessing && setShowTopUp(false)} style={{ zIndex: 999 }} />

      {/* Add Card Bottom Sheet */}
      <div className={`bottom-sheet ${showAddCard ? 'active' : ''}`} style={{ zIndex: 1000, padding: '0' }}>
        <div style={{ padding: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
          <div className="bottom-sheet-handle" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Yeni Kart Ekle</h2>
            <button onClick={() => !isAddingCard && setShowAddCard(false)} style={{
              background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '8px', width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer'
            }}>✕</button>
          </div>

          {/* Virtual Card Preview */}
          <div style={{
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            borderRadius: '16px',
            padding: '20px',
            color: '#fff',
            marginBottom: '20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '160px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Card Mesh Glow */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 80% 20%, rgba(0,212,170,0.2) 0%, transparent 60%)', pointerEvents: 'none' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>Kredi Kartı</span>
                <span style={{ fontWeight: 800, fontSize: '14px', marginTop: '2px' }}>TURLA PAY</span>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: 'rgba(255,255,255,0.8)' }}>
                {cardForm.number.replace(/\s+/g, '').startsWith('4') ? 'Visa' : cardForm.number.replace(/\s+/g, '').startsWith('5') ? 'Mastercard' : 'Troy'}
              </div>
            </div>

            {/* Glowing Chip */}
            <div style={{
              width: '32px', height: '24px', borderRadius: '4px',
              background: 'linear-gradient(135deg, #f1c40f, #f39c12)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 0 8px rgba(241,196,15,0.4)',
              zIndex: 1,
            }} />

            <div style={{ zIndex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '2px', fontFamily: 'monospace', marginBottom: '8px' }}>
                {cardForm.number || '•••• •••• •••• ••••'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>KART SAHİBİ</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {cardForm.holder || 'AD SOYAD'}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>S.K.T</span>
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>
                    {cardForm.expiry || 'AA/YY'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={saveNewCard} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--togg-gray-400)', fontWeight: 600 }}>Kart Sahibi Adı</label>
              <input
                type="text"
                required
                placeholder="Örn. AHMET YILMAZ"
                value={cardForm.holder}
                onChange={(e) => setCardForm(prev => ({ ...prev, holder: e.target.value.toUpperCase() }))}
                style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px', padding: '14px', color: '#fff', fontSize: '14px', outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--togg-gray-400)', fontWeight: 600 }}>Kart Numarası</label>
              <input
                type="text"
                required
                maxLength="19"
                placeholder="0000 0000 0000 0000"
                value={cardForm.number}
                onChange={(e) => setCardForm(prev => ({ ...prev, number: formatCardNumber(e.target.value) }))}
                style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px', padding: '14px', color: '#fff', fontSize: '14px', outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: 'var(--togg-gray-400)', fontWeight: 600 }}>Son Kullanma</label>
                <input
                  type="text"
                  required
                  maxLength="5"
                  placeholder="AA/YY"
                  value={cardForm.expiry}
                  onChange={(e) => setCardForm(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                  style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px', padding: '14px', color: '#fff', fontSize: '14px', outline: 'none', textAlign: 'center'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: 'var(--togg-gray-400)', fontWeight: 600 }}>CVC / CVV</label>
                <input
                  type="password"
                  required
                  maxLength="3"
                  placeholder="•••"
                  value={cardForm.cvv}
                  onChange={(e) => setCardForm(prev => ({ ...prev, cvv: e.target.value.replace(/[^0-9]/gi, '') }))}
                  style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px', padding: '14px', color: '#fff', fontSize: '14px', outline: 'none', textAlign: 'center'
                  }}
                />
              </div>
            </div>

            <button type="submit" disabled={isAddingCard} style={{
              background: 'var(--togg-teal)', color: '#0a0f1e', border: 'none',
              borderRadius: '14px', padding: '16px', fontWeight: 800, fontSize: '15px',
              width: '100%', cursor: isAddingCard ? 'default' : 'pointer', marginTop: '10px',
              boxShadow: '0 8px 24px rgba(0,212,170,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
            }}>
              {isAddingCard ? (
                <>
                  <div className="animate-spin" style={{ width: '18px', height: '18px', border: '2px solid #0a0f1e', borderTopColor: 'transparent', borderRadius: '50%' }} />
                  Kaydediliyor...
                </>
              ) : (
                'Kartı Güvenle Kaydet 🔒'
              )}
            </button>
          </form>
        </div>
      </div>
      <div className={`bottom-sheet-overlay ${showAddCard ? 'active' : ''}`} onClick={() => !isAddingCard && setShowAddCard(false)} style={{ zIndex: 999 }} />
    </div>
  );
}
