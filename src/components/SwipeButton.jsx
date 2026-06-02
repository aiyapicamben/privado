import { useState, useRef } from 'react';

export default function SwipeButton({ onSwipe, label = 'Kaydır', icon = '→', variant = 'teal' }) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [maxDrag, setMaxDrag] = useState(240);
  const containerRef = useRef(null);
  const startXRef = useRef(0);

  const updateMaxDrag = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      // Subtract thumb width (56) and left/right padding (4px * 2 = 8px)
      const calculatedMax = Math.max(100, containerWidth - 64);
      setMaxDrag(calculatedMax);
    }
  };

  const handleStart = (clientX) => {
    updateMaxDrag();
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
    const threshold = maxDrag * 0.85;
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

  // Determine colors based on variant
  const colors = {
    teal: {
      bg: 'linear-gradient(135deg, rgba(0, 212, 170, 0.1) 0%, rgba(0, 212, 170, 0.04) 100%)',
      border: 'rgba(0, 212, 170, 0.3)',
      fill: 'linear-gradient(135deg, #00d4aa 0%, #4facfe 100%)',
      thumb: '#00d4aa',
      thumbGlow: '0 4px 16px rgba(0, 212, 170, 0.4)'
    },
    red: {
      bg: 'linear-gradient(135deg, rgba(255, 71, 87, 0.1) 0%, rgba(255, 71, 87, 0.04) 100%)',
      border: 'rgba(255, 71, 87, 0.3)',
      fill: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)',
      thumb: '#ff4757',
      thumbGlow: '0 4px 16px rgba(255, 71, 87, 0.4)'
    }
  }[variant] || {
    bg: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.1)',
    fill: 'var(--gradient-primary)',
    thumb: 'var(--togg-teal)',
    thumbGlow: 'none'
  };

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
          : colors.bg,
        border: `2px solid ${isCompleted ? '#2ed573' : colors.border}`,
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
          : colors.fill,
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
        color: 'rgba(255,255,255,0.7)',
        fontSize: '14px',
        fontWeight: 700,
        letterSpacing: '1px',
        opacity: 1 - progress * 2,
        transition: isDragging ? 'none' : 'opacity 300ms ease',
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        {isCompleted ? '✓ Tamamlandı' : label}
      </div>

      {/* Thumb */}
      <div style={{
        position: 'absolute',
        left: `${4 + dragX}px`,
        top: '4px',
        width: '56px',
        height: '56px',
        borderRadius: '28px',
        background: isCompleted ? '#fff' : colors.thumb,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        fontWeight: 700,
        color: isCompleted ? '#2ed573' : '#fff',
        boxShadow: isCompleted ? '0 4px 16px rgba(46,213,115,0.4)' : colors.thumbGlow,
        transition: isDragging ? 'none' : 'left 300ms ease',
        userSelect: 'none',
      }}>
        {isCompleted ? '✓' : icon}
      </div>
    </div>
  );
}

