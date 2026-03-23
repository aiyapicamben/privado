import { useState } from 'react';

export default function StarRating({ onRate }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleRate = (value) => {
    setRating(value);
    if (onRate) onRate(value);
  };

  const active = hover || rating;

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      justifyContent: 'center',
    }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRate(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '36px',
            transition: 'transform 150ms ease, filter 150ms ease',
            // Only scale the specific hovered/selected star, not the previous ones
            transform: star === active ? 'scale(1.3)' : star < active ? 'scale(1.1)' : 'scale(1)',
            filter: star <= active ? 'none' : 'grayscale(1) opacity(0.3)',
          }}
        >
          ⭐
        </button>
      ))}
    </div>
  );
}
