import { useState } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import { useAdminStore } from '../store/useAdminStore';
import { mockVehicles } from '../data/mockData';
import StatusBar from '../components/StatusBar';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customAdminMarker = L.divIcon({
  className: 'togg-marker',
  html: `<div class="togg-marker-inner" style="width: 32px; height: 32px; font-size: 14px; box-shadow: 0 0 10px rgba(0,212,170,0.8);">🚗</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const maintenanceMarker = L.divIcon({
  className: 'togg-marker',
  html: `<div class="togg-marker-inner" style="width: 32px; height: 32px; font-size: 14px; background: var(--gradient-danger); box-shadow: 0 0 10px rgba(255,71,87,0.8);">🔧</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export default function AdminDashboard() {
  const { navigateTo, logs, tripHistory, user, setUser, addLog, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [fleetStatus, setFleetStatus] = useState(
    mockVehicles.map(v => ({ ...v, state: v.battery < 20 ? 'maintenance' : 'active' }))
  );

  const totalRevenue = tripHistory.reduce((sum, trip) => sum + trip.cost, 0);
  const activeVehicles = fleetStatus.filter(v => v.state === 'active').length;
  const maintenanceVehicles = fleetStatus.length - activeVehicles;

  const telemetryData = useAdminStore((state) => state.telemetryData);
  const safeModeAlerts = useAdminStore((state) => state.safeModeAlerts);
  const clearAlerts = useAdminStore((state) => state.clearAlerts);
  
  // Recharts mock data
  const hourlyData = [
    { time: '08:00', rentals: 12 }, { time: '10:00', rentals: 25 },
    { time: '12:00', rentals: 42 }, { time: '14:00', rentals: 38 },
    { time: '16:00', rentals: 55 }, { time: '18:00', rentals: 48 },
    { time: '20:00', rentals: 30 },
  ];
  
  const revenueData = [
    { name: '16 TG 1001', revenue: 450 }, { name: '16 TG 2002', revenue: 320 },
    { name: '16 TG 3003', revenue: 680 }, { name: '16 TG 4004', revenue: 150 },
    { name: '16 TG 5005', revenue: 540 },
  ];
  
  const statusData = [
    { name: 'Aktif Sürüş', value: 45, color: '#00d4aa' },
    { name: 'Boşta', value: 35, color: '#4facfe' },
    { name: 'Şarjda', value: 20, color: '#ff4757' },
  ];

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

  const executeRemoteCommand = (vehicle, command) => {
    addLog(
      'REMOTE_COMMAND',
      `⚡ ${vehicle.plate} araca "${command}" komutu gönderildi.`,
      'success'
    );
    showToast(`Komut başarıyla iletildi: ${command}`, 'success');
  };

  const financeLogs = logs.filter(l => l.action.includes('PAYMENT') || l.action.includes('TOPUP'));

  const exportFinanceCSV = () => {
    if (financeLogs.length === 0) return showToast('Dışa aktarılacak veri yok.', 'error');
    const headers = ['ID', 'Tarih', 'İşlem Tipi', 'Detay'];
    const csvContent = [
      headers.join(','),
      ...financeLogs.map(log => `"${log.id}","${new Date(log.time).toLocaleString()}","${log.action}","${log.details}"`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `finans_raporu_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Finans raporu indiriliyor...', 'success');
  };

  return (
    <div className="screen" style={{ background: '#0a0f1e' }}>
      <StatusBar />
      
      {/* SAFE MODE BANNER */}
      {safeModeAlerts.length > 0 && (
        <div className="animate-fadeInDown" style={{ background: 'var(--togg-red)', color: '#fff', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '13px' }}>SAFE MODE TETİKLENDİ</div>
              <div style={{ fontSize: '11px' }}>{safeModeAlerts[0].message} ({safeModeAlerts[0].vehicleId})</div>
            </div>
          </div>
          <button onClick={clearAlerts} style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>GİZLE</button>
        </div>
      )}
      
      {/* Header */}
      <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'center', gap: '16px', background: '#131b33', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={() => navigateTo(APP_STATES.MAP)} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px', width: '40px', height: '40px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', cursor: 'pointer',
        }}>←</button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>Gelişmiş Operasyon Paneli</h1>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}><span className="brand-glow-sm">Turla</span> Admin</p>
        </div>
      </div>

      {/* Modern Horizontal Tabs */}
      <div style={{ display: 'flex', overflowX: 'auto', padding: '16px 20px', gap: '8px', WebkitOverflowScrolling: 'touch', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {[
          { id: 'overview', icon: '📊', label: 'Özet' },
          { id: 'map', icon: '🗺️', label: 'Canlı Harita' },
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

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginTop: '8px' }}>
              
              {/* Line Chart: Hourly Density */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '20px', color: 'var(--togg-gray-300)' }}>📈 Saatlik Kiralama Yoğunluğu</h3>
                <div style={{ height: '200px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="time" stroke="var(--togg-gray-400)" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ background: '#131b33', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="rentals" stroke="var(--togg-teal)" strokeWidth={3} dot={{ r: 4, fill: '#0a0f1e', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart & Pie Chart Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px' }}>
                {/* Bar Chart */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: 'var(--togg-gray-300)' }}>📊 Araç Başına Gelir (₺)</h3>
                  <div style={{ height: '180px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="name" stroke="var(--togg-gray-400)" fontSize={9} tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--togg-gray-400)" fontSize={9} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#131b33', border: 'none', borderRadius: '8px' }} />
                        <Bar dataKey="revenue" fill="var(--togg-blue)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Donut Chart */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '0', color: 'var(--togg-gray-300)' }}>⭕ Filo Durumu</h3>
                  <div style={{ height: '160px', width: '100%', position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#131b33', border: 'none', borderRadius: '8px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: 800 }}>%45</div>
                      <div style={{ fontSize: '9px', color: 'var(--togg-gray-400)' }}>Aktif</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 1.5: LIVE MAP */}
        {activeTab === 'map' && (
          <div className="animate-fadeInUp" style={{ height: 'calc(100vh - 200px)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <MapContainer 
              center={[40.4340, 29.1575]} 
              zoom={14} 
              style={{ height: '100%', width: '100%', background: '#0a0f1e' }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution="&copy; OpenStreetMap contributors &copy; CARTO"
              />
              {fleetStatus.map((vehicle, idx) => (
                <Marker 
                  key={idx} 
                  position={[vehicle.lat, vehicle.lng]}
                  icon={vehicle.state === 'maintenance' ? maintenanceMarker : customAdminMarker}
                >
                  <Popup className="togg-popup custom-popup">
                    <div style={{ background: '#131b33', padding: '12px', borderRadius: '12px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <h4 style={{ margin: '0 0 4px', fontSize: '14px', color: 'var(--togg-teal)' }}>{vehicle.plate}</h4>
                      <div style={{ fontSize: '12px', color: 'var(--togg-gray-300)', marginBottom: '8px' }}>
                        {vehicle.model} • 🔋 {vehicle.battery}%
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--togg-gray-400)' }}>
                        Durum: {vehicle.state === 'active' ? 'Sahada 🟢' : 'Bakımda 🟡'}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <button onClick={() => toggleVehicleState(i)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff', fontSize: '12px', fontWeight: 600 }}>
                    {v.state === 'active' ? '🔧 Bakıma Al' : '✅ Sahaya Sür'}
                  </button>
                  <button onClick={() => setActiveTab('map')} style={{ padding: '10px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '12px', fontWeight: 600 }}>
                    📍 Haritada Gör
                  </button>
                </div>

                {/* Advanced Remote Commands */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '6px' }}>
                  <button onClick={() => executeRemoteCommand(v, 'Kapıları Kilitle')} style={{ padding: '8px 4px', borderRadius: '6px', border: 'none', background: 'rgba(79,172,254,0.1)', color: 'var(--togg-blue)', fontSize: '10px', fontWeight: 800 }}>🔒 Kilitle</button>
                  <button onClick={() => executeRemoteCommand(v, 'Kapıları Aç')} style={{ padding: '8px 4px', borderRadius: '6px', border: 'none', background: 'rgba(46,213,115,0.1)', color: 'var(--togg-green)', fontSize: '10px', fontWeight: 800 }}>🔓 Aç</button>
                  <button onClick={() => executeRemoteCommand(v, 'Korna Çal')} style={{ padding: '8px 4px', borderRadius: '6px', border: 'none', background: 'rgba(255,165,2,0.1)', color: 'var(--togg-orange)', fontSize: '10px', fontWeight: 800 }}>📢 Korna</button>
                  <button onClick={() => executeRemoteCommand(v, 'Farları Yak')} style={{ padding: '8px 4px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '10px', fontWeight: 800 }}>💡 Farlar</button>
                </div>

                {/* Telemetry Live Data */}
                {telemetryData[v.id] && (
                  <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--togg-gray-400)', textTransform: 'uppercase' }}>Canlı Telemetri</span>
                      <span className="live-indicator">LIVE</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{telemetryData[v.id].speed} <span style={{ fontSize: '10px', color: 'var(--togg-gray-500)', fontWeight: 400 }}>km/h</span></div>
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--togg-green)' }}>{telemetryData[v.id].battery} <span style={{ fontSize: '10px', color: 'var(--togg-gray-500)', fontWeight: 400 }}>%</span></div>
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>12.4 <span style={{ fontSize: '10px', color: 'var(--togg-gray-500)', fontWeight: 400 }}>kW</span></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: FINANCE */}
        {activeTab === 'finance' && (
          <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--togg-gray-300)' }}>Finansal Operasyonlar</h3>
              <button 
                onClick={exportFinanceCSV} 
                style={{ padding: '6px 12px', background: 'rgba(0,212,170,0.1)', border: '1px solid var(--togg-teal)', borderRadius: '8px', color: 'var(--togg-teal)', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
              >
                📥 Excel İndir (CSV)
              </button>
            </div>
            
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
