import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  value: number | null;
  onChange?: (val: number) => void;
  readonly?: boolean;
  size?: number;
  showText?: boolean;
  count?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  value,
  onChange,
  readonly = false,
  size = 18,
  showText = true,
  count,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayRating = hoverValue !== null ? hoverValue : value || 0;

  const handleKeyDown = (e: React.KeyboardEvent, star: number) => {
    if (readonly) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onChange) onChange(star);
    }
  };

  return (
    <div
      className="rating-stars"
      role={readonly ? 'img' : 'radiogroup'}
      aria-label={
        readonly
          ? `Rating: ${value !== null ? `${value} out of 5 stars` : 'Not rated yet'}`
          : 'Select a rating from 1 to 5 stars'
      }
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayRating;
        const isInteractive = !readonly;

        return (
          <button
            key={star}
            type="button"
            className={`star-btn ${isInteractive ? 'interactive' : 'readonly-star'} ${
              isFilled ? 'active' : ''
            } ${hoverValue !== null && star <= hoverValue ? 'hovered' : ''}`}
            onClick={() => {
              if (!readonly && onChange) onChange(star);
            }}
            onMouseEnter={() => {
              if (!readonly) setHoverValue(star);
            }}
            onMouseLeave={() => {
              if (!readonly) setHoverValue(null);
            }}
            onKeyDown={(e) => handleKeyDown(e, star)}
            disabled={readonly}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            role={isInteractive ? 'radio' : undefined}
            aria-checked={isInteractive ? value === star : undefined}
            tabIndex={isInteractive ? 0 : -1}
          >
            <Star
              size={size}
              fill={isFilled ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={2}
            />
          </button>
        );
      })}

      {showText && (
        <span className="rating-badge" style={{ marginLeft: 8 }}>
          {value !== null && value !== undefined && value > 0 ? (
            <>
              <strong>{Number(value).toFixed(1)}</strong> / 5
              {count !== undefined && count > 0 && (
                <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>
                  ({count})
                </span>
              )}
            </>
          ) : (
            <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>
              No ratings yet
            </span>
          )}
        </span>
      )}
    </div>
  );
};