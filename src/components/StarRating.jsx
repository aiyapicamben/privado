import { useState } from 'react';

export default function StarRating({ onRate }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleRate = (value) => {
    setRating(value);
    if (onRate) onRate(value);
  };

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
            transition: 'transform 150ms ease',
            transform: (hover === star || rating === star) ? 'scale(1.2)' : 'scale(1)',
            filter: star <= (hover || rating) ? 'none' : 'grayscale(1) opacity(0.3)',
          }}
        >
          ⭐
        </button>
      ))}
    </div>
  );
}
