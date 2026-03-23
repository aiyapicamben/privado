import { useState } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import StatusBar from '../components/StatusBar';

const slides = [
  {
    icon: '🚗',
    emoji: '⚡',
    title: 'TOGG ile Özgürce Sür',
    desc: 'Türkiye\'nin elektrikli otomobili TOGG ile şehir içi ulaşımın en akıllı yolunu keşfedin.',
  },
  {
    icon: '📍',
    emoji: '🗺️',
    title: 'Yakınındaki Aracı Bul',
    desc: 'Haritada en yakın TOGG\'u bulun, kilidini açın ve hemen sürmeye başlayın.',
  },
  {
    icon: '💰',
    emoji: '⏱️',
    title: 'Dakika Başı Öde',
    desc: 'Sadece kullandığınız kadar ödeyin. Yakıt, sigorta ve bakım dahil.',
  },
];

export default function Welcome() {
  const { navigateTo } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="screen" style={{
      background: 'var(--gradient-dark)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <StatusBar />
      
      {/* Background decorations */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-30%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-20%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,172,254,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 var(--space-lg)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div className="animate-fadeInDown" style={{
          marginBottom: 'var(--space-xl)',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '8px',
            filter: 'drop-shadow(0 0 20px rgba(0,212,170,0.3))',
          }}>
            🚘
          </div>
          <h1 style={{
            fontSize: 'var(--font-3xl)',
            fontWeight: 900,
            letterSpacing: '-1px',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '4px',
          }}>
            TOGG Drive
          </h1>
          <p style={{
            fontSize: 'var(--font-xs)',
            color: 'var(--togg-gray-400)',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}>
            Akıllı Araç Paylaşımı
          </p>
        </div>

        {/* Slide Content */}
        <div className="animate-fadeInUp" style={{
          textAlign: 'center',
          marginBottom: 'var(--space-2xl)',
          minHeight: '180px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div key={currentSlide} className="animate-fadeInUp" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-md)',
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '28px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              backdropFilter: 'blur(10px)',
            }}>
              {slides[currentSlide].emoji}
            </div>
            <h2 style={{
              fontSize: 'var(--font-xl)',
              fontWeight: 700,
              color: 'var(--togg-white)',
            }}>
              {slides[currentSlide].title}
            </h2>
            <p style={{
              fontSize: 'var(--font-base)',
              color: 'var(--togg-gray-300)',
              maxWidth: '300px',
              lineHeight: 1.6,
            }}>
              {slides[currentSlide].desc}
            </p>
          </div>
        </div>

        {/* Dots */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: 'var(--space-2xl)',
        }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                width: i === currentSlide ? '28px' : '8px',
                height: '8px',
                borderRadius: 'var(--radius-full)',
                background: i === currentSlide ? 'var(--togg-teal)' : 'var(--togg-gray-400)',
                transition: 'all var(--transition-base)',
                opacity: i === currentSlide ? 1 : 0.4,
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{
        padding: '0 var(--space-lg) var(--space-2xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)',
        position: 'relative',
        zIndex: 1,
      }}>
        <button
          className="btn btn-primary btn-lg btn-full"
          onClick={() => navigateTo(APP_STATES.REGISTER)}
          style={{ fontWeight: 800, letterSpacing: '0.5px' }}
        >
          Başlayın
        </button>
        <button
          className="btn btn-secondary btn-full"
          onClick={() => navigateTo(APP_STATES.REGISTER)}
          style={{ fontSize: 'var(--font-sm)' }}
        >
          Zaten hesabım var
        </button>
      </div>
    </div>
  );
}
