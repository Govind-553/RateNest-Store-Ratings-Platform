import React from 'react';

interface SkeletonProps {
  type?: 'card' | 'row' | 'stats' | 'text' | 'circle';
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ type = 'text', count = 1 }) => {
  const items = Array.from({ length: count });

  if (type === 'stats') {
    return (
      <div className="stats-grid">
        {items.map((_, i) => (
          <div key={i} className="card" style={{ height: 110, display: 'flex', alignItems: 'center' }}>
            <div className="skeleton" style={{ width: '100%', height: '100%' }} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="store-grid">
        {items.map((_, i) => (
          <div key={i} className="store-card" style={{ height: 230, gap: 12 }}>
            <div className="skeleton" style={{ height: 22, width: '65%' }} />
            <div className="skeleton" style={{ height: 14, width: '90%' }} />
            <div className="skeleton" style={{ height: 88, marginTop: 'auto', borderRadius: 'var(--radius-md)' }} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'row') {
    return (
      <tbody>
        {items.map((_, i) => (
          <tr key={i}>
            <td colSpan={6} style={{ padding: '0.9rem var(--space-5)' }}>
              <div className="skeleton" style={{ height: 22, width: '100%' }} />
            </td>
          </tr>
        ))}
      </tbody>
    );
  }

  if (type === 'circle') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
        {items.map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="skeleton skeleton-circle" style={{ width: 44, height: 44 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="skeleton" style={{ height: 16, width: '40%' }} />
              <div className="skeleton" style={{ height: 13, width: '70%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      {items.map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 18, width: '100%' }} />
      ))}
    </div>
  );
};