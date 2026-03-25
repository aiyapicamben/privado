import { useState } from 'react';

export default function StarRating({ rating = 0, onRatingChange }) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRatingChange?.(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(rating)}
          style={{
            background: 'none', border: 'none', padding: 0,
            fontSize: '32px', cursor: 'pointer',
            transition: 'transform 200ms ease',
            transform: (hover || rating) >= star ? 'scale(1.1)' : 'scale(1)',
            filter: (hover || rating) >= star ? 'drop-shadow(0 0 8px rgba(255,165,2,0.5))' : 'none'
          }}
        >
          {(hover || rating) >= star ? '⭐' : '☆'}
        </button>
      ))}
    </div>
  );
}
