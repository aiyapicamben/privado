import { useState, useEffect, useRef } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import { getVehicleImage } from '../data/mockData';
import StatusBar from '../components/StatusBar';
import SwipeButton from '../components/SwipeButton';

export default function ActiveDrive() {
  const { navigateTo, selectedVehicle, driveState, setDriveState, showToast, sendTelemetryCommand } = useApp();
  const [elapsed, setElapsed] = useState(0);
  const [cost, setCost] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [acOn, setAcOn] = useState(false);
  const [lightsOn, setLightsOn] = useState(false);
  const [trunkOpen, setTrunkOpen] = useState(false);
  const [isCommandLoading, setIsCommandLoading] = useState(false);

  const vehicleImg = getVehicleImage(selectedVehicle?.model);
  const drivingRate = selectedVehicle?.pricing?.driving || 10;
  const waitingRate = selectedVehicle?.pricing?.waiting || 2;

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => prev + 1);
      setCost(prev => prev + (isPaused ? waitingRate : drivingRate) / 60);
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
    if (isCommandLoading) return;
    setIsCommandLoading(true);
    showToast(isPaused ? 'Kapılar açılıyor, lütfen bekleyin...' : 'Kapılar kilitleniyor...', 'info');
    
    await sendTelemetryCommand(selectedVehicle?.id || 1, isPaused ? 'UNLOCK_DOORS' : 'LOCK_DOORS');
    
    setIsPaused(!isPaused);
    setIsCommandLoading(false);
    showToast(isPaused ? 'Sürüş devam ediyor · Kapılar açıldı' : 'Bekleme modu · Kapılar kilitlendi', 'success');
  };

  const handleEndDrive = () => {
    setDriveState(prev => ({ ...prev, isActive: false, elapsedSeconds: elapsed, totalCostTL: cost }));
    navigateTo(APP_STATES.END_DRIVE);
  };

  return (
    <div className="screen" style={{
      background: isPaused
        ? 'linear-gradient(180deg, #1a1530 0%, #0a0f1e 100%)'
        : 'var(--togg-navy)',
      transition: 'background 600ms ease',
    }}>
      <StatusBar />

      {/* Mode badge */}
      <div style={{ textAlign: 'center', padding: '4px 0 12px' }}>
        <span style={{
          background: isPaused ? 'rgba(255,165,2,0.12)' : 'rgba(46,213,115,0.1)',
          color: isPaused ? '#ffa502' : '#2ed573',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 700,
          border: `1px solid ${isPaused ? 'rgba(255,165,2,0.2)' : 'rgba(46,213,115,0.15)'}`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: isPaused ? '#ffa502' : '#2ed573',
            boxShadow: `0 0 8px ${isPaused ? '#ffa502' : '#2ed573'}`,
          }} />
          {isPaused ? 'Bekleme Modu' : 'Sürüş Aktif'}
        </span>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 20px',
      }}>
        {/* Vehicle image */}
        <div style={{
          width: '140px',
          height: '90px',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '8px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.04)',
        }}>
          <img src={vehicleImg} alt={selectedVehicle?.model} style={{
            width: '100%', height: '100%', objectFit: 'cover',
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
          }} />
        </div>

        <p style={{ color: 'var(--togg-gray-400)', fontSize: '12px', marginBottom: '24px' }}>
          {selectedVehicle?.model || 'TOGG T10X'} · {selectedVehicle?.plate || '34 TG 1001'}
        </p>

        {/* Timer */}
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <p style={{
            color: 'var(--togg-gray-400)', fontSize: '10px', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px',
          }}>
            Geçen Süre
          </p>
          <div style={{
            fontSize: '46px', fontWeight: 900, fontVariantNumeric: 'tabular-nums', letterSpacing: '2px',
            background: isPaused ? 'linear-gradient(135deg, #ffa502, #ff6348)' : 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1,
          }}>
            {formatTime(elapsed)}
          </div>
        </div>

        {/* Cost circle */}
        <div style={{
          width: '180px', height: '180px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
          border: '2px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          marginBottom: '20px', position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: '-4px', borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: isPaused ? '#ffa502' : 'var(--togg-teal)',
            borderRightColor: isPaused ? 'rgba(255,165,2,0.2)' : 'rgba(0,212,170,0.2)',
            animation: `spin ${isPaused ? '4s' : '2.5s'} linear infinite`,
          }} />
          <p style={{ fontSize: '10px', color: 'var(--togg-gray-400)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '2px' }}>
            Toplam Tutar
          </p>
          <div style={{ fontSize: '40px', fontWeight: 900, fontVariantNumeric: 'tabular-nums', color: '#fff' }}>
            {cost.toFixed(1)}
          </div>
          <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--togg-teal)' }}>₺</span>
        </div>

        {/* Smart Remote Panel */}
        <div className="glass-card" style={{
          width: '100%', marginBottom: '24px', padding: '16px',
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px',
          opacity: isCommandLoading ? 0.6 : 1, pointerEvents: isCommandLoading ? 'none' : 'auto',
          transition: 'all 300ms ease'
        }}>
          {/* AC Button */}
          <button onClick={async () => {
            setIsCommandLoading(true);
            showToast('Klima komutu araca iletiliyor...', 'info');
            await sendTelemetryCommand(selectedVehicle?.id || 1, acOn ? 'STOP_AC' : 'START_AC');
            setAcOn(!acOn);
            setIsCommandLoading(false);
            showToast(acOn ? 'Klima kapatıldı' : 'Klima 22°C ayarında açıldı', 'success');
          }} style={{
            background: acOn ? 'rgba(0, 212, 170, 0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${acOn ? 'var(--togg-teal)' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: '12px', padding: '12px 8px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '8px', color: acOn ? 'var(--togg-teal)' : '#fff',
            transition: 'all 300ms ease'
          }}>
            <span style={{ fontSize: '20px' }}>{acOn ? '🌬️' : '🌡️'}</span>
            <span style={{ fontSize: '11px', fontWeight: 600 }}>Klima</span>
          </button>

          {/* Lights Button */}
          <button onClick={async () => {
            setIsCommandLoading(true);
            showToast('Far komutu araca iletiliyor...', 'info');
            await sendTelemetryCommand(selectedVehicle?.id || 1, lightsOn ? 'LIGHTS_OFF' : 'LIGHTS_ON');
            setLightsOn(!lightsOn);
            setIsCommandLoading(false);
            showToast(lightsOn ? 'Farlar söndürüldü' : 'Farlar yakıldı', 'success');
          }} style={{
            background: lightsOn ? 'rgba(255, 165, 2, 0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${lightsOn ? '#ffa502' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: '12px', padding: '12px 8px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '8px', color: lightsOn ? '#ffa502' : '#fff',
            transition: 'all 300ms ease'
          }}>
            <span style={{ fontSize: '20px' }}>💡</span>
            <span style={{ fontSize: '11px', fontWeight: 600 }}>Farlar</span>
          </button>

          {/* Trunk Button */}
          <button onClick={async () => {
            setIsCommandLoading(true);
            showToast('Bagaj komutu araca iletiliyor...', 'info');
            await sendTelemetryCommand(selectedVehicle?.id || 1, trunkOpen ? 'CLOSE_TRUNK' : 'OPEN_TRUNK');
            setTrunkOpen(!trunkOpen);
            setIsCommandLoading(false);
            showToast(trunkOpen ? 'Bagaj kapandı' : 'Bagaj açıldı', 'success');
          }} style={{
            background: trunkOpen ? 'rgba(79, 172, 254, 0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${trunkOpen ? '#4facfe' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: '12px', padding: '12px 8px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '8px', color: trunkOpen ? '#4facfe' : '#fff',
            transition: 'all 300ms ease'
          }}>
            <span style={{ fontSize: '20px' }}>🚘</span>
            <span style={{ fontSize: '11px', fontWeight: 600 }}>Bagaj</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div style={{ padding: '0 20px 36px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={handlePause} disabled={isCommandLoading} style={{
          width: '100%', padding: '16px', borderRadius: '16px', fontWeight: 700, fontSize: '15px',
          cursor: isCommandLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          background: isPaused ? 'linear-gradient(135deg, #00d4aa, #4facfe)' : 'rgba(255,255,255,0.06)',
          border: isPaused ? 'none' : '1px solid rgba(255,255,255,0.08)',
          color: isPaused ? '#0a0f1e' : '#fff',
          boxShadow: isPaused ? '0 4px 20px rgba(0,212,170,0.3)' : 'none',
          opacity: isCommandLoading ? 0.7 : 1,
          transition: 'all 300ms ease',
        }}>
          {isCommandLoading ? (
            <><div className="animate-spin" style={{ width: '16px', height: '16px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%' }} /> İletişim Kuruluyor...</>
          ) : (
            isPaused ? '▶ Kapıları Aç & Devam Et' : '🔒 Kapıları Kilitle & Bekle'
          )}
        </button>
        <SwipeButton onSwipe={handleEndDrive} label="Sürüşü Bitir" icon="■" />
      </div>
    </div>
  );
}
