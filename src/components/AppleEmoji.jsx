import React from 'react';

export default function AppleEmoji({ symbol, size = 24, className = '', style = {} }) {
  // Try to use twemoji's code point converter if available, fallback to basic conversion
  let cp = '';
  if (window.twemoji && window.twemoji.convert) {
    cp = window.twemoji.convert.toCodePoint(symbol);
  } else {
    // Fallback basic surrogate pair conversion for common emojis
    cp = Array.from(symbol).map(c => c.codePointAt(0).toString(16)).join('-');
  }

  // Handle some specific variations that Twemoji might parse differently
  // e.g., removing the fe0f variation selector if it causes 404s, though Apple dataset usually handles it
  if (cp.includes('-fe0f')) {
    cp = cp.replace('-fe0f', '');
  }

  if (!cp) return <span className={className} style={style}>{symbol}</span>;

  return (
    <img 
      src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/${cp}.png`} 
      alt={symbol} 
      className={`emoji ${className}`}
      style={{ 
        width: size, 
        height: size, 
        verticalAlign: 'middle', 
        border: 'none', 
        pointerEvents: 'none',
        display: 'inline-block',
        ...style 
      }} 
      onError={(e) => {
        // Fallback to text if the image fails to load
        e.target.style.display = 'none';
        if (e.target.nextSibling) e.target.nextSibling.style.display = 'inline';
      }}
    />
  );
}
