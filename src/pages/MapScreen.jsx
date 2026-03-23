import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp, APP_STATES } from '../context/AppContext';
import { mockVehicles, parkingZones, userLocation } from '../data/mockData';
import StatusBar from '../components/StatusBar';

// Custom car marker icon
function createCarIcon(battery) {
  const color = battery > 50 ? '#2ed573' : battery > 25 ? '#ffa502' : '#ff4757';
  return L.divIcon({
    className: 'togg-marker',
    html: `
      <div class="togg-marker-inner">
        🚘
        <span class="togg-marker-battery ${battery < 30 ? 'low' : ''}">${battery}%</span>
      </div>
    `,
    iconSize: [44, 52],
    iconAnchor: [22, 52],
    popupAnchor: [0, -52],
  });
}

// User location marker
const userIcon = L.divIcon({
  className: '',
  html: '<div class="user-marker"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

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
        width: '44px',
        height: '44px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--togg-navy-light)',
        border: '1px solid var(--glass-border)',
        color: 'var(--togg-blue)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        boxShadow: 'var(--shadow-lg)',
        cursor: 'pointer',
      }}
    >
      📍
    </button>
  );
}

export default function MapScreen() {
  const { navigateTo, selectedVehicle, setSelectedVehicle, showToast } = useApp();
  const [showSheet, setShowSheet] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowSheet(true);
  };

  const handleReserve = () => {
    showToast('Araç 15 dakika ücretsiz rezerve edildi! ⏱️', 'success');
    setShowSheet(false);
    setTimeout(() => navigateTo(APP_STATES.PRE_DRIVE), 800);
  };

  const handleDirections = () => {
    showToast('Yol tarifi başlatıldı 🗺️', 'info');
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
        background: 'linear-gradient(180deg, rgba(10,15,30,0.9) 0%, transparent 100%)',
        paddingBottom: '16px',
      }}>
        <StatusBar />
      </div>

      {/* Search bar overlay */}
      <div style={{
        position: 'absolute',
        top: '52px',
        left: '16px',
        right: '16px',
        zIndex: 999,
      }}>
        <div className="animate-fadeInDown" style={{
          background: 'var(--togg-navy-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <span style={{ fontSize: '18px' }}>🔍</span>
          <span style={{
            flex: 1,
            color: 'var(--togg-gray-400)',
            fontSize: 'var(--font-sm)',
          }}>
            Konum veya adres ara...
          </span>
          <button
            onClick={() => setShowLegend(!showLegend)}
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-sm)',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: 'var(--togg-white)',
            }}
          >
            ℹ️
          </button>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="animate-fadeInDown glass-card" style={{
            marginTop: '8px',
            padding: 'var(--space-md)',
            background: 'var(--togg-navy-light)',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'rgba(46, 213, 115, 0.4)', border: '2px solid #2ed573' }} />
                <span style={{ fontSize: 'var(--font-sm)', color: 'var(--togg-gray-300)' }}>Park Edilebilir Alan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'rgba(255, 71, 87, 0.3)', border: '2px solid #ff4757' }} />
                <span style={{ fontSize: 'var(--font-sm)', color: 'var(--togg-gray-300)' }}>Park Yasak Alan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'var(--togg-blue)', border: '2px solid white' }} />
                <span style={{ fontSize: 'var(--font-sm)', color: 'var(--togg-gray-300)' }}>Konumunuz</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={15}
        style={{ width: '100%', height: '100vh' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Parking zones */}
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

        {/* User location */}
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />
        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={50}
          pathOptions={{
            color: 'rgba(79, 172, 254, 0.3)',
            fillColor: 'rgba(79, 172, 254, 0.1)',
            fillOpacity: 0.3,
            weight: 1,
          }}
        />

        {/* Vehicle markers */}
        {mockVehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={[vehicle.lat, vehicle.lng]}
            icon={createCarIcon(vehicle.battery)}
            eventHandlers={{
              click: () => handleVehicleClick(vehicle),
            }}
          />
        ))}

        <MapCenterButton />
      </MapContainer>

      {/* Vehicle count badge */}
      <div className="animate-fadeInUp" style={{
        position: 'absolute',
        bottom: showSheet ? '370px' : '110px',
        left: '16px',
        right: '16px',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 999,
        transition: 'bottom var(--transition-slow)',
      }}>
        <div style={{
          background: 'var(--togg-navy-light)',
          borderRadius: 'var(--radius-full)',
          padding: '8px 20px',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--togg-green)',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          <span style={{
            fontSize: 'var(--font-sm)',
            fontWeight: 600,
          }}>
            {mockVehicles.length} araç yakınında
          </span>
        </div>
      </div>

      {/* Bottom Sheet - Vehicle Info */}
      <div
        className={`bottom-sheet ${showSheet ? 'active' : ''}`}
        style={{ zIndex: 1000 }}
      >
        <div className="bottom-sheet-handle" />

        {selectedVehicle && (
          <div>
            {/* Vehicle header */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-lg)',
            }}>
              <div>
                <h2 style={{
                  fontSize: 'var(--font-xl)',
                  fontWeight: 800,
                  marginBottom: '2px',
                }}>
                  {selectedVehicle.model}
                </h2>
                <p style={{
                  color: 'var(--togg-gray-400)',
                  fontSize: 'var(--font-sm)',
                }}>
                  {selectedVehicle.plate} • {selectedVehicle.color}
                </p>
              </div>
              <button
                onClick={() => setShowSheet(false)}
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-sm)',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--togg-gray-400)',
                  fontSize: '14px',
                }}
              >
                ✕
              </button>
            </div>

            {/* Stats row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 'var(--space-sm)',
              marginBottom: 'var(--space-lg)',
            }}>
              <div className="glass-card" style={{
                padding: 'var(--space-md)',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: 'var(--font-xl)',
                  fontWeight: 800,
                  color: selectedVehicle.battery > 50 ? 'var(--togg-green)' : 'var(--togg-orange)',
                  marginBottom: '2px',
                }}>
                  {selectedVehicle.battery}%
                </div>
                <div style={{
                  fontSize: 'var(--font-xs)',
                  color: 'var(--togg-gray-400)',
                }}>
                  🔋 Batarya
                </div>
              </div>
              <div className="glass-card" style={{
                padding: 'var(--space-md)',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: 'var(--font-xl)',
                  fontWeight: 800,
                  marginBottom: '2px',
                }}>
                  {selectedVehicle.range}
                </div>
                <div style={{
                  fontSize: 'var(--font-xs)',
                  color: 'var(--togg-gray-400)',
                }}>
                  📏 km Menzil
                </div>
              </div>
              <div className="glass-card" style={{
                padding: 'var(--space-md)',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: 'var(--font-xl)',
                  fontWeight: 800,
                  color: 'var(--togg-teal)',
                  marginBottom: '2px',
                }}>
                  150m
                </div>
                <div style={{
                  fontSize: 'var(--font-xs)',
                  color: 'var(--togg-gray-400)',
                }}>
                  📍 Uzaklık
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="glass-card" style={{
              padding: 'var(--space-md)',
              marginBottom: 'var(--space-lg)',
              display: 'flex',
              justifyContent: 'space-around',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'var(--font-sm)',
                  color: 'var(--togg-gray-400)',
                  marginBottom: '4px',
                }}>
                  🚗 Sürüş
                </div>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-lg)' }}>
                  {selectedVehicle.pricing.driving} ₺
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--togg-gray-400)', fontWeight: 400 }}>/dk</span>
                </div>
              </div>
              <div style={{
                width: '1px',
                background: 'var(--glass-border)',
              }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'var(--font-sm)',
                  color: 'var(--togg-gray-400)',
                  marginBottom: '4px',
                }}>
                  ⏸️ Bekleme
                </div>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-lg)' }}>
                  {selectedVehicle.pricing.waiting} ₺
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--togg-gray-400)', fontWeight: 400 }}>/dk</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div style={{
              display: 'flex',
              gap: 'var(--space-sm)',
              flexWrap: 'wrap',
              marginBottom: 'var(--space-lg)',
            }}>
              {selectedVehicle.features.map((f, i) => (
                <span key={i} className="badge badge-success">
                  ✦ {f}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: 'var(--space-md)',
            }}>
              <button
                className="btn btn-secondary"
                onClick={handleDirections}
                style={{ flex: 1 }}
              >
                🗺️ Yol Tarifi
              </button>
              <button
                className="btn btn-primary"
                onClick={handleReserve}
                style={{ flex: 2 }}
              >
                ⏱️ Rezerve Et (15 dk)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Overlay */}
      <div
        className={`bottom-sheet-overlay ${showSheet ? 'active' : ''}`}
        onClick={() => setShowSheet(false)}
      />
    </div>
  );
}
