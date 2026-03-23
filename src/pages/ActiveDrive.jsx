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

  const fmt = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const mm = String(m).padStart(2, '0');
    const ss = String(sec).padStart(2, '0');
    return h > 0 ? `${String(h).padStart(2,'0')}:${mm}:${ss}` : `${mm}:${ss}`;
  };

  const handlePause = () => {
    const next = !isPaused;
    setIsPaused(next);
    isPausedRef.current = next;
    showToast(
      next ? 'Bekleme modu aktif — Kapılar kilitlendi 🔒' : 'Sürüş devam ediyor — Kapılar açıldı 🔓',
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

  const teal = '#00d4aa';
  const orange = '#ffa502';
  const accent = isPaused ? orange : teal;

  // Split timer digits for individual rendering
  const timeStr = fmt(elapsed);

  return (
    <div className="screen" style={{
      background: isPaused
        ? 'linear-gradient(180deg, #0d0d22 0%, #0a0f1e 100%)'
        : 'var(--gradient-dark)',
      transition: 'background 600ms ease',
    }}>
      <StatusBar />

      {/* Mode pill */}
      <div style={{ textAlign: 'center', padding: '6px 0 0' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '7px 20px', borderRadius: 'var(--radius-full)',
          background: isPaused ? 'rgba(255,165,2,0.1)' : 'rgba(0,212,170,0.1)',
          border: `1px solid ${isPaused ? 'rgba(255,165,2,0.3)' : 'rgba(0,212,170,0.3)'}`,
        }}>
          <div style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: accent, boxShadow: `0 0 8px ${accent}`,
            animation: 'pulse 1.8s ease-in-out infinite',
          }} />
          <span style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: accent, letterSpacing: '0.5px' }}>
            {isPaused ? 'Bekleme Modu' : 'Sürüş Aktif'}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 24px', gap: '20px',
      }}>

        {/* Timer — plain color, no gradient-clip trick */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: '10px', fontWeight: 700, color: 'var(--togg-gray-400)',
            letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px',
          }}>
            GEÇEN SÜRE
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px',
          }}>
            {timeStr.split('').map((ch, i) => (
              <span key={i} style={{
                display: 'inline-block',
                width: ch === ':' ? '20px' : '38px',
                fontSize: ch === ':' ? '48px' : 'clamp(52px, 14vw, 68px)',
                fontWeight: 900,
                fontVariantNumeric: 'tabular-nums',
                textAlign: 'center',
                lineHeight: 1,
                color: accent,
                transition: 'color 400ms ease',
                ...(ch !== ':' ? {
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '12px',
                  padding: '8px 0',
                } : {
                  opacity: 0.4,
                }),
              }}>
                {ch}
              </span>
            ))}
          </div>
        </div>

        {/* Cost card */}
        <div style={{
          width: '100%', maxWidth: '310px', borderRadius: '20px',
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${isPaused ? 'rgba(255,165,2,0.15)' : 'rgba(0,212,170,0.15)'}`,
          backdropFilter: 'blur(20px)', padding: '22px 0',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
          position: 'relative', overflow: 'hidden',
          transition: 'border-color 400ms ease',
        }}>
          {/* Top accent line */}
          <div style={{
            position: 'absolute', top: 0, left: '15%', right: '15%', height: '2px',
            borderRadius: '99px',
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            transition: 'background 400ms ease',
          }} />

          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--togg-gray-400)' }}>
            TOPLAM TUTAR
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '3px', lineHeight: 1 }}>
            <span style={{ fontSize: '20px', fontWeight: 700, color: accent, marginTop: '10px' }}>₺</span>
            <span style={{ fontSize: '56px', fontWeight: 900, fontVariantNumeric: 'tabular-nums', color: '#fff' }}>
              {Math.floor(cost)}
            </span>
            <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--togg-gray-300)', marginTop: '10px' }}>
              .{String(Math.round((cost % 1) * 100)).padStart(2, '0')}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: accent, boxShadow: `0 0 6px ${accent}`,
            }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--togg-gray-400)' }}>
              {isPaused ? `${waitingRate} ₺/dk — bekleme` : `${drivingRate} ₺/dk — sürüş`}
            </span>
          </div>
        </div>

        {/* Driving / Waiting stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px',
          width: '100%', maxWidth: '310px',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(46,213,115,0.15)',
            borderRadius: '16px', padding: '14px 16px',
          }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--togg-gray-400)', marginBottom: '6px' }}>
              🚗 Sürüş
            </p>
            <p style={{ fontSize: '22px', fontWeight: 800, color: '#2ed573', fontVariantNumeric: 'tabular-nums' }}>
              {fmt(drivingSecs)}
            </p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid rgba(255,165,2,0.15)`,
            borderRadius: '16px', padding: '14px 16px',
          }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--togg-gray-400)', marginBottom: '6px' }}>
              ⏸️ Bekleme
            </p>
            <p style={{ fontSize: '22px', fontWeight: 800, color: '#ffa502', fontVariantNumeric: 'tabular-nums' }}>
              {fmt(waitingSecs)}
            </p>
          </div>
        </div>

        {/* Vehicle tag */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          padding: '8px 18px', borderRadius: 'var(--radius-full)',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <span style={{ fontSize: '15px' }}>🚘</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--togg-gray-300)' }}>
            {selectedVehicle?.model || 'TOGG T10X'}
          </span>
          <span style={{ color: 'var(--togg-gray-500)', fontSize: '10px' }}>•</span>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--togg-gray-400)' }}>
            {selectedVehicle?.plate || '34 TG 1001'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ padding: '0 24px 36px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
