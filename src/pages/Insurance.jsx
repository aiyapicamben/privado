import { useState } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import StatusBar from '../components/StatusBar';

export default function Insurance() {
  const { navigateTo, selectedVehicle, showToast, addLog } = useApp();
  const [activeTab, setActiveTab] = useState('coverage');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportStep, setReportStep] = useState(0);
  const [reportData, setReportData] = useState({
    type: '',
    description: '',
    photos: [],
    location: 'Gemlik, Bursa',
  });

  const coverageItems = [
    {
      icon: '🛡️',
      title: 'Kasko (Tam Koruma)',
      desc: 'Araçta oluşan tüm hasarlar sigorta kapsamındadır.',
      detail: 'Muafiyet: İlk 500₺ kullanıcıya aittir',
      color: '#00d4aa',
      included: true,
    },
    {
      icon: '🚑',
      title: 'Trafik Sigortası',
      desc: 'Zorunlu mali mesuliyet sigortası aktiftir.',
      detail: 'Karşı tarafa verilen zararları kapsar',
      color: '#4facfe',
      included: true,
    },
    {
      icon: '🔧',
      title: 'Yol Yardım (7/24)',
      desc: 'Lastik patlaması, akü, çekici hizmeti.',
      detail: 'Ücretsiz · Tüm Türkiye genelinde',
      color: '#7c5cfc',
      included: true,
    },
    {
      icon: '🏥',
      title: 'Koltuk Ferdi Kaza',
      desc: 'Sürücü ve yolculara sağlık güvencesi.',
      detail: 'Kişi başı 500.000₺ teminat',
      color: '#ffa502',
      included: true,
    },
    {
      icon: '🌊',
      title: 'Doğal Afet Teminatı',
      desc: 'Sel, deprem, dolu gibi doğal afetlerde koruma.',
      detail: 'Tam hasar bedeli karşılanır',
      color: '#2ed573',
      included: true,
    },
    {
      icon: '🔑',
      title: 'Anahtar Kaybı',
      desc: 'Dijital anahtar kaybı veya çalınma durumunda.',
      detail: 'Araç uzaktan devre dışı bırakılır',
      color: '#ff6b81',
      included: false,
    },
  ];

  const damageTypes = [
    { id: 'collision', icon: '💥', label: 'Çarpışma / Kaza' },
    { id: 'scratch', icon: '🔑', label: 'Çizik / Ezik' },
    { id: 'tire', icon: '🛞', label: 'Lastik Hasarı' },
    { id: 'glass', icon: '🪟', label: 'Cam Kırılması' },
    { id: 'theft', icon: '🚨', label: 'Hırsızlık / Vandalizm' },
    { id: 'other', icon: '❓', label: 'Diğer' },
  ];

  const handleSubmitReport = () => {
    addLog('INSURANCE_CLAIM', `Hasar bildirimi: ${reportData.type} - ${selectedVehicle?.plate || '16 TG 1001'}`, 'warning');
    showToast('Hasar bildiriminiz alındı. Dosya No: #INS-2026-' + Math.floor(Math.random() * 9000 + 1000), 'success');
    setShowReportModal(false);
    setReportStep(0);
    setReportData({ type: '', description: '', photos: [], location: 'Gemlik, Bursa' });
  };

  const handlePhotoUpload = () => {
    const newPhotos = [...reportData.photos, `hasar_foto_${reportData.photos.length + 1}.jpg`];
    setReportData({ ...reportData, photos: newPhotos });
    showToast(`Fotoğraf ${newPhotos.length} eklendi`, 'success');
  };

  const tabs = [
    { id: 'coverage', label: 'Teminatlar', icon: '🛡️' },
    { id: 'report', label: 'Hasar Bildir', icon: '📋' },
    { id: 'claims', label: 'Geçmiş', icon: '📂' },
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
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Sigorta & Güvence</h1>
          <p style={{ fontSize: '11px', color: 'var(--togg-gray-400)' }}>
            <span className="brand-glow-sm">Tur At</span> Tam Koruma Paketi
          </p>
        </div>
        {/* SOS Button */}
        <button onClick={() => {
          showToast('112 Acil Çağrı Merkezi aranıyor...', 'info');
          addLog('SOS_CALL', 'Acil yardım çağrısı tetiklendi', 'warning');
        }} style={{
          background: 'rgba(255,71,87,0.15)', border: '2px solid #ff4757',
          borderRadius: '50%', width: '44px', height: '44px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: '14px',
          color: '#ff4757', fontWeight: 900, cursor: 'pointer',
          animation: 'pulse 2s ease-in-out infinite',
        }}>SOS</button>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 20px', marginBottom: '16px' }}>
        <div style={{
          display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)',
          borderRadius: '14px', padding: '4px', border: '1px solid rgba(255,255,255,0.06)'
        }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, padding: '10px 8px', borderRadius: '10px', border: 'none',
              background: activeTab === tab.id ? 'rgba(0,212,170,0.15)' : 'transparent',
              color: activeTab === tab.id ? 'var(--togg-teal)' : 'var(--togg-gray-400)',
              fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              transition: 'all 200ms ease', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '4px',
            }}>
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: '0 20px', overflowY: 'auto', paddingBottom: '40px' }}>
        <div className="animate-fadeInUp">

          {/* ========= TAB: COVERAGE ========= */}
          {activeTab === 'coverage' && (
            <>
              {/* Insurance Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(79,172,254,0.06))',
                borderRadius: '20px', padding: '20px', marginBottom: '20px',
                border: '1px solid rgba(0,212,170,0.12)', position: 'relative', overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px',
                  borderRadius: '50%', background: 'rgba(0,212,170,0.05)',
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontSize: '10px', color: 'var(--togg-gray-400)', textTransform: 'uppercase', letterSpacing: '1px' }}>Poliçe Durumu</p>
                    <h3 style={{ fontSize: '18px', fontWeight: 800 }}>✅ Aktif</h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '10px', color: 'var(--togg-gray-400)' }}>Poliçe No</p>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--togg-teal)' }}>TUR-2026-GML-001</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '10px',
                    border: '1px solid rgba(255,255,255,0.04)'
                  }}>
                    <p style={{ fontSize: '10px', color: 'var(--togg-gray-400)' }}>Sigorta Şirketi</p>
                    <p style={{ fontSize: '13px', fontWeight: 700 }}>Anadolu Sigorta</p>
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '10px',
                    border: '1px solid rgba(255,255,255,0.04)'
                  }}>
                    <p style={{ fontSize: '10px', color: 'var(--togg-gray-400)' }}>Geçerlilik</p>
                    <p style={{ fontSize: '13px', fontWeight: 700 }}>31.12.2026</p>
                  </div>
                </div>
              </div>

              {/* Coverage Items */}
              {coverageItems.map((item, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.03)', borderRadius: '16px',
                  padding: '16px', marginBottom: '10px',
                  border: `1px solid ${item.included ? 'rgba(255,255,255,0.06)' : 'rgba(255,71,87,0.15)'}`,
                  display: 'flex', alignItems: 'center', gap: '14px',
                  opacity: item.included ? 1 : 0.5,
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: `${item.color}15`, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '22px',
                    border: `1px solid ${item.color}30`, flexShrink: 0,
                  }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '2px' }}>
                      {item.title}
                      {!item.included && <span style={{ fontSize: '10px', color: '#ff4757', marginLeft: '8px' }}>Kapsam Dışı</span>}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--togg-gray-400)', marginBottom: '2px' }}>{item.desc}</div>
                    <div style={{ fontSize: '10px', color: item.color, fontWeight: 600 }}>{item.detail}</div>
                  </div>
                  <span style={{ color: item.included ? '#2ed573' : '#ff4757', fontSize: '16px' }}>
                    {item.included ? '✓' : '✗'}
                  </span>
                </div>
              ))}
            </>
          )}

          {/* ========= TAB: REPORT ========= */}
          {activeTab === 'report' && (
            <>
              {/* Emergency Banner */}
              <div style={{
                background: 'rgba(255,71,87,0.08)', borderRadius: '16px', padding: '16px',
                marginBottom: '16px', border: '1px solid rgba(255,71,87,0.2)',
                display: 'flex', alignItems: 'center', gap: '12px'
              }}>
                <span style={{ fontSize: '28px' }}>🚨</span>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#ff4757' }}>Acil Durum mu?</h3>
                  <p style={{ fontSize: '11px', color: 'var(--togg-gray-300)' }}>
                    Yaralanma varsa hemen <strong>112</strong>'yi arayın. Sağ üstteki SOS butonunu kullanabilirsiniz.
                  </p>
                </div>
              </div>

              {/* Damage Type Selection */}
              <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: 'var(--togg-gray-300)' }}>
                Hasar Türünü Seçin
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                {damageTypes.map(type => (
                  <button key={type.id} onClick={() => {
                    setReportData({ ...reportData, type: type.label });
                    setShowReportModal(true);
                    setReportStep(0);
                  }} style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '14px', padding: '16px 8px', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '8px', color: '#fff', cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}>
                    <span style={{ fontSize: '28px' }}>{type.icon}</span>
                    <span style={{ fontSize: '11px', fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>{type.label}</span>
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: 'var(--togg-gray-300)' }}>
                Hızlı İşlemler
              </h3>
              {[
                { icon: '📞', title: 'Sigorta Hattını Ara', desc: 'Anadolu Sigorta 7/24 hasar hattı', action: () => showToast('0850 724 0 724 aranıyor...', 'info') },
                { icon: '🚛', title: 'Çekici Çağır', desc: 'En yakın çekici 15 dk içinde gelir', action: () => { showToast('Çekici talebi gönderildi. Tahmini varış: 12 dk', 'success'); addLog('TOW_REQUEST', 'Çekici talebi oluşturuldu - Gemlik', 'warning'); } },
                { icon: '📍', title: 'Konum Paylaş', desc: 'Anlık konumunuzu sigorta ekibine iletin', action: () => showToast('Konumunuz paylaşıldı: 40.4340, 29.1575', 'success') },
              ].map((item, i) => (
                <button key={i} onClick={item.action} style={{
                  width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px', padding: '14px 16px', marginBottom: '8px',
                  display: 'flex', alignItems: 'center', gap: '14px', color: '#fff',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 200ms ease',
                }}>
                  <span style={{ fontSize: '22px' }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>{item.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--togg-gray-400)' }}>{item.desc}</div>
                  </div>
                  <span style={{ color: 'var(--togg-gray-400)' }}>›</span>
                </button>
              ))}
            </>
          )}

          {/* ========= TAB: CLAIMS ========= */}
          {activeTab === 'claims' && (
            <>
              <div style={{
                textAlign: 'center', padding: '40px 20px',
                color: 'var(--togg-gray-400)',
              }}>
                <span style={{ fontSize: '48px', marginBottom: '12px', display: 'block' }}>🎉</span>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Hasar Kaydınız Yok</h3>
                <p style={{ fontSize: '13px', lineHeight: 1.5 }}>
                  Şu ana kadar herhangi bir hasar bildirimi yapılmamış.<br />
                  Güvenli sürüşleriniz için teşekkür ederiz! 🚗✨
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ========= REPORT MODAL ========= */}
      {showReportModal && (
        <>
          <div onClick={() => setShowReportModal(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
            backdropFilter: 'blur(8px)',
          }} />
          <div className="animate-fadeInUp" style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1001,
            background: 'rgba(19,27,51,0.98)', borderRadius: '24px 24px 0 0',
            padding: '28px 24px 40px', border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)', maxHeight: '80vh', overflowY: 'auto',
          }}>
            {/* Step indicator */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
              {[0, 1, 2].map(s => (
                <div key={s} style={{
                  flex: 1, height: '3px', borderRadius: '2px',
                  background: s <= reportStep ? 'var(--togg-teal)' : 'rgba(255,255,255,0.1)',
                  transition: 'all 300ms ease',
                }} />
              ))}
            </div>

            {/* Step 0: Confirm Type */}
            {reportStep === 0 && (
              <>
                <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>
                  {reportData.type}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--togg-gray-400)', marginBottom: '20px' }}>
                  Hasar türü doğru mu? Detayları bir sonraki adımda gireceksiniz.
                </p>
                <div style={{
                  background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '14px',
                  marginBottom: '20px', border: '1px solid rgba(255,255,255,0.06)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--togg-gray-400)' }}>Araç</span>
                    <span style={{ fontSize: '12px', fontWeight: 700 }}>{selectedVehicle?.plate || '16 TG 1001'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--togg-gray-400)' }}>Konum</span>
                    <span style={{ fontSize: '12px', fontWeight: 700 }}>Gemlik, Bursa</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: 'var(--togg-gray-400)' }}>Tarih/Saat</span>
                    <span style={{ fontSize: '12px', fontWeight: 700 }}>{new Date().toLocaleString('tr-TR')}</span>
                  </div>
                </div>
                <button onClick={() => setReportStep(1)} style={{
                  width: '100%', padding: '16px', borderRadius: '16px', fontWeight: 800, fontSize: '15px',
                  background: 'linear-gradient(135deg, #00d4aa, #4facfe)', border: 'none',
                  color: '#0a0f1e', cursor: 'pointer',
                }}>
                  Devam Et →
                </button>
              </>
            )}

            {/* Step 1: Description + Photos */}
            {reportStep === 1 && (
              <>
                <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
                  Hasar Detayları
                </h2>
                <textarea
                  placeholder="Hasarı detaylı olarak açıklayın... (Nerede, nasıl oldu?)"
                  value={reportData.description}
                  onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                  style={{
                    width: '100%', minHeight: '100px', borderRadius: '14px', padding: '14px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    color: '#fff', fontSize: '13px', resize: 'vertical', marginBottom: '16px',
                    fontFamily: 'inherit',
                  }}
                />

                <p style={{ fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>Fotoğraf Ekle</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {reportData.photos.map((photo, i) => (
                    <div key={i} style={{
                      width: '64px', height: '64px', borderRadius: '12px',
                      background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', color: 'var(--togg-teal)', fontWeight: 600,
                    }}>📸 {i + 1}</div>
                  ))}
                  <button onClick={handlePhotoUpload} style={{
                    width: '64px', height: '64px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', color: 'var(--togg-gray-400)', cursor: 'pointer',
                  }}>+</button>
                </div>

                <button onClick={() => setReportStep(2)} style={{
                  width: '100%', padding: '16px', borderRadius: '16px', fontWeight: 800, fontSize: '15px',
                  background: 'linear-gradient(135deg, #00d4aa, #4facfe)', border: 'none',
                  color: '#0a0f1e', cursor: 'pointer',
                }}>
                  Önizleme →
                </button>
              </>
            )}

            {/* Step 2: Confirm & Submit */}
            {reportStep === 2 && (
              <>
                <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
                  Bildirimi Onayla
                </h2>
                <div style={{
                  background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '16px',
                  marginBottom: '20px', border: '1px solid rgba(255,255,255,0.06)', fontSize: '12px',
                }}>
                  <div style={{ marginBottom: '8px' }}><span style={{ color: 'var(--togg-gray-400)' }}>Hasar Türü:</span> <b>{reportData.type}</b></div>
                  <div style={{ marginBottom: '8px' }}><span style={{ color: 'var(--togg-gray-400)' }}>Açıklama:</span> {reportData.description || 'Belirtilmedi'}</div>
                  <div style={{ marginBottom: '8px' }}><span style={{ color: 'var(--togg-gray-400)' }}>Fotoğraf:</span> {reportData.photos.length} adet</div>
                  <div><span style={{ color: 'var(--togg-gray-400)' }}>Konum:</span> Gemlik, Bursa</div>
                </div>

                <div style={{
                  background: 'rgba(255,165,2,0.08)', borderRadius: '12px', padding: '12px',
                  marginBottom: '20px', border: '1px solid rgba(255,165,2,0.2)',
                  fontSize: '11px', color: '#ffa502', lineHeight: 1.5
                }}>
                  ⚠️ Bildiriminiz sigorta şirketine iletilecek ve dosya numarası oluşturulacaktır.
                  Muafiyet tutarı (500₺) varsa hesabınızdan düşülecektir.
                </div>

                <button onClick={handleSubmitReport} style={{
                  width: '100%', padding: '16px', borderRadius: '16px', fontWeight: 800, fontSize: '15px',
                  background: 'linear-gradient(135deg, #ff4757, #ff6b81)', border: 'none',
                  color: '#fff', cursor: 'pointer', marginBottom: '10px',
                }}>
                  🚨 Hasar Bildir
                </button>
                <button onClick={() => setShowReportModal(false)} style={{
                  width: '100%', padding: '14px', borderRadius: '16px', fontWeight: 700, fontSize: '14px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff', cursor: 'pointer',
                }}>
                  İptal
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
