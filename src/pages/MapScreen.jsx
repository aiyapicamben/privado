import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Circle, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp, APP_STATES } from '../context/AppContext';
import { mockVehicles, parkingZones, chargingStations, userLocation, getVehicleImage, getVehicleMarker } from '../data/mockData';
import StatusBar from '../components/StatusBar';

// Custom car marker with actual image
function createCarIcon(vehicle) {
  const markerImg = getVehicleMarker(vehicle.model);
  const batteryColor = vehicle.battery > 50 ? '#2ed573' : vehicle.battery > 25 ? '#ffa502' : '#ff4757';
  return L.divIcon({
    className: 'togg-marker',
    html: `
      <div style="position:relative;cursor:pointer;">
        <div style="width:52px;height:52px;border-radius:50%;overflow:hidden;border:3px solid ${batteryColor};box-shadow:0 4px 16px rgba(0,0,0,0.4), 0 0 12px ${batteryColor}44;background:#131b33;">
          <img src="${markerImg}" style="width:100%;height:100%;object-fit:cover;" />
        </div>
        <div style="position:absolute;top:-6px;right:-6px;background:#0a0f1e;color:${batteryColor};font-size:9px;font-weight:800;padding:2px 5px;border-radius:10px;border:2px solid ${batteryColor};line-height:1.2;">${vehicle.battery}%</div>
        <div style="position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:7px solid ${batteryColor};"></div>
      </div>
    `,
    iconSize: [52, 64],
    iconAnchor: [26, 64],
    popupAnchor: [0, -64],
  });
}

// User location marker
const userIcon = L.divIcon({
  className: '',
  html: `
    <div style="position:relative; width: 20px; height: 20px;">
      <div class="radar-ping"></div>
      <div class="user-marker"></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Charging station marker
function createChargingIcon(station) {
  const color = station.available > 0 ? '#2ed573' : '#ff4757';
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;cursor:pointer;">
        <div style="width:38px;height:38px;border-radius:10px;background:rgba(10,15,30,0.95);border:2px solid ${color};display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 12px rgba(0,0,0,0.4), 0 0 10px ${color}44;">⚡</div>
        <div style="position:absolute;top:-6px;right:-6px;background:${color};color:#fff;font-size:8px;font-weight:800;padding:2px 5px;border-radius:8px;line-height:1.2;">${station.available}/${station.total}</div>
      </div>
    `,
    iconSize: [38, 44],
    iconAnchor: [19, 44],
  });
}

// Map center control
function MapCenterButton() {
  const map = useMap();
  return (
    <button
      onClick={() => map.flyTo([userLocation.lat, userLocation.lng], 16, { duration: 0.8 })}
      style={{
        position: 'absolute',
        bottom: '280px',
        right: '16px',
        zIndex: 999,
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        background: 'rgba(19,27,51,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#4facfe',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        cursor: 'pointer',
        backdropFilter: 'blur(10px)',
      }}
    >
      ◎
    </button>
  );
}

// FlyTo component for map transitions
function FlyTo({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lng], 16, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
}

export default function MapScreen() {
  const { navigateTo, selectedVehicle, setSelectedVehicle, showToast } = useApp();
  const [showSheet, setShowSheet] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [flyTo, setFlyTo] = useState(null);

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowSheet(true);
  };

  const handleReserve = () => {
    showToast('Araç 15 dakika ücretsiz rezerve edildi!', 'success');
    setShowSheet(false);
    setTimeout(() => navigateTo(APP_STATES.PRE_DRIVE), 800);
  };

  const handleDirections = () => {
    showToast('Yol tarifi başlatıldı', 'info');
  };

  // Search with Nominatim (OpenStreetMap geocoding)
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 3) { setSearchResults([]); return; }
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' Gemlik Bursa')}&limit=5&accept-language=tr`
      );
      const data = await res.json();
      setSearchResults(data.map(r => ({
        name: r.display_name.split(',').slice(0, 3).join(','),
        lat: parseFloat(r.lat),
        lng: parseFloat(r.lon),
        full: r.display_name,
      })));
    } catch {
      setSearchResults([]);
    }
    setIsSearching(false);
  };

  const selectSearchResult = (result) => {
    setFlyTo({ lat: result.lat, lng: result.lng });
    setSearchQuery(result.name);
    setSearchResults([]);
    showToast(`📍 ${result.name}`, 'info');
  };

  return (
    <div className="screen" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Status bar overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        background: 'linear-gradient(180deg, rgba(10,15,30,0.95) 0%, rgba(10,15,30,0.5) 60%, transparent 100%)',
        paddingBottom: '20px',
      }}>
        <StatusBar />
      </div>

      {/* Search bar overlay */}
      <div style={{
        position: 'absolute',
        top: '48px',
        left: '16px',
        right: '16px',
        zIndex: 999,
      }}>
        <div className="animate-fadeInDown" style={{
          background: 'rgba(19,27,51,0.95)',
          borderRadius: '16px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(0,212,170,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            flexShrink: 0,
          }}>
            🔍
          </div>
          <input
            type="text"
            placeholder={isSearching ? "Aranıyor..." : "Konum veya adres ara..."}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setSearchResults([]); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--togg-gray-400)', cursor: 'pointer', padding: '0 4px' }}
            >
              ✕
            </button>
          )}
          <button
            onClick={() => setShowLegend(!showLegend)}
            style={{
              background: showLegend ? 'rgba(0,212,170,0.15)' : 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: 'var(--togg-white)',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            ☰
          </button>
          <button
            onClick={() => navigateTo(APP_STATES.WALLET)}
            style={{
              background: 'rgba(0,212,170,0.1)',
              border: '1px solid rgba(0,212,170,0.2)',
              borderRadius: '10px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            💳
          </button>
          <button
            onClick={() => navigateTo(APP_STATES.ADMIN_LOGIN)}
            style={{
              background: 'rgba(255,71,87,0.1)',
              border: '1px solid rgba(255,71,87,0.2)',
              borderRadius: '10px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            🛠️
          </button>
          <button
            onClick={() => navigateTo(APP_STATES.SETTINGS)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            ⚙️
          </button>
        </div>

        {showLegend && (
          <div className="animate-fadeInDown" style={{
            marginTop: '8px',
            padding: '16px',
            background: 'rgba(19,27,51,0.95)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--togg-gray-400)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Harita Lejandı
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'rgba(46,213,115,0.35)', border: '2px solid #2ed573' }} />
                <span style={{ fontSize: '13px', color: 'var(--togg-gray-300)' }}>Park Edilebilir Alan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'rgba(255,71,87,0.25)', border: '2px solid #ff4757' }} />
                <span style={{ fontSize: '13px', color: 'var(--togg-gray-300)' }}>Park Yasak Alan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#4facfe', border: '2px solid #fff' }} />
                <span style={{ fontSize: '13px', color: 'var(--togg-gray-300)' }}>Konumunuz</span>
              </div>
            </div>
          </div>
        )}
        {searchResults.length > 0 && (
          <div className="animate-fadeInDown" style={{
            marginTop: '8px',
            background: 'rgba(19,27,51,0.98)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            maxHeight: '200px',
            overflowY: 'auto',
          }}>
            {searchResults.map((result, idx) => (
              <button
                key={idx}
                onClick={() => selectSearchResult(result)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: idx < searchResults.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  color: '#fff',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: '16px' }}>📍</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{result.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--togg-gray-400)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {result.full}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Buttons (Right) */}
      <div style={{
        position: 'absolute',
        right: '16px',
        top: '120px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 998,
      }}>
        <button
          onClick={() => navigateTo(APP_STATES.INSURANCE)}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'rgba(0,212,170,0.15)',
            border: '1px solid rgba(0,212,170,0.3)',
            color: 'var(--togg-teal)',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
          }}
          title="Sigorta & Güvence"
        >
          🛡️
        </button>
        <button
          onClick={() => {
            showToast('En yakın şarj istasyonları filtrelendi', 'info');
          }}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'rgba(255,165,2,0.15)',
            border: '1px solid rgba(255,165,2,0.3)',
            color: '#ffa502',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
          }}
          title="Şarj İstasyonları"
        >
          ⚡
        </button>
      </div>

      {/* Map */}
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={16}
        style={{ width: '100%', height: '100vh' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
        />

        {flyTo && <FlyTo coords={flyTo} />}

        {parkingZones.map((zone) => (
          <Polygon
            key={zone.id}
            positions={zone.coords}
            pathOptions={{
              color: zone.borderColor,
              fillColor: zone.color,
              fillOpacity: 0.3,
              weight: 2,
              dashArray: zone.type === 'restricted' ? '8, 4' : undefined,
            }}
          />
        ))}

        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />
        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={50}
          pathOptions={{
            color: 'rgba(79,172,254,0.3)',
            fillColor: 'rgba(79,172,254,0.1)',
            fillOpacity: 0.3,
            weight: 1,
          }}
        />

        {mockVehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={[vehicle.lat, vehicle.lng]}
            icon={createCarIcon(vehicle)}
            eventHandlers={{ click: () => handleVehicleClick(vehicle) }}
          />
        ))}

        {/* Charging Stations */}
        {chargingStations.map((station) => (
          <Marker
            key={station.id}
            position={[station.lat, station.lng]}
            icon={createChargingIcon(station)}
          >
            <Popup>
              <div style={{ fontFamily: 'Inter, sans-serif', padding: '4px 0', minWidth: '200px' }}>
                <strong style={{ fontSize: '13px' }}>⚡ {station.name}</strong>
                {station.address && <div style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>{station.address}</div>}
                <div style={{ fontSize: '11px', color: '#666', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div>Güç: <b>{station.power}</b></div>
                  <div>Müsait: <b style={{ color: station.available > 0 ? '#2ed573' : '#ff4757' }}>{station.available}/{station.total}</b> soket</div>
                  <div>Tip: {station.type === 'supercharger' ? '🔵 Süper Şarj' : station.type === 'fast' ? '🔴 Hızlı Şarj' : '🟢 Normal Şarj'}</div>
                  {station.operator && <div>Operatör: <b>{station.operator}</b></div>}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        <MapCenterButton />
      </MapContainer>

      {/* Vehicle count badge */}
      <div className="animate-fadeInUp" style={{
        position: 'absolute',
        bottom: showSheet ? '400px' : '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999,
        transition: 'bottom 400ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{
          background: 'rgba(19,27,51,0.95)',
          borderRadius: '20px',
          padding: '8px 18px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--togg-green)',
            boxShadow: '0 0 8px var(--togg-green)',
          }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--togg-gray-300)' }}>
            {mockVehicles.length} araç yakınında
          </span>
        </div>
      </div>

      {/* Bottom Sheet - Vehicle Info */}
      <div className={`bottom-sheet ${showSheet ? 'active' : ''}`} style={{ zIndex: 1000 }}>
        <div className="bottom-sheet-handle" />

        {selectedVehicle && (
          <div>
            {/* Vehicle header with image */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '20px',
            }}>
              {/* Vehicle image */}
              <div style={{
                width: '110px',
                height: '80px',
                borderRadius: '14px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(79,172,254,0.05))',
                border: '1px solid rgba(255,255,255,0.06)',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <img
                  src={getVehicleImage(selectedVehicle.model)}
                  alt={selectedVehicle.model}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '2px' }}>
                      {selectedVehicle.model}
                    </h2>
                    <p style={{ color: 'var(--togg-gray-400)', fontSize: '12px' }}>
                      {selectedVehicle.plate} · {selectedVehicle.color}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSheet(false)}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: 'none',
                      borderRadius: '8px',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--togg-gray-400)',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {selectedVehicle.features.slice(0, 2).map((f, i) => (
                    <span key={i} style={{
                      background: 'rgba(0,212,170,0.08)',
                      color: 'var(--togg-teal)',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 600,
                    }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '8px',
              marginBottom: '16px',
            }}>
              {[
                {
                  value: `${selectedVehicle.battery}%`,
                  label: 'Batarya',
                  icon: '🔋',
                  color: selectedVehicle.battery > 50 ? 'var(--togg-green)' : 'var(--togg-orange)',
                },
                {
                  value: `${selectedVehicle.range}`,
                  label: 'km Menzil',
                  icon: '📏',
                  color: 'var(--togg-white)',
                },
                {
                  value: '150m',
                  label: 'Uzaklık',
                  icon: '📍',
                  color: 'var(--togg-blue)',
                },
              ].map((stat, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '12px',
                  padding: '12px 8px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: stat.color, marginBottom: '2px' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--togg-gray-400)' }}>
                    {stat.icon} {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '14px',
              padding: '14px',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-around',
              border: '1px solid rgba(255,255,255,0.04)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--togg-gray-400)', marginBottom: '4px' }}>
                  Sürüş
                </div>
                <div style={{ fontWeight: 800, fontSize: '18px' }}>
                  {selectedVehicle.pricing.driving}
                  <span style={{ fontSize: '12px', color: 'var(--togg-gray-400)', fontWeight: 400 }}> ₺/dk</span>
                </div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.06)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--togg-gray-400)', marginBottom: '4px' }}>
                  Bekleme
                </div>
                <div style={{ fontWeight: 800, fontSize: '18px' }}>
                  {selectedVehicle.pricing.waiting}
                  <span style={{ fontSize: '12px', color: 'var(--togg-gray-400)', fontWeight: 400 }}> ₺/dk</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleDirections}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '14px',
                  padding: '14px',
                  color: 'var(--togg-white)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                🗺️ Yol Tarifi
              </button>
              <button
                onClick={handleReserve}
                style={{
                  flex: 2,
                  background: 'linear-gradient(135deg, #00d4aa, #4facfe)',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '14px',
                  color: '#0a0f1e',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0,212,170,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                Rezerve Et · 15 dk
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={`bottom-sheet-overlay ${showSheet ? 'active' : ''}`} onClick={() => setShowSheet(false)} />
    </div>
  );
}
