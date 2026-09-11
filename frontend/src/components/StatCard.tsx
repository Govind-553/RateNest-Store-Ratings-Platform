import React from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  hint?: string;
  variant?: 'accent' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  hint,
  variant = 'neutral',
}) => {
  return (
    <div className={`stat-card ${variant === 'accent' ? 'stat-card-accent' : 'stat-card-neutral'}`}>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {hint && <span className="stat-hint">{hint}</span>}
      </div>
      <div className="stat-icon">{icon}</div>
    </div>
  );
};