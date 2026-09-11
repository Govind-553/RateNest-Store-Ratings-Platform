import React from 'react';
import { Star } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showWordmark = true, className }) => {
  const markSize = size === 'lg' ? 40 : size === 'sm' ? 26 : 32;
  const wordClass =
    size === 'lg' ? 'logo-wordmark-lg' : size === 'sm' ? 'logo-wordmark-sm' : 'logo-wordmark';

  return (
    <span className={`logo ${className || ''}`} aria-label="RateNest">
      <span className="brand-mark" style={{ width: markSize, height: markSize }}>
        <Star size={markSize * 0.55} fill="currentColor" stroke="none" />
      </span>
      {showWordmark && <span className={wordClass}>RateNest</span>}
    </span>
  );
};