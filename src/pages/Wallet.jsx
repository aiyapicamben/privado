import { useApp, APP_STATES } from '../context/AppContext';
import StatusBar from '../components/StatusBar';

export default function Wallet() {
  const { navigateTo, balance, tripHistory, user } = useApp();

  const totalSpent = tripHistory.reduce((sum, t) => sum + t.cost, 0);

  return (
    <div className="screen" style={{ background: 'var(--gradient-dark)' }}>
      <StatusBar />

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '4px 20px 16px',
      }}>
        <button
          onClick={() => navigateTo(APP_STATES.MAP)}
          style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px', width: '40px', height: '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '16px', cursor: 'pointer',
          }}
        >
          ←
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>
          💰 Cüzdan
        </h1>
        <div style={{ width: '40px' }} />
      </div>

      <div style={{
        flex: 1, overflow: 'auto', padding: '0 20px 32px',
        display: 'flex', flexDirection: 'column', gap: '20px',
      }}>

        {/* Balance card */}
        <div className="animate-fadeInUp" style={{
          borderRadius: '20px', padding: '28px 24px',
          background: 'linear-gradient(135deg, rgba(0,212,170,0.12) 0%, rgba(79,172,254,0.08) 100%)',
          border: '1px solid rgba(0,212,170,0.2)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: '2px',
            borderRadius: '99px',
            background: 'linear-gradient(90deg, transparent, #00d4aa, transparent)',
          }} />
          <p style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px',
            textTransform: 'uppercase', color: 'var(--togg-gray-400)', marginBottom: '8px',
          }}>
            Kullanılabilir Bakiye
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', marginBottom: '16px' }}>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#00d4aa', marginTop: '6px' }}>₺</span>
            <span style={{ fontSize: '48px', fontWeight: 900, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
              {Math.floor(balance)}
            </span>
            <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--togg-gray-300)', marginTop: '6px' }}>
              .{String(Math.round((balance % 1) * 100)).padStart(2, '0')}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary" style={{ flex: 1, padding: '12px', fontSize: '14px', fontWeight: 700 }}>
              ➕ Bakiye Yükle
            </button>
            <button className="btn btn-secondary" style={{ flex: 1, padding: '12px', fontSize: '14px', fontWeight: 700 }}>
              🎁 Kupon Kullan
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '16px',
          }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--togg-gray-400)', marginBottom: '6px' }}>
              Toplam Sürüş
            </p>
            <p style={{ fontSize: '24px', fontWeight: 800, color: '#00d4aa' }}>{tripHistory.length}</p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '16px',
          }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--togg-gray-400)', marginBottom: '6px' }}>
              Toplam Harcama
            </p>
            <p style={{ fontSize: '24px', fontWeight: 800, color: '#ffa502' }}>{totalSpent.toFixed(0)} ₺</p>
          </div>
        </div>

        {/* Trip history */}
        <div>
          <h2 style={{
            fontSize: '14px', fontWeight: 700, letterSpacing: '1px',
            textTransform: 'uppercase', color: 'var(--togg-gray-400)', marginBottom: '12px',
          }}>
            📋 Sürüş Geçmişi
          </h2>

          {tripHistory.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '40px 20px',
              color: 'var(--togg-gray-400)', fontSize: '14px',
            }}>
              <p style={{ fontSize: '40px', marginBottom: '12px' }}>🚗</p>
              <p>Henüz sürüş geçmişi yok</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tripHistory.map((trip, i) => (
                <div key={trip.id || i} className="animate-fadeInUp" style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px', padding: '16px',
                  display: 'flex', alignItems: 'center', gap: '14px',
                  animationDelay: `${i * 80}ms`,
                  animationFillMode: 'backwards',
                }}>
                  {/* Car icon */}
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px', flexShrink: 0,
                  }}>
                    🚘
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
                        {trip.model}
                      </span>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: '#00d4aa' }}>
                        {trip.cost.toFixed(2)} ₺
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'var(--togg-gray-400)' }}>
                        {trip.plate} • {trip.durationMin} dk
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--togg-gray-500)' }}>
                        {trip.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
