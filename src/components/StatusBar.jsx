import { useState } from 'react';
import { useApp, APP_STATES } from '../context/AppContext';

export default function StatusBar() {
  return (
    <div className="status-bar">
      <span className="status-bar-time">22:10</span>
      <div className="status-bar-icons">
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="0.5"/>
          <rect x="4.5" y="5" width="3" height="7" rx="0.5"/>
          <rect x="9" y="2" width="3" height="10" rx="0.5"/>
          <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" opacity="0.3"/>
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 2.4C5.6 2.4 3.4 3.3 1.8 4.8L0 3C2 1.1 4.9 0 8 0s6 1.1 8 3l-1.8 1.8C12.6 3.3 10.4 2.4 8 2.4z" opacity="0.3"/>
          <path d="M8 5.6c-1.7 0-3.2.7-4.3 1.8L2 5.6c1.5-1.5 3.5-2.4 6-2.4s4.5.9 6 2.4l-1.7 1.8C11.2 6.3 9.7 5.6 8 5.6z" opacity="0.6"/>
          <path d="M8 8.8c-.9 0-1.8.4-2.4 1L8 12l2.4-2.2C9.8 9.2 8.9 8.8 8 8.8z"/>
        </svg>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <svg width="22" height="11" viewBox="0 0 22 11" fill="currentColor">
            <rect x="0" y="0" width="19" height="11" rx="2" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4"/>
            <rect x="1.5" y="1.5" width="13" height="8" rx="1" fill="var(--togg-green)"/>
            <rect x="19.5" y="3" width="2" height="5" rx="1" opacity="0.4"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
