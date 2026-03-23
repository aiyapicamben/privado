import { useState, useRef } from 'react';

export default function SwipeButton({ onSwipe, label = 'Kaydır', icon = '→' }) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const containerRef = useRef(null);
  const startXRef = useRef(0);

  const maxDrag = 240;
  const threshold = 200;

  const handleStart = (clientX) => {
    setIsDragging(true);
    startXRef.current = clientX;
  };

  const handleMove = (clientX) => {
    if (!isDragging) return;
    const diff = clientX - startXRef.current;
    const clamped = Math.max(0, Math.min(diff, maxDrag));
    setDragX(clamped);
  };

  const handleEnd = () => {
    setIsDragging(false);
    if (dragX >= threshold) {
      setIsCompleted(true);
      setDragX(maxDrag);
      setTimeout(() => {
        if (onSwipe) onSwipe();
      }, 300);
    } else {
      setDragX(0);
    }
  };

  const progress = dragX / maxDrag;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '64px',
        borderRadius: '32px',
        background: isCompleted
          ? 'linear-gradient(135deg, #2ed573 0%, #00d4aa 100%)'
          : 'linear-gradient(135deg, rgba(255,71,87,0.2) 0%, rgba(255,71,87,0.1) 100%)',
        border: `2px solid ${isCompleted ? '#2ed573' : 'rgba(255,71,87,0.4)'}`,
        overflow: 'hidden',
        touchAction: 'none',
        cursor: isCompleted ? 'default' : 'grab',
      }}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={() => isDragging && handleEnd()}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
      {/* Track fill */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        height: '100%',
        width: `${60 + dragX}px`,
        background: isCompleted
          ? 'linear-gradient(135deg, #2ed573 0%, #00d4aa 100%)'
          : 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)',
        borderRadius: '32px',
        transition: isDragging ? 'none' : 'width 300ms ease',
      }} />

      {/* Label */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255,255,255,0.6)',
        fontSize: '14px',
        fontWeight: 600,
        letterSpacing: '1px',
        opacity: 1 - progress * 2,
        transition: isDragging ? 'none' : 'opacity 300ms ease',
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        {isCompleted ? '✓ Tamamlandı' : `${label} >>>>`}
      </div>

      {/* Thumb */}
      <div style={{
        position: 'absolute',
        left: `${4 + dragX}px`,
        top: '4px',
        width: '56px',
        height: '56px',
        borderRadius: '28px',
        background: isCompleted ? '#fff' : '#ff4757',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        fontWeight: 700,
        color: isCompleted ? '#2ed573' : '#fff',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        transition: isDragging ? 'none' : 'left 300ms ease',
        userSelect: 'none',
      }}>
        {isCompleted ? '✓' : icon}
      </div>
    </div>
  );
}
