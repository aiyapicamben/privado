import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      setTime(`${h}:${m}`);
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="status-bar">
      <span className="status-bar-time">{time}</span>
      <div className="status-bar-icons">
        {/* Signal bars */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
          <rect x="0"   y="8"  width="3" height="4"  rx="1" opacity="1"/>
          <rect x="4.5" y="5"  width="3" height="7"  rx="1" opacity="1"/>
          <rect x="9"   y="2"  width="3" height="10" rx="1" opacity="1"/>
          <rect x="13.5" y="0" width="3" height="12" rx="1" opacity="0.3"/>
        </svg>
        {/* WiFi */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
          <path d="M7.5 8.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          <path d="M7.5 5.2C5.9 5.2 4.5 5.85 3.5 6.9L2.1 5.5A7 7 0 0 1 7.5 3.3a7 7 0 0 1 5.4 2.2L11.5 6.9A5 5 0 0 0 7.5 5.2z" opacity="0.65"/>
          <path d="M7.5 1.6A10.2 10.2 0 0 0 .5 4.8L1.9 6.2A8.3 8.3 0 0 1 7.5 3.6a8.3 8.3 0 0 1 5.6 2.6L14.5 4.8A10.2 10.2 0 0 0 7.5 1.6z" opacity="0.3"/>
        </svg>
        {/* Battery */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
            <rect x="2" y="2" width="15" height="8" rx="1.5" fill="var(--togg-green)"/>
            <path d="M22.5 4v4a2 2 0 0 0 0-4z" fill="currentColor" opacity="0.4"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
