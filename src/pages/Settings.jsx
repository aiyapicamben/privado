import { useState } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import StatusBar from '../components/StatusBar';

export default function Settings() {
  const { navigateTo, user, showToast, setUser, tripHistory } = useApp();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('tr');
  const [activeSheet, setActiveSheet] = useState(null);

  // Profile Form States
  const [profileForm, setProfileForm] = useState({
    name: user.name || 'Kullanıcı',
    phone: user.phone || '',
    email: user.email || ''
  });
  
  // Canlı Destek States
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Merhaba! Turla Destek Merkezine hoş geldiniz. Size nasıl yardımcı olabilirim?' }
  ]);

  // SSS States
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);

  // App Rating States
  const [appRating, setAppRating] = useState(0);
  const [appRatingComment, setAppRatingComment] = useState('');

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      let reply = 'Sorunuz ekiplerimize iletildi, size en kısa sürede yardımcı olacağız. 🛠️';
      if (userMsg.toLowerCase().includes('provizyon') || userMsg.toLowerCase().includes('iade')) {
        reply = 'Provizyon iade süreçleri sürüş bittiği an başlar ve bankanıza bağlı olarak 1-3 iş günü içinde yansır.';
      } else if (userMsg.toLowerCase().includes('hasar') || userMsg.toLowerCase().includes('kaza')) {
        reply = 'Kaza veya hasar durumlarında lütfen aracın fotoğraflarını çekin ve Sigorta & Güvence sayfasındaki Hasar Bildir kısmından sisteme yükleyin.';
      } else if (userMsg.toLowerCase().includes('şarj') || userMsg.toLowerCase().includes('trugo')) {
        reply = 'TOGG araçlarımızı Trugo istasyonlarında ücretsiz şarj edebilirsiniz. Şarj ödemesi sistemimiz tarafından otomatik yapılır.';
      }
      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 1000);
  };

  const handleLogout = () => {
    showToast('Çıkış yapıldı. Hoşça kalın!', 'info');
    setTimeout(() => navigateTo(APP_STATES.WELCOME), 800);
  };

  const handleDeleteAccount = () => {
    showToast('Hesabınız kalıcı olarak silindi.', 'success');
    setShowDeleteConfirm(false);
    setTimeout(() => navigateTo(APP_STATES.WELCOME), 1200);
  };

  const settingsSections = [
    {
      title: language === 'tr' ? 'Hesap' : 'Account',
      items: [
        {
          icon: '👤', label: language === 'tr' ? 'Profil Bilgileri' : 'Profile Information',
          subtitle: user.name || (user.phone || '+90 5XX XXX XX XX'),
          action: () => setActiveSheet('profile'),
          arrow: true,
        },
        {
          icon: '🔔', label: language === 'tr' ? 'Bildirimler' : 'Notifications',
          subtitle: notifications ? (language === 'tr' ? 'Açık' : 'On') : (language === 'tr' ? 'Kapalı' : 'Off'),
          toggle: true,
          toggleValue: notifications,
          onToggle: () => {
            setNotifications(!notifications);
            showToast(!notifications ? (language === 'tr' ? 'Bildirimler açıldı' : 'Notifications enabled') : (language === 'tr' ? 'Bildirimler kapatıldı' : 'Notifications disabled'), 'info');
          }
        },
        {
          icon: '🌙', label: language === 'tr' ? 'Karanlık Mod' : 'Dark Mode',
          subtitle: language === 'tr' ? 'Her zaman açık' : 'Always on',
          toggle: true,
          toggleValue: darkMode,
          onToggle: () => {
            setDarkMode(!darkMode);
            showToast(language === 'tr' ? 'Şu an sadece karanlık mod destekleniyor' : 'Only dark mode is supported currently', 'info');
          }
        },
        {
          icon: '🌍', label: language === 'tr' ? 'Dil' : 'Language',
          subtitle: language === 'tr' ? 'Türkçe' : 'English',
          action: () => {
            setLanguage(language === 'tr' ? 'en' : 'tr');
            showToast(language === 'tr' ? 'Language changed to English' : 'Dil Türkçe olarak değiştirildi', 'info');
          },
          arrow: true,
        },
      ]
    },
    {
      title: language === 'tr' ? 'Sürüş' : 'Driving',
      items: [
        {
          icon: '🚗', label: language === 'tr' ? 'Sürüş Geçmişi' : 'Ride History',
          subtitle: language === 'tr' ? 'Son 30 günlük sürüşleriniz' : 'Your rides in the last 30 days',
          action: () => setActiveSheet('history'),
          arrow: true,
        },
        {
          icon: '💳', label: language === 'tr' ? 'Ödeme Yöntemleri' : 'Payment Methods',
          subtitle: language === 'tr' ? 'Kartlar ve bakiye' : 'Cards and balance',
          action: () => navigateTo(APP_STATES.WALLET),
          arrow: true,
        },
        {
          icon: '📄', label: language === 'tr' ? 'Faturalarım' : 'My Invoices',
          subtitle: language === 'tr' ? 'E-fatura ve geçmiş ödemeler' : 'E-invoices and past payments',
          action: () => setActiveSheet('invoices'),
          arrow: true,
        },
        {
          icon: '🛡️', label: language === 'tr' ? 'Sigorta & Güvence' : 'Insurance & Protection',
          subtitle: language === 'tr' ? 'Teminatlar, hasar bildir, SOS' : 'Coverage, report damage, SOS',
          action: () => navigateTo(APP_STATES.INSURANCE),
          arrow: true,
        },
      ]
    },
    {
      title: language === 'tr' ? 'Destek' : 'Support',
      items: [
        {
          icon: '💬', label: language === 'tr' ? 'Canlı Destek' : 'Live Support',
          subtitle: language === 'tr' ? '7/24 yardım hattı' : '24/7 helpline',
          action: () => setActiveSheet('support'),
          arrow: true,
        },
        {
          icon: '📋', label: language === 'tr' ? 'Sıkça Sorulan Sorular' : 'FAQ',
          subtitle: language === 'tr' ? 'SSS ve yardım merkezi' : 'FAQ and help center',
          action: () => setActiveSheet('faq'),
          arrow: true,
        },
        {
          icon: '⭐', label: language === 'tr' ? 'Uygulamayı Değerlendir' : 'Rate the App',
          subtitle: 'App Store / Play Store',
          action: () => setActiveSheet('rate'),
          arrow: true,
        },
      ]
    },
    {
      title: language === 'tr' ? 'Yasal' : 'Legal',
      items: [
        {
          icon: '📜', label: language === 'tr' ? 'Kullanım Koşulları' : 'Terms of Use',
          action: () => setActiveSheet('terms'),
          arrow: true,
        },
        {
          icon: '🔒', label: language === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy',
          action: () => setActiveSheet('privacy'),
          arrow: true,
        },
        {
          icon: 'ℹ️', label: language === 'tr' ? 'Uygulama Hakkında' : 'About the App',
          subtitle: 'v2.1.0 · Build 2026.03',
          arrow: true,
          action: () => setActiveSheet('about'),
        },
      ]
    }
  ];

  return (
    <div className="screen" style={{ background: 'var(--togg-navy)' }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '24px 20px 16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigateTo(APP_STATES.MAP)} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px', width: '40px', height: '40px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', cursor: 'pointer',
        }}>←</button>
        <h1 style={{ fontSize: '20px', fontWeight: 800 }}>{language === 'tr' ? 'Ayarlar' : 'Settings'}</h1>
      </div>

      <div style={{ flex: 1, padding: '0 20px', overflowY: 'auto', paddingBottom: '120px' }}>
        <div className="animate-fadeInUp">

          {/* Profile Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,212,170,0.1), rgba(79,172,254,0.08))',
            borderRadius: '20px', padding: '20px', marginBottom: '24px',
            border: '1px solid rgba(0,212,170,0.15)', display: 'flex', alignItems: 'center', gap: '16px'
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #00d4aa, #4facfe)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '26px', flexShrink: 0
            }}>👤</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '2px' }}>
                {user.name || user.phone || 'Kullanıcı'}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--togg-gray-400)' }}>
                KYC: {user.kycStatus === 'approved' ? (language === 'tr' ? '✅ Onaylandı' : '✅ Approved') : (language === 'tr' ? '⏳ Beklemede' : '⏳ Pending')}
              </p>
            </div>
            <div style={{
              background: 'rgba(0,212,170,0.15)', padding: '6px 12px', borderRadius: '10px',
              fontSize: '11px', fontWeight: 700, color: 'var(--togg-teal)'
            }}>
              {user.balance.toFixed(0)}₺
            </div>
          </div>

          {/* Settings Sections */}
          {settingsSections.map((section, sIdx) => (
            <div key={sIdx} style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '12px', fontWeight: 700, color: 'var(--togg-gray-400)',
                textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', paddingLeft: '4px'
              }}>{section.title}</h3>
              <div style={{
                background: 'rgba(255,255,255,0.03)', borderRadius: '18px',
                border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden'
              }}>
                {section.items.map((item, iIdx) => (
                  <button
                    key={iIdx}
                    onClick={item.toggle ? item.onToggle : item.action}
                    style={{
                      width: '100%', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px',
                      background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer',
                      borderBottom: iIdx < section.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      textAlign: 'left', transition: 'background 200ms ease',
                    }}
                  >
                    <span style={{ fontSize: '20px', width: '28px', textAlign: 'center' }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{item.label}</div>
                      {item.subtitle && (
                        <div style={{ fontSize: '11px', color: 'var(--togg-gray-400)', marginTop: '2px' }}>
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                    {item.toggle ? (
                      <div style={{
                        width: '44px', height: '24px', borderRadius: '12px',
                        background: item.toggleValue ? 'var(--togg-teal)' : 'rgba(255,255,255,0.1)',
                        position: 'relative', transition: 'background 300ms ease', flexShrink: 0,
                      }}>
                        <div style={{
                          width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
                          position: 'absolute', top: '2px',
                          left: item.toggleValue ? '22px' : '2px',
                          transition: 'left 300ms ease', boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }} />
                      </div>
                    ) : item.arrow ? (
                      <span style={{ color: 'var(--togg-gray-400)', fontSize: '14px' }}>›</span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Danger Zone */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '12px', fontWeight: 700, color: '#ff4757',
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', paddingLeft: '4px'
            }}>{language === 'tr' ? 'Tehlikeli Bölge' : 'Danger Zone'}</h3>
            <div style={{
              background: 'rgba(255,71,87,0.05)', borderRadius: '18px',
              border: '1px solid rgba(255,71,87,0.15)', overflow: 'hidden'
            }}>
              <button onClick={handleLogout} style={{
                width: '100%', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px',
                background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,71,87,0.1)',
                color: '#ffa502', cursor: 'pointer', textAlign: 'left'
              }}>
                <span style={{ fontSize: '20px', width: '28px', textAlign: 'center' }}>🚪</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>{language === 'tr' ? 'Çıkış Yap' : 'Log Out'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--togg-gray-400)', marginTop: '2px' }}>
                    {language === 'tr' ? 'Oturumunuzu kapatır, verileriniz korunur' : 'Logs you out, data is kept safe'}
                  </div>
                </div>
                <span style={{ color: 'var(--togg-gray-400)', fontSize: '14px' }}>›</span>
              </button>
              <button onClick={() => setShowDeleteConfirm(true)} style={{
                width: '100%', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px',
                background: 'transparent', border: 'none',
                color: '#ff4757', cursor: 'pointer', textAlign: 'left'
              }}>
                <span style={{ fontSize: '20px', width: '28px', textAlign: 'center' }}>🗑️</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>{language === 'tr' ? 'Hesabı Sil' : 'Delete Account'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--togg-gray-400)', marginTop: '2px' }}>
                    {language === 'tr' ? 'Kalıcı olarak silinir, geri alınamaz' : 'Permanently deleted, cannot be undone'}
                  </div>
                </div>
                <span style={{ color: 'var(--togg-gray-400)', fontSize: '14px' }}>›</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <>
          <div onClick={() => setShowDeleteConfirm(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
            backdropFilter: 'blur(8px)'
          }} />
          <div className="animate-fadeInUp" style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1001,
            background: 'rgba(19,27,51,0.98)', borderRadius: '24px 24px 0 0',
            padding: '28px 24px 40px', border: '1px solid rgba(255,71,87,0.2)',
            backdropFilter: 'blur(20px)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(255,71,87,0.15)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '28px',
                margin: '0 auto 14px', border: '1px solid rgba(255,71,87,0.2)'
              }}>⚠️</div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px', color: '#ff4757' }}>
                Hesabınızı Silmek Üzeresiniz
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--togg-gray-300)', lineHeight: 1.6, maxWidth: '280px', margin: '0 auto' }}>
                Bu işlem geri alınamaz. Tüm sürüş geçmişiniz, bakiyeniz ve kişisel verileriniz kalıcı olarak silinecektir.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={handleDeleteAccount} style={{
                width: '100%', padding: '16px', borderRadius: '16px', fontWeight: 800, fontSize: '15px',
                background: 'rgba(255,71,87,0.15)', border: '1px solid rgba(255,71,87,0.4)',
                color: '#ff4757', cursor: 'pointer'
              }}>
                Evet, Hesabımı Sil
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} style={{
                width: '100%', padding: '16px', borderRadius: '16px', fontWeight: 800, fontSize: '15px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff', cursor: 'pointer'
              }}>
                Vazgeç
              </button>
            </div>
          </div>
        </>
      )}

      {/* Active Bottom Sheets */}
      {(() => {
        if (!activeSheet) return null;

        let title = '';
        let content = null;

        if (activeSheet === 'profile') {
          title = language === 'tr' ? 'Profil Bilgileri' : 'Profile Information';
          content = (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: 'var(--togg-gray-400)', fontWeight: 600 }}>
                  {language === 'tr' ? 'Ad Soyad' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px', padding: '14px 16px', color: '#fff', fontSize: '15px', outline: 'none'
                  }}
                  placeholder={language === 'tr' ? 'Adınızı girin' : 'Enter your name'}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: 'var(--togg-gray-400)', fontWeight: 600 }}>
                  {language === 'tr' ? 'Telefon Numarası' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px', padding: '14px 16px', color: '#fff', fontSize: '15px', outline: 'none'
                  }}
                  placeholder="+90 5XX XXX XX XX"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: 'var(--togg-gray-400)', fontWeight: 600 }}>
                  {language === 'tr' ? 'E-Posta Adresi' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px', padding: '14px 16px', color: '#fff', fontSize: '15px', outline: 'none'
                  }}
                  placeholder="ornek@mail.com"
                />
              </div>
              
              <button
                onClick={() => {
                  setUser({ ...user, name: profileForm.name, phone: profileForm.phone, email: profileForm.email });
                  showToast(language === 'tr' ? 'Profil başarıyla güncellendi! ✅' : 'Profile updated successfully! ✅', 'success');
                  setActiveSheet(null);
                }}
                style={{
                  marginTop: '12px', width: '100%', padding: '16px', borderRadius: '16px', background: 'var(--togg-teal)',
                  color: '#0a0f1e', border: 'none', fontWeight: 800, fontSize: '15px', cursor: 'pointer'
                }}
              >
                {language === 'tr' ? 'Kaydet' : 'Save'}
              </button>
            </div>
          );
        } else if (activeSheet === 'history') {
          title = language === 'tr' ? 'Sürüş Geçmişi' : 'Ride History';
          content = (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {tripHistory && tripHistory.length > 0 ? (
                tripHistory.map((trip) => (
                  <div key={trip.id} style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '24px' }}>🚗</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '15px' }}>{trip.model}</div>
                        <div style={{ fontSize: '12px', color: 'var(--togg-gray-400)', marginTop: '2px' }}>{trip.plate} · {trip.date}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--togg-teal)' }}>{trip.cost.toFixed(2)} ₺</div>
                      <div style={{ fontSize: '11px', color: 'var(--togg-gray-400)', marginTop: '2px' }}>{trip.durationMin} dk</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--togg-gray-400)' }}>
                  {language === 'tr' ? 'Sürüş geçmişiniz bulunmamaktadır.' : 'You have no ride history.'}
                </div>
              )}
            </div>
          );
        } else if (activeSheet === 'invoices') {
          title = language === 'tr' ? 'Faturalarım' : 'My Invoices';
          const mockInvoices = [
            { id: 'INV-2026-001', date: '22.03.2026', amount: '210.50 ₺' },
            { id: 'INV-2026-002', date: '20.03.2026', amount: '112.00 ₺' },
            { id: 'INV-2026-003', date: '18.03.2026', amount: '340.00 ₺' },
          ];
          content = (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {mockInvoices.map((inv, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>{inv.id}</div>
                    <div style={{ fontSize: '12px', color: 'var(--togg-gray-400)', marginTop: '2px' }}>{language === 'tr' ? 'Tarih:' : 'Date:'} {inv.date}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontWeight: 800, fontSize: '15px' }}>{inv.amount}</div>
                    <button 
                      onClick={() => showToast(language === 'tr' ? "Fatura PDF'i indiriliyor... 📄" : "Downloading invoice PDF... 📄", 'success')}
                      style={{
                        background: 'rgba(0,212,170,0.1)', border: 'none', borderRadius: '10px',
                        padding: '8px 12px', color: 'var(--togg-teal)', fontSize: '12px', fontWeight: 700,
                        cursor: 'pointer', transition: 'all 200ms ease'
                      }}
                    >
                      {language === 'tr' ? 'İndir' : 'Download'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        } else if (activeSheet === 'support') {
          title = language === 'tr' ? 'Canlı Destek' : 'Live Support';
          content = (
            <div style={{ display: 'flex', flexDirection: 'column', height: '400px', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '16px' }}>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    background: msg.sender === 'user' ? 'var(--togg-teal)' : 'rgba(255,255,255,0.06)',
                    color: msg.sender === 'user' ? '#0a0f1e' : '#fff',
                    borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    padding: '12px 16px', maxWidth: '80%', fontSize: '13px', lineHeight: 1.5, fontWeight: 500
                  }}>
                    {msg.text}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  placeholder={language === 'tr' ? "Mesajınızı yazın..." : "Type your message..."}
                  style={{
                    flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '13px', outline: 'none'
                  }}
                />
                <button 
                  onClick={handleSendChatMessage}
                  style={{
                    background: 'var(--togg-teal)', border: 'none', borderRadius: '12px',
                    width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontSize: '16px'
                  }}
                >
                  ➔
                </button>
              </div>
            </div>
          );
        } else if (activeSheet === 'faq') {
          title = language === 'tr' ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions';
          const faqs = language === 'tr' ? [
            {
              q: 'Provizyon iadesi ne zaman yapılır?',
              a: 'Sürüşünüz bittiğinde provizyon iade süreci anında başlar. Bankanıza bağlı olarak 1-3 iş günü içerisinde hesabınıza yansır.'
            },
            {
              q: 'TOGG şarjı biterse ne yapmalıyım?',
              a: 'Haritada en yakın Trugo istasyonunu bulup şarj edebilirsiniz. Şarj ödemeleri tamamen Turla tarafından karşılanır.'
            },
            {
              q: 'Kaza durumunda ne yapmalıyım?',
              a: 'Hemen Sigorta & Güvence sayfasından Hasar Bildir kısmına girin veya Canlı Destek hattımızla irtibata geçin.'
            },
            {
              q: 'Fiyatlandırma nasıl hesaplanıyor?',
              a: 'Sürüş ücreti dakika bazlı hesaplanır. Ayrıca bekleme moduna aldığınız dakikalar daha indirimli bir bekleme tarifesiyle ücretlendirilir.'
            }
          ] : [
            {
              q: 'When is the pre-authorization refunded?',
              a: 'The refund process starts immediately when your ride ends. It reflects to your account within 1-3 business days depending on your bank.'
            },
            {
              q: 'What should I do if the TOGG runs out of charge?',
              a: 'You can find the nearest Trugo station on the map and charge it. Charging payments are fully covered by Turla.'
            },
            {
              q: 'What should I do in case of an accident?',
              a: 'Immediately go to the Report Damage section from the Insurance & Protection page or contact our Live Support line.'
            },
            {
              q: 'How is pricing calculated?',
              a: 'The ride fee is calculated per minute. Also, the minutes you put in standby mode are charged with a discounted standby rate.'
            }
          ];
          content = (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {faqs.map((faq, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '16px', overflow: 'hidden'
                }}>
                  <button 
                    onClick={() => setActiveFaqIndex(activeFaqIndex === idx ? null : idx)}
                    style={{
                      width: '100%', padding: '16px', background: 'transparent', border: 'none',
                      color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      cursor: 'pointer', textAlign: 'left', fontWeight: 700, fontSize: '14px'
                    }}
                  >
                    <span>{faq.q}</span>
                    <span>{activeFaqIndex === idx ? '▲' : '▼'}</span>
                  </button>
                  {activeFaqIndex === idx && (
                    <div style={{
                      padding: '0 16px 16px', fontSize: '13px', color: 'var(--togg-gray-300)',
                      lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '12px'
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        } else if (activeSheet === 'rate') {
          title = language === 'tr' ? 'Uygulamayı Değerlendir' : 'Rate the App';
          content = (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px' }}>⭐️</div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>{language === 'tr' ? 'Turla Deneyiminiz Nasıl?' : 'How is your Turla Experience?'}</h3>
                <p style={{ fontSize: '12px', color: 'var(--togg-gray-400)', maxWidth: '240px' }}>
                  {language === 'tr' ? 'Bize App Store / Play Store üzerinde yıldız verin ve yorum yapın.' : 'Give us a star and write a review on the App Store / Play Store.'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star}
                    onClick={() => setAppRating(star)}
                    style={{
                      background: 'transparent', border: 'none', fontSize: '28px', cursor: 'pointer',
                      opacity: star <= appRating ? 1 : 0.25, transition: 'all 200ms ease'
                    }}
                  >
                    ⭐️
                  </button>
                ))}
              </div>
              <textarea 
                placeholder={language === 'tr' ? "Geri bildiriminizi bizimle paylaşın..." : "Share your feedback with us..."}
                value={appRatingComment}
                onChange={(e) => setAppRatingComment(e.target.value)}
                style={{
                  width: '100%', minHeight: '80px', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
                  padding: '12px', color: '#fff', fontSize: '13px', outline: 'none', resize: 'none'
                }}
              />
              <button 
                onClick={() => {
                  showToast(language === 'tr' ? 'Değerlendirmeniz başarıyla gönderildi! ⭐' : 'Your review was submitted successfully! ⭐', 'success');
                  setActiveSheet(null);
                  setAppRating(0);
                  setAppRatingComment('');
                }}
                disabled={appRating === 0}
                style={{
                  width: '100%', padding: '14px', borderRadius: '14px', background: 'var(--togg-teal)',
                  color: '#0a0f1e', border: 'none', fontWeight: 800, fontSize: '14px',
                  opacity: appRating === 0 ? 0.5 : 1, cursor: appRating === 0 ? 'default' : 'pointer'
                }}
              >
                {language === 'tr' ? 'Gönder' : 'Submit'}
              </button>
            </div>
          );
        } else if (activeSheet === 'terms') {
          title = language === 'tr' ? 'Kullanım Koşulları' : 'Terms of Use';
          content = (
            <div style={{ 
              fontSize: '12px', color: 'var(--togg-gray-300)', lineHeight: 1.6, 
              maxHeight: '280px', overflowY: 'auto', paddingRight: '6px' 
            }}>
              <h4 style={{ color: '#fff', marginBottom: '8px', fontWeight: 700 }}>{language === 'tr' ? '1. Giriş ve Tanımlar' : '1. Introduction and Definitions'}</h4>
              <p style={{ marginBottom: '12px' }}>
                {language === 'tr' ? 'Turla, TOGG akıllı cihaz ekosistemi ve entegre elektrikli araç paylaşım hizmeti sunan bir mobil uygulamadır. Bu koşullar, uygulamayı kullanan tüm üyeler için bağlayıcıdır.' : 'Turla is a mobile application that offers integrated electric car sharing services for the TOGG smart device ecosystem. These terms are binding for all members using the app.'}
              </p>
              <h4 style={{ color: '#fff', marginBottom: '8px', fontWeight: 700 }}>{language === 'tr' ? '2. Kullanım Şartları' : '2. Terms of Use'}</h4>
              <p style={{ marginBottom: '12px' }}>
                {language === 'tr' ? 'Kullanıcılar geçerli bir sürücü belgesine sahip olmalı, ehliyet doğrulama (KYC) adımını başarıyla tamamlamalıdır. Araçlar yalnızca tescilli kullanıcı tarafından kullanılabilir.' : 'Users must have a valid driver\'s license and successfully complete the KYC step. Vehicles can only be driven by the registered user.'}
              </p>
              <h4 style={{ color: '#fff', marginBottom: '8px', fontWeight: 700 }}>{language === 'tr' ? '3. Ücretlendirme ve Provizyon' : '3. Pricing and Pre-authorization'}</h4>
              <p style={{ marginBottom: '12px' }}>
                {language === 'tr' ? 'Her sürüş başında 5.000 TL provizyon tutarı bloke edilir. Sürüş bedeli sürüş bitiminde tahsil edilir ve provizyon iade süreci başlatılır.' : 'At the start of every ride, a 5.000 TL pre-authorization amount is blocked. The ride fee is collected at the end of the ride and the refund process is initiated.'}
              </p>
            </div>
          );
        } else if (activeSheet === 'privacy') {
          title = language === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy';
          content = (
            <div style={{ 
              fontSize: '12px', color: 'var(--togg-gray-300)', lineHeight: 1.6, 
              maxHeight: '280px', overflowY: 'auto', paddingRight: '6px' 
            }}>
              <h4 style={{ color: '#fff', marginBottom: '8px', fontWeight: 700 }}>{language === 'tr' ? 'Veri Sorumlusu' : 'Data Controller'}</h4>
              <p style={{ marginBottom: '12px' }}>
                {language === 'tr' ? 'Turla Teknoloji A.Ş. olarak kişisel verilerinizin güvenliğine büyük önem veriyoruz. Kişisel verileriniz KVKK mevzuatına uygun olarak işlenmektedir.' : 'As Turla Technology Inc., we attach great importance to the security of your personal data. Your data is processed in accordance with the law.'}
              </p>
              <h4 style={{ color: '#fff', marginBottom: '8px', fontWeight: 700 }}>{language === 'tr' ? 'Toplanan Veriler' : 'Collected Data'}</h4>
              <p style={{ marginBottom: '12px' }}>
                {language === 'tr' ? 'Ehliyet bilgileriniz, kimlik bilgileriniz, konum bilgileriniz ve sürüş esnasındaki telemetri verileri (hız, batarya durumu, sürüş rotası) güvenli araç içi deneyim ve faturalandırma için toplanmaktadır.' : 'Your driver\'s license info, identity info, location data, and telemetry data during the ride (speed, battery, route) are collected for a secure in-car experience and billing.'}
              </p>
              <h4 style={{ color: '#fff', marginBottom: '8px', fontWeight: 700 }}>{language === 'tr' ? 'Veri Paylaşımı' : 'Data Sharing'}</h4>
              <p style={{ marginBottom: '12px' }}>
                {language === 'tr' ? 'Verileriniz yasal makamlar dışında hiçbir üçüncü şahıs veya kurumla reklam veya pazarlama amacıyla paylaşılmaz.' : 'Your data is not shared with any third party or institution for advertising or marketing purposes, except legal authorities.'}
              </p>
            </div>
          );
        } else if (activeSheet === 'about') {
          title = language === 'tr' ? 'Uygulama Hakkında' : 'About the App';
          content = (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '18px',
                background: 'linear-gradient(135deg, #00d4aa, #4facfe)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '32px', fontWeight: 900, color: '#0a0f1e',
                boxShadow: '0 8px 24px rgba(0,212,170,0.3)'
              }}>T</div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>Turla</h3>
                <p style={{ fontSize: '11px', color: 'var(--togg-teal)', fontWeight: 600 }}>{language === 'tr' ? 'TOGG Araç Paylaşım Platformu' : 'TOGG Car Sharing Platform'}</p>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--togg-gray-300)', lineHeight: 1.6, maxWidth: '280px' }}>
                {language === 'tr' ? "Turla, TOGG akıllı cihaz ekosistemi için özel olarak tasarlanmış Türkiye'nin ilk doğa dostu, %100 elektrikli araç paylaşım platformudur." : "Turla is Turkey's first eco-friendly, 100% electric car sharing platform exclusively designed for the TOGG smart device ecosystem."}
              </p>
              <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.06)' }} />
              <div style={{ fontSize: '11px', color: 'var(--togg-gray-400)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span>{language === 'tr' ? 'Sürüm:' : 'Version:'} v2.1.0 (Build 2026.03)</span>
                <span>© 2026 {language === 'tr' ? 'Turla Teknoloji A.Ş.' : 'Turla Technology Inc.'}</span>
                <span>{language === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}</span>
              </div>
            </div>
          );
        }

        return (
          <>
            {/* Backdrop */}
            <div onClick={() => setActiveSheet(null)} style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
              backdropFilter: 'blur(8px)'
            }} />
            
            {/* Sheet container */}
            <div className="animate-fadeInUp" style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1001,
              background: 'rgba(19,27,51,0.98)', borderRadius: '24px 24px 0 0',
              padding: '28px 24px 40px', borderTop: '1px solid rgba(0,212,170,0.15)',
              backdropFilter: 'blur(20px)', maxHeight: '85vh', overflowY: 'auto'
            }}>
              {/* Handle */}
              <div style={{ width: '40px', height: '5px', background: 'rgba(255,255,255,0.15)', borderRadius: '3px', margin: '0 auto 20px' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800 }}>{title}</h2>
                <button onClick={() => setActiveSheet(null)} style={{
                  background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '8px', width: '32px', height: '32px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer'
                }}>✕</button>
              </div>

              {content}
            </div>
          </>
        );
      })()}
    </div>
  );
}
