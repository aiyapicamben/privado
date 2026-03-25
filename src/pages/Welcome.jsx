import { useState, useEffect } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';
import StatusBar from '../components/StatusBar';

const slides = [
  {
    image: '/privado/images/togg-t10x.png',
    title: 'TOGG ile Özgürce Sür',
    desc: 'Türkiye\'nin elektrikli otomobili TOGG ile şehir içi ulaşımın en akıllı yolunu keşfedin.',
    gradient: 'linear-gradient(135deg, rgba(0,212,170,0.15) 0%, rgba(79,172,254,0.1) 100%)',
  },
  {
    image: '/privado/images/togg-t10f.png',
    title: 'Yakınındaki Aracı Bul',
    desc: 'Haritada en yakın TOGG\'u bulun, kilidini açın ve hemen sürmeye başlayın.',
    gradient: 'linear-gradient(135deg, rgba(124,92,252,0.15) 0%, rgba(79,172,254,0.1) 100%)',
  },
  {
    image: '/privado/images/togg-hero.png',
    title: 'Dakika Başı Öde',
    desc: 'Sadece kullandığınız kadar ödeyin. Yakıt, sigorta ve bakım dahil.',
    gradient: 'linear-gradient(135deg, rgba(0,212,170,0.15) 0%, rgba(124,92,252,0.1) 100%)',
  },
];

export default function Welcome() {
  const { navigateTo, setUser, showToast } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-play slides
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 300);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 200);
  };

  return (
    <div className="screen" style={{
      background: 'var(--togg-navy)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background orbs */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '-20%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,170,0.06) 0%, transparent 70%)',
        animation: 'float 6s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '-15%',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,172,254,0.05) 0%, transparent 70%)',
        animation: 'float 8s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,92,252,0.04) 0%, transparent 70%)',
        animation: 'float 7s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      <StatusBar />

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo & Brand */}
        <div className="animate-fadeInDown" style={{
          textAlign: 'center',
          padding: 'var(--space-lg) var(--space-lg) 0',
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            overflow: 'hidden',
            margin: '0 auto 12px',
            boxShadow: '0 8px 32px rgba(0,212,170,0.2)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <img src="/privado/images/togg-logo.png" alt="Tur At" style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }} />
          </div>
          <h1 className="brand-glow" style={{
            fontSize: '32px',
            marginBottom: '2px',
          }}>
            Tur At
          </h1>
          <p style={{
            fontSize: '10px',
            color: 'var(--togg-gray-400)',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}>
            Akıllı Araç Paylaşımı
          </p>
        </div>

        {/* Hero Vehicle Image */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 var(--space-md)',
        }}>
          {/* Vehicle Image with glow */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '360px',
            marginBottom: 'var(--space-lg)',
          }}>
            <div style={{
              position: 'absolute',
              bottom: '10%',
              left: '10%',
              right: '10%',
              height: '40px',
              background: 'radial-gradient(ellipse, rgba(0,212,170,0.3) 0%, transparent 70%)',
              filter: 'blur(15px)',
              borderRadius: '50%',
            }} />
            <img
              key={currentSlide}
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              style={{
                width: '100%',
                height: '220px',
                objectFit: 'contain',
                display: 'block',
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning ? 'scale(0.95) translateX(-20px)' : 'scale(1) translateX(0)',
                transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))',
              }}
            />
          </div>

          {/* Text Content */}
          <div style={{
            textAlign: 'center',
            minHeight: '100px',
            maxWidth: '320px',
          }}>
            <h2
              key={`title-${currentSlide}`}
              style={{
                fontSize: '22px',
                fontWeight: 800,
                color: 'var(--togg-white)',
                marginBottom: '8px',
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
                transition: 'all 300ms ease 100ms',
              }}
            >
              {slides[currentSlide].title}
            </h2>
            <p
              key={`desc-${currentSlide}`}
              style={{
                fontSize: '14px',
                color: 'var(--togg-gray-300)',
                lineHeight: 1.6,
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
                transition: 'all 300ms ease 200ms',
              }}
            >
              {slides[currentSlide].desc}
            </p>
          </div>

          {/* Dots */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: 'var(--space-lg)',
          }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                style={{
                  width: i === currentSlide ? '28px' : '8px',
                  height: '8px',
                  borderRadius: 'var(--radius-full)',
                  background: i === currentSlide
                    ? 'linear-gradient(135deg, #00d4aa, #4facfe)'
                    : 'rgba(255,255,255,0.15)',
                  transition: 'all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
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
        }}>
          <button
            className="btn btn-primary btn-lg btn-full"
            onClick={() => navigateTo(APP_STATES.REGISTER)}
            style={{
              fontWeight: 800,
              letterSpacing: '0.5px',
              fontSize: '16px',
              padding: '18px',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,212,170,0.3)',
            }}
          >
            Hemen Başla
          </button>
          <button
            className="btn btn-full"
            onClick={() => {
              setUser(prev => ({ ...prev, isVerified: true, kycStatus: 'approved', phone: '+90 530 123 4567' }));
              showToast('Hoş geldiniz! Giriş başarılı.', 'success');
              navigateTo(APP_STATES.GARAGE);
            }}
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--togg-gray-300)',
              fontSize: '14px',
              fontWeight: 500,
              padding: '14px',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            Zaten hesabım var · Giriş Yap
          </button>
        </div>
      </div>
    </div>
  );
}
