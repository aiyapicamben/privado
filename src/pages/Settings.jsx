import { useState } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import StatusBar from '../components/StatusBar';

export default function Settings() {
  const { navigateTo, user, showToast, setUser } = useApp();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('tr');

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
      title: 'Hesap',
      items: [
        {
          icon: '👤', label: 'Profil Bilgileri',
          subtitle: user.phone || '+90 5XX XXX XX XX',
          action: () => showToast('Profil düzenleme yakında eklenecek', 'info'),
          arrow: true,
        },
        {
          icon: '🔔', label: 'Bildirimler',
          subtitle: notifications ? 'Açık' : 'Kapalı',
          toggle: true,
          toggleValue: notifications,
          onToggle: () => {
            setNotifications(!notifications);
            showToast(!notifications ? 'Bildirimler açıldı' : 'Bildirimler kapatıldı', 'info');
          }
        },
        {
          icon: '🌙', label: 'Karanlık Mod',
          subtitle: 'Her zaman açık',
          toggle: true,
          toggleValue: darkMode,
          onToggle: () => {
            setDarkMode(!darkMode);
            showToast('Şu an sadece karanlık mod destekleniyor', 'info');
          }
        },
        {
          icon: '🌍', label: 'Dil',
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
      title: 'Sürüş',
      items: [
        {
          icon: '🚗', label: 'Sürüş Geçmişi',
          subtitle: 'Son 30 günlük sürüşleriniz',
          action: () => showToast('Sürüş geçmişi yakında eklenecek', 'info'),
          arrow: true,
        },
        {
          icon: '💳', label: 'Ödeme Yöntemleri',
          subtitle: 'Kartlar ve bakiye',
          action: () => navigateTo(APP_STATES.WALLET),
          arrow: true,
        },
        {
          icon: '📄', label: 'Faturalarım',
          subtitle: 'E-fatura ve geçmiş ödemeler',
          action: () => showToast('Faturalar yakında eklenecek', 'info'),
          arrow: true,
        },
        {
          icon: '🛡️', label: 'Sigorta & Güvence',
          subtitle: 'Teminatlar, hasar bildir, SOS',
          action: () => navigateTo(APP_STATES.INSURANCE),
          arrow: true,
        },
      ]
    },
    {
      title: 'Destek',
      items: [
        {
          icon: '💬', label: 'Canlı Destek',
          subtitle: '7/24 yardım hattı',
          action: () => showToast('Canlı destek bağlantısı kuruluyor...', 'info'),
          arrow: true,
        },
        {
          icon: '📋', label: 'Sıkça Sorulan Sorular',
          subtitle: 'SSS ve yardım merkezi',
          action: () => showToast('SSS sayfası yakında eklenecek', 'info'),
          arrow: true,
        },
        {
          icon: '⭐', label: 'Uygulamayı Değerlendir',
          subtitle: 'App Store / Play Store',
          action: () => showToast('Değerlendirme bağlantısı açılıyor...', 'info'),
          arrow: true,
        },
      ]
    },
    {
      title: 'Yasal',
      items: [
        {
          icon: '📜', label: 'Kullanım Koşulları',
          action: () => showToast('Kullanım koşulları yakında eklenecek', 'info'),
          arrow: true,
        },
        {
          icon: '🔒', label: 'Gizlilik Politikası',
          action: () => showToast('Gizlilik politikası yakında eklenecek', 'info'),
          arrow: true,
        },
        {
          icon: 'ℹ️', label: 'Uygulama Hakkında',
          subtitle: 'v2.1.0 · Build 2026.03',
          arrow: true,
          action: () => showToast('Tur At · TOGG Araç Paylaşım Platformu', 'info'),
        },
      ]
    }
  ];

  return (
    <div className="screen" style={{ background: 'var(--togg-navy)' }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigateTo(APP_STATES.MAP)} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px', width: '40px', height: '40px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', cursor: 'pointer',
        }}>←</button>
        <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Ayarlar</h1>
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
                {user.phone || 'Kullanıcı'}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--togg-gray-400)' }}>
                KYC: {user.kycStatus === 'approved' ? '✅ Onaylandı' : '⏳ Beklemede'}
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
            }}>Tehlikeli Bölge</h3>
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
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>Çıkış Yap</div>
                  <div style={{ fontSize: '11px', color: 'var(--togg-gray-400)', marginTop: '2px' }}>
                    Oturumunuzu kapatır, verileriniz korunur
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
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>Hesabı Sil</div>
                  <div style={{ fontSize: '11px', color: 'var(--togg-gray-400)', marginTop: '2px' }}>
                    Kalıcı olarak silinir, geri alınamaz
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
    </div>
  );
}
