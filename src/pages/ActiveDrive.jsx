import { useState, useEffect, useRef } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import StatusBar from '../components/StatusBar';
import SwipeButton from '../components/SwipeButton';

export default function ActiveDrive() {
  const { selectedVehicle, setDriveState, showToast, navigateTo } = useApp();
  const [elapsed, setElapsed] = useState(0);
  const [cost, setCost] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [drivingSecs, setDrivingSecs] = useState(0);
  const [waitingSecs, setWaitingSecs] = useState(0);
  const isPausedRef = useRef(false);
  const intervalRef = useRef(null);

  const drivingRate = selectedVehicle?.pricing?.driving || 10;
  const waitingRate = selectedVehicle?.pricing?.waiting || 2;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsed(prev => prev + 1);
      if (isPausedRef.current) {
        setWaitingSecs(prev => prev + 1);
      } else {
        setDrivingSecs(prev => prev + 1);
      }
      setCost(prev => {
        const rate = isPausedRef.current ? waitingRate : drivingRate;
        return prev + rate / 60;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [drivingRate, waitingRate]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePause = () => {
    const next = !isPaused;
    setIsPaused(next);
    isPausedRef.current = next;
    showToast(
      next ? '⏸️ Bekleme modu aktif — Kapılar kilitlendi 🔒' : '▶️ Sürüş devam ediyor — Kapılar açıldı 🔓',
      next ? 'info' : 'success'
    );
  };

  const handleEndDrive = () => {
    setDriveState(prev => ({
      ...prev,
      isActive: false,
      elapsedSeconds: elapsed,
      totalCostTL: cost,
      drivingSeconds: drivingSecs,
      waitingSeconds: waitingSecs,
    }));
    navigateTo(APP_STATES.END_DRIVE);
  };

  const accentColor = isPaused ? 'var(--togg-orange)' : 'var(--togg-teal)';

  return (
    <div className="screen" style={{
      background: isPaused
        ? 'linear-gradient(180deg, #0d0d22 0%, #0a0f1e 100%)'
        : 'var(--gradient-dark)',
      transition: 'background 600ms ease',
    }}>
      <StatusBar />

      {/* Mode pill */}
      <div style={{ textAlign: 'center', paddingTop: '4px', paddingBottom: '2px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '7px 20px',
          borderRadius: 'var(--radius-full)',
          background: isPaused ? 'rgba(255,165,2,0.12)' : 'rgba(0,212,170,0.12)',
          border: `1px solid ${isPaused ? 'rgba(255,165,2,0.35)' : 'rgba(0,212,170,0.35)'}`,
          transition: 'all 400ms ease',
        }}>
          <div style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: accentColor, animation: 'pulse 1.8s ease-in-out infinite',
          }} />
          <span style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: accentColor, letterSpacing: '0.5px' }}>
            {isPaused ? '⏸️ Bekleme Modu' : '🚗 Sürüş Aktif'}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 var(--space-lg)', gap: 'var(--space-lg)',
      }}>

        {/* Timer */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: '10px', fontWeight: 700, color: 'var(--togg-gray-400)',
            letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px',
          }}>
            GEÇEN SÜRE
          </p>
          <div style={{
            fontSize: 'clamp(48px, 14vw, 72px)', fontWeight: 900,
            fontVariantNumeric: 'tabular-nums', lineHeight: 1, letterSpacing: '-2px',
            background: isPaused ? 'linear-gradient(135deg, #ffa502, #ff6348)' : 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {formatTime(elapsed)}
          </div>
        </div>

        {/* Cost card */}
        <div style={{
          width: '100%', maxWidth: '320px', borderRadius: 'var(--radius-xl)',
          background: 'var(--glass-bg)', border: `1px solid ${isPaused ? 'rgba(255,165,2,0.2)' : 'rgba(0,212,170,0.2)'}`,
          backdropFilter: 'blur(20px)', padding: '24px 32px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: '2px',
            borderRadius: 'var(--radius-full)',
            background: isPaused
              ? 'linear-gradient(90deg, transparent, #ffa502, transparent)'
              : 'linear-gradient(90deg, transparent, #00d4aa, transparent)',
          }} />
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--togg-gray-400)' }}>
            TOPLAM TUTAR
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', lineHeight: 1 }}>
            <span style={{ fontSize: 'var(--font-xl)', fontWeight: 700, color: accentColor, marginTop: '8px' }}>₺</span>
            <span style={{ fontSize: 'clamp(44px, 12vw, 60px)', fontWeight: 900, fontVariantNumeric: 'tabular-nums', color: 'var(--togg-white)' }}>
              {Math.floor(cost)}
            </span>
            <span style={{ fontSize: 'var(--font-xl)', fontWeight: 700, color: 'var(--togg-gray-300)', marginTop: '8px' }}>
              .{String(Math.round((cost % 1) * 100)).padStart(2, '0')}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: accentColor, animation: 'pulse 1.8s ease-in-out infinite' }} />
            <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--togg-gray-400)' }}>
              {isPaused ? `${waitingRate} ₺/dk — bekleme` : `${drivingRate} ₺/dk — sürüş`}
            </span>
          </div>
        </div>

        {/* Stats row — USES STATE not ref so it re-renders */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)',
          width: '100%', maxWidth: '320px',
        }}>
          <div className="glass-card" style={{ padding: '14px 16px' }}>
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--togg-gray-400)', marginBottom: '4px' }}>🚗 Sürüş</p>
            <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: 'var(--togg-green)' }}>
              {formatTime(drivingSecs)}
            </p>
          </div>
          <div className="glass-card" style={{ padding: '14px 16px' }}>
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--togg-gray-400)', marginBottom: '4px' }}>⏸️ Bekleme</p>
            <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: 'var(--togg-orange)' }}>
              {formatTime(waitingSecs)}
            </p>
          </div>
        </div>

        {/* Vehicle tag */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '8px 16px', borderRadius: 'var(--radius-full)',
          background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
        }}>
          <span style={{ fontSize: '16px' }}>🚘</span>
          <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--togg-gray-300)' }}>
            {selectedVehicle?.model || 'TOGG T10X'}
          </span>
          <span style={{ color: 'var(--togg-gray-500)', fontSize: '12px' }}>•</span>
          <span style={{ fontSize: 'var(--font-sm)', color: 'var(--togg-gray-400)' }}>
            {selectedVehicle?.plate || '34 TG 1001'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ padding: '0 var(--space-lg) var(--space-2xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <button
          className={`btn btn-full ${isPaused ? 'btn-primary' : 'btn-secondary'}`}
          onClick={handlePause}
          style={{ padding: '16px', fontSize: 'var(--font-base)', fontWeight: 700 }}
        >
          {isPaused ? '▶️ Sürüşe Devam Et' : '⏸️ Duraklat — Bekleme Modu'}
        </button>
        <SwipeButton onSwipe={handleEndDrive} label="Sürüşü Bitir" icon="■" />
      </div>
    </div>
  );
}
