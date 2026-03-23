import { useState, useEffect } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import StatusBar from '../components/StatusBar';

const slides = [
  {
    emoji: '⚡',
    title: 'TOGG ile Özgürce Sür',
    desc: "Türkiye'nin elektrikli otomobili TOGG ile şehir içi ulaşımın en akıllı yolunu keşfedin.",
    accent: '#00d4aa',
  },
  {
    emoji: '🗺️',
    title: 'Yakınındaki Aracı Bul',
    desc: "Haritada en yakın TOGG'u bulun, kilidini açın ve hemen sürmeye başlayın.",
    accent: '#4facfe',
  },
  {
    emoji: '💳',
    title: 'Dakika Başı Öde',
    desc: 'Sadece kullandığınız kadar ödeyin. Yakıt, sigorta ve bakım dahil.',
    accent: '#7c5cfc',
  },
];

export default function Welcome() {
  const { navigateTo, setUser } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="screen" style={{
      background: 'var(--gradient-dark)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <StatusBar />

      {/* Animated ambient glow that changes per slide */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '-25%',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${slide.accent}14 0%, transparent 70%)`,
        transition: 'background 800ms ease',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-8%',
        left: '-20%',
        width: '360px',
        height: '360px',
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

        {/* Logo block */}
        <div className="animate-fadeInDown" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,212,170,0.15)',
          }}>
            <span style={{ fontSize: '38px' }}>🚘</span>
          </div>
          <h1 style={{
            fontSize: 'var(--font-3xl)',
            fontWeight: 900,
            letterSpacing: '-1.5px',
            color: '#00d4aa',
            marginBottom: '4px',
            lineHeight: 1.1,
          }}>
            TOGG Drive
          </h1>
          <p style={{
            fontSize: 'var(--font-xs)',
            color: 'var(--togg-gray-400)',
            letterSpacing: '3.5px',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}>
            Akıllı Araç Paylaşımı
          </p>
        </div>

        {/* Slide card */}
        <div style={{
          width: '100%',
          maxWidth: '320px',
          minHeight: '210px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-2xl)',
        }}>
          <div
            key={currentSlide}
            className="animate-fadeInUp"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-md)',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: '96px',
              height: '96px',
              borderRadius: '28px',
              background: `linear-gradient(135deg, ${slide.accent}1a 0%, ${slide.accent}0d 100%)`,
              border: `1px solid ${slide.accent}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              backdropFilter: 'blur(10px)',
              boxShadow: `0 8px 32px ${slide.accent}22`,
            }}>
              <span>{slide.emoji}</span>
            </div>

            <h2 style={{
              fontSize: 'var(--font-xl)',
              fontWeight: 700,
              color: 'var(--togg-white)',
              lineHeight: 1.2,
            }}>
              {slide.title}
            </h2>
            <p style={{
              fontSize: 'var(--font-sm)',
              color: 'var(--togg-gray-300)',
              maxWidth: '280px',
              lineHeight: 1.65,
            }}>
              {slide.desc}
            </p>
          </div>
        </div>

        {/* Dots */}
        <div style={{
          display: 'flex',
          gap: '7px',
          marginBottom: 'var(--space-2xl)',
          alignItems: 'center',
        }}>
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                width: i === currentSlide ? '24px' : '7px',
                height: '7px',
                borderRadius: 'var(--radius-full)',
                background: i === currentSlide ? s.accent : 'var(--togg-gray-400)',
                transition: 'all var(--transition-base)',
                opacity: i === currentSlide ? 1 : 0.35,
                boxShadow: i === currentSlide ? `0 0 8px ${s.accent}88` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{
        padding: '0 var(--space-lg) calc(var(--space-2xl) + env(safe-area-inset-bottom, 0px))',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)',
        position: 'relative',
        zIndex: 1,
      }}>
        <button
          className="btn btn-primary btn-lg btn-full"
          onClick={() => navigateTo(APP_STATES.REGISTER)}
          style={{ fontWeight: 800, letterSpacing: '0.5px', fontSize: 'var(--font-lg)' }}
        >
          Başlayın
        </button>
        <button
          className="btn btn-secondary btn-full"
          onClick={() => {
            // Set a flag so Register knows to skip KYC after OTP
            setUser(prev => ({ ...prev, kycStatus: 'approved' }));
            navigateTo(APP_STATES.REGISTER);
          }}
          style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}
        >
          Zaten hesabım var
        </button>
      </div>
    </div>
  );
}
