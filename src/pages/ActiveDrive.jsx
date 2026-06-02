import { useState, useEffect, useRef } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import { getVehicleImage } from '../data/mockData';
import { useAdminStore } from '../store/useAdminStore';
import StatusBar from '../components/StatusBar';
import SwipeButton from '../components/SwipeButton';
import AppleEmoji from '../components/AppleEmoji';

export default function ActiveDrive() {
  const { navigateTo, selectedVehicle, driveState, setDriveState, showToast, sendTelemetryCommand } = useApp();
  const socket = useAdminStore((state) => state.socket);
  const [isSocketConnected, setIsSocketConnected] = useState(true);

  const [elapsed, setElapsed] = useState(0);
  const [cost, setCost] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [drivingSeconds, setDrivingSeconds] = useState(0);
  const [waitingSeconds, setWaitingSeconds] = useState(0);

  // Dynamic Telemetry states for wow factor
  const [speed, setSpeed] = useState(0);
  const [engineLoad, setEngineLoad] = useState(0);
  const [batteryState, setBatteryState] = useState(selectedVehicle?.battery || 82);
  const [rangeLeft, setRangeLeft] = useState(380);
  
  // Individual loading states for IoT commands
  const [loadingStates, setLoadingStates] = useState({
    ac: false,
    lights: false,
    trunk: false,
    lockUnlock: false,
  });

  const [acOn, setAcOn] = useState(false);
  const [lightsOn, setLightsOn] = useState(false);
  const [trunkOpen, setTrunkOpen] = useState(false);

  const vehicleImg = getVehicleImage(selectedVehicle?.model);
  const drivingRate = selectedVehicle?.pricing?.driving || 10;
  const waitingRate = selectedVehicle?.pricing?.waiting || 2;

  // Track socket connection status
  useEffect(() => {
    if (!socket) {
      setIsSocketConnected(false);
      return;
    }
    
    const handleConnect = () => setIsSocketConnected(true);
    const handleDisconnect = () => setIsSocketConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    setIsSocketConnected(socket.connected);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket]);

  // Smooth Cost, Timer, and Dial telemetry update
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => {
        const nextTime = prev + 1;
        // Deplete range and battery very slowly (realistic for a 30-min demo)
        if (nextTime % 180 === 0) {
          setBatteryState(b => Math.max(b - 1, 10));
          setRangeLeft(r => Math.max(r - 1, 50));
        }
        return nextTime;
      });
      setCost(prev => prev + (isPaused ? waitingRate : drivingRate) / 60);
      
      // Track real driving and waiting seconds
      if (isPaused) {
        setWaitingSeconds(w => w + 1);
      } else {
        setDrivingSeconds(d => d + 1);
      }

      // Simulating real-time acceleration fluctuations
      if (!isPaused) {
        setSpeed(prev => {
          const target = Math.random() > 0.65 ? Math.floor(Math.random() * 45 + 50) : prev;
          const diff = target - prev;
          const step = Math.sign(diff) * Math.ceil(Math.abs(diff) * 0.15);
          const nextSpeed = prev + step;
          return Math.max(0, Math.min(nextSpeed, 120));
        });
        setEngineLoad(Math.floor(Math.random() * 40 + 20));
      } else {
        setSpeed(0);
        setEngineLoad(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, drivingRate, waitingRate]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePause = async () => {
    if (loadingStates.lockUnlock) return;
    setLoadingStates(prev => ({ ...prev, lockUnlock: true }));
    showToast(isPaused ? 'Kapılar açılıyor, lütfen bekleyin...' : 'Kapılar kilitleniyor...', 'info');
    
    await sendTelemetryCommand(selectedVehicle?.id || 1, isPaused ? 'UNLOCK_DOORS' : 'LOCK_DOORS');
    
    setIsPaused(!isPaused);
    setLoadingStates(prev => ({ ...prev, lockUnlock: false }));
    showToast(isPaused ? 'Sürüş devam ediyor · Kapılar açıldı' : 'Bekleme modu · Kapılar kilitlendi', 'success');
  };

  const handleEndDrive = () => {
    setDriveState({ 
      isActive: false, 
      elapsedSeconds: elapsed, 
      totalCostTL: cost,
      drivingSeconds: drivingSeconds,
      waitingSeconds: waitingSeconds
    });
    navigateTo(APP_STATES.END_DRIVE);
  };

  const handleTriggerSafeModeSimulation = () => {
    if (socket && selectedVehicle) {
      socket.emit('triggerSafeMode', { vehicleId: selectedVehicle.id });
      showToast('Safe Mode acil durum uyarısı merkeze iletildi!', 'warning');
    } else {
      showToast('Sunucu bağlantısı doğrulanıyor...', 'info');
    }
  };

  const isAnyLoading = Object.values(loadingStates).some(state => state);

  return (
    <div className="screen" style={{
      background: isPaused
        ? 'linear-gradient(180deg, #0f0a20 0%, #03060f 100%)'
        : 'linear-gradient(180deg, #090e1a 0%, #03050a 100%)',
      transition: 'background 600ms ease',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <StatusBar />

      {/* PREMIUM TELEMETRY ACTIVE BANNER */}
      {!isSocketConnected && (
        <div className="animate-fadeInDown" style={{
          background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.15) 0%, rgba(79, 172, 254, 0.1) 100%)',
          color: '#00d4aa',
          padding: '8px 16px',
          textAlign: 'center',
          fontSize: '11px',
          fontWeight: 700,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          borderBottom: '1px solid rgba(0, 212, 170, 0.2)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(12px)',
          zIndex: 100
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00d4aa', boxShadow: '0 0 8px #00d4aa' }} />
          <span>Turla Telemetri Simülasyonu Aktif (Maksimum Hassasiyet)</span>
        </div>
      )}

      {/* Title & Mode badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={handleTriggerSafeModeSimulation}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2ed573', boxShadow: '0 0 8px #2ed573' }} />
          <span style={{ fontSize: '12px', color: 'var(--togg-teal)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Turla IoT</span>
        </div>
        <span style={{
          background: isPaused ? 'rgba(255,165,2,0.12)' : 'rgba(0,212,170,0.12)',
          color: isPaused ? '#ffa502' : 'var(--togg-teal)',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 800,
          border: `1.5px solid ${isPaused ? 'rgba(255,165,2,0.25)' : 'rgba(0,212,170,0.25)'}`,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {isPaused ? '⏸️ Bekleme Modu' : '⚡ Sürüş Aktif'}
        </span>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        padding: '0 20px',
      }}>
        {/* Advanced Gauge Cluster Interface */}
        <div style={{
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(10,18,36,0.85) 0%, rgba(2,6,15,0.98) 100%)',
          border: '4px solid rgba(255, 255, 255, 0.03)',
          boxShadow: isPaused 
            ? '0 12px 40px rgba(255,165,2,0.15), inset 0 2px 24px rgba(255,255,255,0.02)' 
            : '0 12px 40px rgba(0,212,170,0.15), inset 0 2px 24px rgba(255,255,255,0.02)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          transition: 'all 500ms ease'
        }}>
          {/* Inner ring background */}
          <div style={{
            position: 'absolute',
            inset: '12px',
            borderRadius: '50%',
            border: '1px dashed rgba(255,255,255,0.08)'
          }} />

          {/* Animated Speed Gauge Outer Arc */}
          <div style={{
            position: 'absolute',
            inset: '6px',
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: isPaused ? 'rgba(255,165,2,0.6)' : 'var(--togg-teal)',
            borderRightColor: isPaused ? 'rgba(255,165,2,0.3)' : 'var(--togg-blue)',
            transform: `rotate(${speed * 1.5}deg)`,
            transition: 'transform 1000ms cubic-bezier(0.1, 0.8, 0.2, 1)'
          }} />

          {/* Telemetry labels */}
          <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--togg-gray-400)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '2px' }}>
            HIZ (KM/H)
          </span>
          <div style={{ fontSize: '64px', fontWeight: 900, lineHeight: 1, color: '#fff', fontVariantNumeric: 'tabular-nums', letterSpacing: '-2px' }}>
            {speed}
          </div>

          <div style={{ height: '1px', width: '60px', background: 'rgba(255,255,255,0.1)', margin: '10px 0' }} />

          {/* Tutar Counter */}
          <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--togg-teal)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '2px' }}>
            TOPLAM TUTAR
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: '32px', fontWeight: 900, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
              {cost.toFixed(1)}
            </span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--togg-teal)', marginLeft: '3px' }}>₺</span>
          </div>

          {/* Battery and Range Mini Panel */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '12px' }}>🔋</span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#fff' }}>%{batteryState}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '12px' }}>🛣️</span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#fff' }}>{rangeLeft} km</span>
            </div>
          </div>
        </div>

        {/* Dynamic Telemetry Panel */}
        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
          <div className="glass-card" style={{ flex: 1, padding: '12px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: '9px', color: 'var(--togg-gray-400)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>Geçen Süre</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{formatTime(elapsed)}</span>
          </div>
          <div className="glass-card" style={{ flex: 1, padding: '12px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: '9px', color: 'var(--togg-gray-400)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>Motor Yükü</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--togg-blue)', fontVariantNumeric: 'tabular-nums' }}>%{engineLoad}</span>
          </div>
        </div>

        {/* Remote Smart Control IoT Pedestal */}
        <div className="glass-card" style={{
          width: '100%',
          padding: '16px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          opacity: isAnyLoading ? 0.75 : 1,
          transition: 'all 300ms ease'
        }}>
          {/* AC Command Button */}
          <button 
            disabled={isAnyLoading}
            onClick={async () => {
              setLoadingStates(prev => ({ ...prev, ac: true }));
              showToast('Klima komutu araca iletiliyor...', 'info');
              await sendTelemetryCommand(selectedVehicle?.id || 1, acOn ? 'STOP_AC' : 'START_AC');
              setAcOn(!acOn);
              setLoadingStates(prev => ({ ...prev, ac: false }));
              showToast(acOn ? 'Klima kapatıldı' : 'Klima 22°C ayarında açıldı', 'success');
            }} 
            style={{
              background: acOn ? 'rgba(0, 212, 170, 0.15)' : 'rgba(255,255,255,0.03)',
              border: `1.5px solid ${acOn ? 'var(--togg-teal)' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: '16px', padding: '12px 8px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '8px', color: acOn ? 'var(--togg-teal)' : '#fff',
              position: 'relative', overflow: 'hidden', cursor: isAnyLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {loadingStates.ac ? (
              <div className="animate-spin" style={{ width: '24px', height: '24px', border: '2.5px solid var(--togg-teal)', borderTopColor: 'transparent', borderRadius: '50%', margin: '4px' }} />
            ) : (
              <AppleEmoji symbol={acOn ? '❄️' : '🌬️'} size={24} />
            )}
            <span style={{ fontSize: '11px', fontWeight: 700 }}>Klima</span>
          </button>

          {/* Lights Command Button */}
          <button 
            disabled={isAnyLoading}
            onClick={async () => {
              setLoadingStates(prev => ({ ...prev, lights: true }));
              showToast('Far komutu araca iletiliyor...', 'info');
              await sendTelemetryCommand(selectedVehicle?.id || 1, lightsOn ? 'LIGHTS_OFF' : 'LIGHTS_ON');
              setLightsOn(!lightsOn);
              setLoadingStates(prev => ({ ...prev, lights: false }));
              showToast(lightsOn ? 'Farlar söndürüldü' : 'Farlar yakıldı', 'success');
            }} 
            style={{
              background: lightsOn ? 'rgba(255, 165, 2, 0.15)' : 'rgba(255,255,255,0.03)',
              border: `1.5px solid ${lightsOn ? '#ffa502' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: '16px', padding: '12px 8px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '8px', color: lightsOn ? '#ffa502' : '#fff',
              position: 'relative', overflow: 'hidden', cursor: isAnyLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {loadingStates.lights ? (
              <div className="animate-spin" style={{ width: '24px', height: '24px', border: '2.5px solid #ffa502', borderTopColor: 'transparent', borderRadius: '50%', margin: '4px' }} />
            ) : (
              <AppleEmoji symbol="💡" size={24} />
            )}
            <span style={{ fontSize: '11px', fontWeight: 700 }}>Farlar</span>
          </button>

          {/* Trunk Command Button */}
          <button 
            disabled={isAnyLoading}
            onClick={async () => {
              if (!trunkOpen && speed > 0) {
                showToast('Güvenlik nedeniyle araç hareket halindeyken bagaj açılamaz!', 'error');
                return;
              }
              setLoadingStates(prev => ({ ...prev, trunk: true }));
              showToast('Bagaj komutu araca iletiliyor...', 'info');
              await sendTelemetryCommand(selectedVehicle?.id || 1, trunkOpen ? 'CLOSE_TRUNK' : 'OPEN_TRUNK');
              setTrunkOpen(!trunkOpen);
              setLoadingStates(prev => ({ ...prev, trunk: false }));
              showToast(trunkOpen ? 'Bagaj kapandı' : 'Bagaj açıldı', 'success');
            }} 
            style={{
              background: trunkOpen ? 'rgba(79, 172, 254, 0.15)' : 'rgba(255,255,255,0.03)',
              border: `1.5px solid ${trunkOpen ? '#4facfe' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: '16px', padding: '12px 8px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '8px', color: trunkOpen ? '#4facfe' : '#fff',
              position: 'relative', overflow: 'hidden', cursor: isAnyLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {loadingStates.trunk ? (
              <div className="animate-spin" style={{ width: '24px', height: '24px', border: '2.5px solid #4facfe', borderTopColor: 'transparent', borderRadius: '50%', margin: '4px' }} />
            ) : (
              <AppleEmoji symbol="🚘" size={24} />
            )}
            <span style={{ fontSize: '11px', fontWeight: 700 }}>Bagaj</span>
          </button>
        </div>
      </div>

      {/* Controls / End Drive swipe */}
      <div style={{ padding: '0 20px 36px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button 
          onClick={handlePause} 
          disabled={isAnyLoading} 
          style={{
            width: '100%', padding: '18px', borderRadius: '16px', fontWeight: 800, fontSize: '15px',
            cursor: isAnyLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            background: isPaused ? 'linear-gradient(135deg, #00d4aa, #4facfe)' : 'rgba(255,255,255,0.06)',
            border: isPaused ? 'none' : '1px solid rgba(255,255,255,0.08)',
            color: isPaused ? '#0a0f1e' : '#fff',
            boxShadow: isPaused ? '0 4px 20px rgba(0,212,170,0.3)' : 'none',
            opacity: loadingStates.lockUnlock ? 0.7 : 1,
            transition: 'all 300ms ease',
          }}
        >
          {loadingStates.lockUnlock ? (
            <><div className="animate-spin" style={{ width: '16px', height: '16px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%' }} /> İletişim Kuruluyor...</>
          ) : (
            isPaused 
              ? <><AppleEmoji symbol="▶️" size={16} /> Kapıları Aç & Devam Et</> 
              : <><AppleEmoji symbol="🔒" size={16} /> Kapıları Kilitle & Bekle</>
          )}
        </button>
        <SwipeButton onSwipe={handleEndDrive} label="Sürüşü Bitir" icon="■" />
      </div>
    </div>
  );
}

