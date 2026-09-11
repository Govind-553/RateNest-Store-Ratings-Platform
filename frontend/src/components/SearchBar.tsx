import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  onClear?: () => void;
  style?: React.CSSProperties;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
  style,
}) => {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minWidth: 260, ...style }} className="search-bar">
      <Search
        size={16}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '0.875rem',
          color: 'var(--color-text-muted)',
          pointerEvents: 'none',
        }}
      />
      <input
        type="text"
        className="form-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        style={{ paddingLeft: '2.5rem', paddingRight: value ? '2.5rem' : '0.875rem' }}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            if (onClear) onClear();
          }}
          aria-label="Clear search"
          style={{
            position: 'absolute',
            right: '0.75rem',
            background: 'transparent',
            color: 'var(--color-text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 3,
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};