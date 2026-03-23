import { useState, useEffect, useRef } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import StatusBar from '../components/StatusBar';
import SwipeButton from '../components/SwipeButton';

export default function ActiveDrive() {
  const { navigateTo, selectedVehicle, driveState, setDriveState, togglePause, showToast, endDrive } = useApp();
  const [elapsed, setElapsed] = useState(0);
  const [cost, setCost] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const drivingRate = selectedVehicle?.pricing?.driving || 10;
  const waitingRate = selectedVehicle?.pricing?.waiting || 2;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const newElapsed = prev + 1;
        return newElapsed;
      });
      setCost((prev) => {
        const rate = isPaused ? waitingRate : drivingRate;
        return prev + rate / 60;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isPaused, drivingRate, waitingRate]);

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
    setIsPaused(!isPaused);
    if (!isPaused) {
      showToast('Bekleme modu aktif - Kapılar kilitlendi 🔒', 'info');
    } else {
      showToast('Sürüş devam ediyor - Kapılar açıldı 🔓', 'success');
    }
  };

  const handleEndDrive = () => {
    setDriveState(prev => ({
      ...prev,
      isActive: false,
      elapsedSeconds: elapsed,
      totalCostTL: cost,
    }));
    navigateTo(APP_STATES.END_DRIVE);
  };

  return (
    <div className="screen" style={{
      background: isPaused
        ? 'linear-gradient(180deg, #1a1a2e 0%, #0a0f1e 100%)'
        : 'var(--gradient-dark)',
      transition: 'background 500ms ease',
    }}>
      <StatusBar />

      {/* Mode indicator */}
      <div style={{
        textAlign: 'center',
        padding: 'var(--space-sm) 0',
      }}>
        <span className={`badge ${isPaused ? 'badge-warning' : 'badge-success'}`} style={{
          fontSize: 'var(--font-sm)',
          padding: '6px 16px',
        }}>
          {isPaused ? '⏸️ Bekleme Modu' : '🚗 Sürüş Aktif'}
        </span>
      </div>

      {/* Main timer display */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 var(--space-lg)',
      }}>
        {/* Elapsed time */}
        <div className="animate-fadeIn" style={{
          marginBottom: 'var(--space-xl)',
          textAlign: 'center',
        }}>
          <p style={{
            color: 'var(--togg-gray-400)',
            fontSize: 'var(--font-sm)',
            fontWeight: 500,
            marginBottom: '4px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}>
            Geçen Süre
          </p>
          <div style={{
            fontSize: 'var(--font-4xl)',
            fontWeight: 900,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '2px',
            background: isPaused ? 'linear-gradient(135deg, #ffa502, #ff6348)' : 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
          }}>
            {formatTime(elapsed)}
          </div>
        </div>

        {/* Cost display */}
        <div style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'var(--glass-bg)',
          border: '2px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-xl)',
          position: 'relative',
        }}>
          {/* Rotating border */}
          <div style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: isPaused ? 'var(--togg-orange)' : 'var(--togg-teal)',
            animation: isPaused ? 'spin 3s linear infinite' : 'spin 2s linear infinite',
          }} />

          <p style={{
            fontSize: 'var(--font-xs)',
            color: 'var(--togg-gray-400)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '4px',
          }}>
            Toplam Tutar
          </p>
          <div style={{
            fontSize: '44px',
            fontWeight: 900,
            fontVariantNumeric: 'tabular-nums',
            color: 'var(--togg-white)',
          }}>
            {cost.toFixed(1)}
          </div>
          <span style={{
            fontSize: 'var(--font-lg)',
            fontWeight: 700,
            color: 'var(--togg-teal)',
          }}>
            ₺
          </span>
        </div>

        {/* Rate info */}
        <div className="glass-card" style={{
          padding: 'var(--space-md) var(--space-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-lg)',
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isPaused ? 'var(--togg-orange)' : 'var(--togg-green)',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          <span style={{
            fontSize: 'var(--font-sm)',
            color: 'var(--togg-gray-300)',
          }}>
            {isPaused
              ? `Bekleme: ${waitingRate} ₺/dk`
              : `Sürüş: ${drivingRate} ₺/dk`}
          </span>
        </div>

        {/* Vehicle info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          color: 'var(--togg-gray-400)',
          fontSize: 'var(--font-sm)',
        }}>
          <span>🚘</span>
          <span>{selectedVehicle?.model || 'TOGG T10X'}</span>
          <span>•</span>
          <span>{selectedVehicle?.plate || '34 TG 1001'}</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        padding: '0 var(--space-lg) var(--space-2xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)',
      }}>
        {/* Pause/Resume button */}
        <button
          className={`btn btn-full ${isPaused ? 'btn-primary' : 'btn-secondary'}`}
          onClick={handlePause}
          style={{
            padding: '16px',
            fontSize: 'var(--font-base)',
            fontWeight: 700,
          }}
        >
          {isPaused ? '▶️ Sürüşe Devam Et' : '⏸️ Duraklat / Bekleme Modu'}
        </button>

        {/* End drive swipe button */}
        <SwipeButton
          onSwipe={handleEndDrive}
          label="Sürüşü Bitir"
          icon="■"
        />
      </div>
    </div>
  );
}
