import { useState } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';

const GARAGE_MODELS = [
  {
    id: 't10x',
    name: 'TOGG T10X',
    tagline: 'Akıllı Cihaz, Akıllı Deneyim',
    image: '/privado/images/togg-t10x.png',
    stats: {
      range: '523 km',
      acceleration: '4.8s (0-100)',
      power: '320 kW',
      space: '441 L'
    },
    color: '#00d4aa'
  },
  {
    id: 't10f',
    name: 'TOGG T10F',
    tagline: 'Sportif Duruş, Dinamik Ruh',
    image: '/privado/images/togg-t10f.png',
    stats: {
      range: '600 km',
      acceleration: '4.6s (0-100)',
      power: '320 kW',
      space: '500 L'
    },
    color: '#4facfe'
  }
];

export default function Garage() {
  const { navigateTo, setPreferredModel } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const currentModel = GARAGE_MODELS[currentIndex];

  const handleSelect = () => {
    setPreferredModel(currentModel.name);
    navigateTo(APP_STATES.MAP);
  };

  return (
    <div className="screen animate-fadeIn" style={{
      background: 'radial-gradient(circle at 50% 30%, rgba(20, 30, 60, 1) 0%, rgba(10, 15, 30, 1) 100%)',
      display: 'flex', flexDirection: 'column', color: '#fff', overflow: 'hidden'
    }}>
      
      {/* Background ambient glow based on selected car */}
      <div style={{
        position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: '300px', height: '300px', background: currentModel.color,
        filter: 'blur(120px)', opacity: 0.15, zIndex: 0, transition: 'all 500ms ease'
      }} />

      {/* Header */}
      <div style={{ padding: '40px 24px 20px', textAlign: 'center', zIndex: 1 }}>
        <h1 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--togg-gray-400)', marginBottom: '8px' }}>
          Dijital Garaj
        </h1>
        <h2 style={{ fontSize: '28px', fontWeight: 800, margin: 0 }}>
          {currentModel.name}
        </h2>
        <p style={{ fontSize: '14px', color: currentModel.color, marginTop: '4px', fontWeight: 600, transition: 'color 300ms ease' }}>
          {currentModel.tagline}
        </p>
      </div>

      {/* Center 3D Showcase Area */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
        
        {/* Navigation Arrows */}
        <button onClick={() => setCurrentIndex(prev => (prev === 0 ? 1 : 0))} style={{
          position: 'absolute', left: '16px', zIndex: 10, background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)', width: '44px', height: '44px', borderRadius: '50%',
          color: '#fff', fontSize: '20px', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          ‹
        </button>

        {/* Car Image with float animation */}
        <div key={currentModel.id} className="animate-fadeIn" style={{ position: 'relative', width: '90%', maxWidth: '380px' }}>
          <div style={{
            position: 'absolute', bottom: '10%', left: '10%', right: '10%', height: '20px',
            background: 'rgba(0,0,0,0.6)', filter: 'blur(10px)', borderRadius: '50%', zIndex: 1
          }} />
          <img src={currentModel.image} alt={currentModel.name} className="animate-float" style={{ width: '100%', height: 'auto', position: 'relative', zIndex: 2, transform: 'scale(1.15) translateY(-10px)' }} />
        </div>

        <button onClick={() => setCurrentIndex(prev => (prev === 0 ? 1 : 0))} style={{
          position: 'absolute', right: '16px', zIndex: 10, background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)', width: '44px', height: '44px', borderRadius: '50%',
          color: '#fff', fontSize: '20px', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          ›
        </button>

      </div>

      {/* Stats Bottom Panel */}
      <div className="glass-card" style={{ margin: '0 20px 30px', padding: '24px', zIndex: 1, position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--togg-gray-400)', textTransform: 'uppercase', marginBottom: '4px' }}>Menzil</div>
            <div style={{ fontSize: '16px', fontWeight: 700 }}>{currentModel.stats.range}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--togg-gray-400)', textTransform: 'uppercase', marginBottom: '4px' }}>Hızlanma</div>
            <div style={{ fontSize: '16px', fontWeight: 700 }}>{currentModel.stats.acceleration}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--togg-gray-400)', textTransform: 'uppercase', marginBottom: '4px' }}>Güç</div>
            <div style={{ fontSize: '16px', fontWeight: 700 }}>{currentModel.stats.power}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--togg-gray-400)', textTransform: 'uppercase', marginBottom: '4px' }}>Bagaj Hacmi</div>
            <div style={{ fontSize: '16px', fontWeight: 700 }}>{currentModel.stats.space}</div>
          </div>
        </div>

        <button onClick={handleSelect} className="btn btn-full" style={{
          background: `linear-gradient(135deg, ${currentModel.color} 0%, rgba(255,255,255,0.2) 200%)`,
          color: '#0a0f1e', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '15px'
        }}>
          Haritada Bul 📍
        </button>
      </div>

      {/* Dots Indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', paddingBottom: '20px', zIndex: 1 }}>
        {GARAGE_MODELS.map((m, idx) => (
          <div key={m.id} style={{
            width: currentIndex === idx ? '24px' : '8px',
            height: '8px',
            borderRadius: '4px',
            background: currentIndex === idx ? currentModel.color : 'rgba(255,255,255,0.2)',
            transition: 'all 300ms ease'
          }} />
        ))}
      </div>
    </div>
  );
}
