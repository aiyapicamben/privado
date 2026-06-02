import React, { useState } from 'react';

export default function AppleEmoji({ symbol, size = 24, className = '', style = {} }) {
  const [hasError, setHasError] = useState(false);

  // Try to use twemoji's code point converter if available, fallback to basic conversion
  let cp = '';
  if (window.twemoji && window.twemoji.convert) {
    cp = window.twemoji.convert.toCodePoint(symbol);
  } else {
    // Fallback basic surrogate pair conversion for common emojis
    cp = Array.from(symbol).map(c => c.codePointAt(0).toString(16)).join('-');
  }

  // Handle some specific variations that Twemoji might parse differently
  if (cp.includes('-fe0f')) {
    cp = cp.replace('-fe0f', '');
  }

  if (!cp || hasError) {
    return (
      <span 
        className={className} 
        style={{ 
          fontSize: `${size}px`, 
          lineHeight: 1, 
          display: 'inline-block',
          verticalAlign: 'middle', 
          fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif',
          ...style 
        }}
      >
        {symbol}
      </span>
    );
  }

  return (
    <span 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: size, 
        height: size, 
        verticalAlign: 'middle',
        ...style 
      }} 
      className={className}
    >
      <img 
        src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/${cp}.png`} 
        alt={symbol} 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain',
          border: 'none', 
          pointerEvents: 'none',
        }} 
        onError={() => setHasError(true)}
      />
    </span>
  );
}
