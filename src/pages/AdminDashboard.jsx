import { useState } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import { mockVehicles } from '../data/mockData';
import StatusBar from '../components/StatusBar';

export default function AdminDashboard() {
  const { navigateTo, logs, tripHistory, user, setUser, addLog, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [fleetStatus, setFleetStatus] = useState(
    mockVehicles.map(v => ({ ...v, state: v.battery < 20 ? 'maintenance' : 'active' }))
  );

  const totalRevenue = tripHistory.reduce((sum, trip) => sum + trip.cost, 0);
  const activeVehicles = fleetStatus.filter(v => v.state === 'active').length;
  const maintenanceVehicles = fleetStatus.length - activeVehicles;

  // Helpers
  const approveKyc = () => {
    setUser(prev => ({ ...prev, kycStatus: 'approved' }));
    addLog('KYC_APPROVED', 'Kullanıcının kimlik doğrulama belgeleri onaylandı.', 'success');
    showToast('Kullanıcı KYC onayı verildi.', 'success');
  };

  const toggleVehicleState = (index) => {
    setFleetStatus(prev => {
      const newFleet = [...prev];
      const isMaint = newFleet[index].state === 'maintenance';
      newFleet[index].state = isMaint ? 'active' : 'maintenance';
      addLog(
        isMaint ? 'FLEET_ACTIVE' : 'FLEET_MAINTENANCE',
        `🚀 ${newFleet[index].plate} plakalı araç ${isMaint ? 'aktif edildi' : 'bakıma alındı'}.`,
        isMaint ? 'success' : 'warning'
      );
      return newFleet;
    });
  };

  const financeLogs = logs.filter(l => l.action.includes('PAYMENT') || l.action.includes('TOPUP'));

  return (
    <div className="screen" style={{ background: '#0a0f1e' }}>
      <StatusBar />
      
      {/* Header */}
      <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'center', gap: '16px', background: '#131b33', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={() => navigateTo(APP_STATES.MAP)} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px', width: '40px', height: '40px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', cursor: 'pointer',
        }}>←</button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>Gelişmiş Operasyon Paneli</h1>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}><span className="brand-glow-sm">Tur At</span> Admin</p>
        </div>
      </div>

      {/* Modern Horizontal Tabs */}
      <div style={{ display: 'flex', overflowX: 'auto', padding: '16px 20px', gap: '8px', WebkitOverflowScrolling: 'touch', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {[
          { id: 'overview', icon: '📊', label: 'Özet' },
          { id: 'users', icon: '👥', label: 'Müşteriler' },
          { id: 'fleet', icon: '🚗', label: 'Filo' },
          { id: 'finance', icon: '💰', label: 'Finans' },
          { id: 'logs', icon: '📑', label: 'Sistem' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: '10px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap',
            background: activeTab === tab.id ? 'var(--togg-teal)' : 'rgba(255,255,255,0.05)',
            color: activeTab === tab.id ? '#0a0f1e' : 'var(--togg-gray-300)',
            border: activeTab === tab.id ? 'none' : '1px solid rgba(255,255,255,0.05)',
            transition: 'all 200ms ease', display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Container */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.1), transparent)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: '16px', padding: '16px' }}>
                <p style={{ fontSize: '11px', color: 'var(--togg-gray-400)', textTransform: 'uppercase', marginBottom: '8px' }}>Toplam Ciro (Günlük)</p>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>{totalRevenue.toFixed(2)} ₺</div>
              </div>
              <div style={{ background: 'linear-gradient(135deg, rgba(79,172,254,0.1), transparent)', border: '1px solid rgba(79,172,254,0.2)', borderRadius: '16px', padding: '16px' }}>
                <p style={{ fontSize: '11px', color: 'var(--togg-gray-400)', textTransform: 'uppercase', marginBottom: '8px' }}>Aktif Kiralamalar</p>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>{logs.filter(l => l.action === 'DRIVE_START').length % 3}</div>
              </div>
              <div style={{ background: 'linear-gradient(135deg, rgba(124,92,252,0.1), transparent)', border: '1px solid rgba(124,92,252,0.2)', borderRadius: '16px', padding: '16px' }}>
                <p style={{ fontSize: '11px', color: 'var(--togg-gray-400)', textTransform: 'uppercase', marginBottom: '8px' }}>Müsait Araçlar</p>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>{activeVehicles} / {fleetStatus.length}</div>
              </div>
              <div style={{ background: 'linear-gradient(135deg, rgba(255,165,2,0.1), transparent)', border: '1px solid rgba(255,165,2,0.2)', borderRadius: '16px', padding: '16px' }}>
                <p style={{ fontSize: '11px', color: 'var(--togg-gray-400)', textTransform: 'uppercase', marginBottom: '8px' }}>Kayıtlı Müşteri</p>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>{user.isVerified ? 154 : 153}</div>
              </div>
            </div>

            {/* Income Chart Mock */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', marginTop: '8px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '20px', color: 'var(--togg-gray-300)' }}>📈 Haftalık Gelir Özeti</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
                {[30, 50, 40, 70, 60, 90, 100].map((h, i) => (
                  <div key={i} style={{ flex: 1, background: i === 6 ? 'var(--togg-teal)' : 'var(--togg-blue)', height: `${h}%`, borderRadius: '4px 4px 0 0', opacity: i === 6 ? 1 : 0.6 }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '10px', color: 'var(--togg-gray-500)' }}>
                <span>Pzt</span><span>Sal</span><span>Çar</span><span>Per</span><span>Cum</span><span>Cmt</span><span>Paz</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS */}
        {activeTab === 'users' && (
          <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--togg-gray-300)' }}>Son Kayıt Olanlar (Gerçek Zamanlı)</h3>
            
            {user.isVerified ? (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--togg-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                      K
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '15px', color: '#fff' }}>Test Kullanıcısı</div>
                      <div style={{ fontSize: '12px', color: 'var(--togg-gray-400)' }}>{user.phone || '+90 5** *** ** **'}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--togg-teal)' }}>{user.balance.toFixed(2)} ₺</div>
                    <div style={{ fontSize: '10px', color: 'var(--togg-gray-400)' }}>Cüzdan</div>
                  </div>
                </div>

                <div style={{ background: '#0a0f1e', padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--togg-gray-400)', textTransform: 'uppercase', marginBottom: '2px' }}>KYC / Kimlik Onayı</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: user.kycStatus === 'approved' ? 'var(--togg-green)' : (user.kycStatus === 'pending' ? 'var(--togg-orange)' : 'var(--togg-red)') }}>
                      {user.kycStatus === 'approved' ? '✅ Onaylandı' : (user.kycStatus === 'pending' ? '⏳ Onay Bekliyor' : '❌ Eksik')}
                    </div>
                  </div>
                  
                  {user.kycStatus === 'pending' && (
                    <button onClick={approveKyc} style={{ background: 'var(--togg-green)', color: '#0a0f1e', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                      Hemen Onayla
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--togg-gray-500)', padding: '40px 0' }}>
                Aktif oturum açan yeni kayıt bulunamadı. Lütfen ana sekmeden önce sisteme kayıt olun.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FLEET */}
        {activeTab === 'fleet' && (
          <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--togg-gray-300)', marginBottom: '4px' }}>Araç Optimizasyonu ({fleetStatus.length} Araç)</h3>
            
            {fleetStatus.map((v, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '16px', border: v.state === 'maintenance' ? '1px solid rgba(255,165,2,0.3)' : '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ width: '60px', height: '40px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, opacity: v.state === 'maintenance' ? 0.3 : 1 }}>
                    <img src={`/privado/images/${v.model === 'TOGG T10X' ? 'togg-t10x' : 'togg-t10f'}.png`} alt={v.model} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 700, fontSize: '15px', color: '#fff' }}>{v.plate}</span>
                      <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', background: v.state === 'active' ? 'rgba(46,213,115,0.1)' : 'rgba(255,165,2,0.1)', color: v.state === 'active' ? 'var(--togg-green)' : 'var(--togg-orange)', fontWeight: 700 }}>
                        {v.state === 'active' ? 'Sahada 🟢' : 'Bakımda 🟡'}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--togg-gray-400)' }}>{v.model} · 🔋 {v.battery}%</p>
                  </div>
                </div>

                {/* Operations */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button onClick={() => toggleVehicleState(i)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff', fontSize: '12px', fontWeight: 600 }}>
                    {v.state === 'active' ? '🔧 Bakıma / Şarja Al' : '✅ Sahaya Sür'}
                  </button>
                  <button style={{ padding: '10px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '12px', fontWeight: 600 }}>
                    📍 Canlı Konum
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: FINANCE */}
        {activeTab === 'finance' && (
          <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--togg-gray-300)', marginBottom: '4px' }}>Finansal Operasyonlar (Provizyon & Tahsilat)</h3>
            
            {financeLogs.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--togg-gray-500)', padding: '40px 0' }}>Hiç finansal işlem bulunamadı.</div>
            ) : (
              financeLogs.map((log) => (
                <div key={log.id} style={{ background: 'rgba(255,255,255,0.02)', borderLeft: `3px solid ${log.action.includes('TOPUP') ? 'var(--togg-teal)' : 'var(--togg-blue)'}`, borderRadius: '0 12px 12px 0', padding: '16px', display: 'flex', gap: '12px' }}>
                  <div style={{ fontSize: '24px' }}>{log.action.includes('TOPUP') ? '💵' : '💳'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{log.action.includes('TOPUP') ? 'Cüzdan Yüklemesi' : 'Sürüş Tahsilatı'}</span>
                      <span style={{ fontSize: '11px', color: 'var(--togg-gray-400)' }}>{new Date(log.time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--togg-gray-300)', lineHeight: 1.4 }}>{log.details}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 5: SYSTEM LOGS */}
        {activeTab === 'logs' && (
          <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--togg-gray-300)', marginBottom: '8px' }}>Gerçek Zamanlı Sistem Audit Logları</h3>
            
            {logs.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--togg-gray-500)', padding: '40px 0' }}>Henüz log kaydı yok.</div>
            ) : (
              logs.map((log) => {
                const isSystemLog = log.action === 'SYSTEM_START';
                let color = 'var(--togg-blue)';
                if (log.type === 'success') color = 'var(--togg-green)';
                if (log.type === 'warning') color = 'var(--togg-orange)';
                if (log.type === 'error') color = 'var(--togg-red)';

                let icon = '⚡';
                if (log.action.includes('DRIVE')) icon = '🚗';
                if (log.action.includes('WALLET') || log.action.includes('PAYMENT')) icon = '💰';
                if (log.action.includes('USER') || log.action.includes('KYC')) icon = '👤';
                if (log.action.includes('FLEET')) icon = '🔧';

                return (
                  <div key={log.id} style={{
                    background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${color}`,
                    borderRadius: '0 12px 12px 0', padding: '12px 16px', display: 'flex', gap: '12px',
                    opacity: isSystemLog ? 0.6 : 1
                  }}>
                    <div style={{ fontSize: '20px', flexShrink: 0 }}>{icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 800, color: color }}>{log.action}</span>
                        <span style={{ fontSize: '10px', color: 'var(--togg-gray-400)' }}>
                          {new Date(log.time).toLocaleTimeString('tr-TR')}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#fff', lineHeight: 1.4 }}>{log.details}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>
    </div>
  );
}
