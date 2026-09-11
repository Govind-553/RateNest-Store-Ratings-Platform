import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Shield, Calendar, Store, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { User } from '../../types';
import { Skeleton } from '../../components/Skeleton';
import { RatingStars } from '../../components/RatingStars';

export const AdminUserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    adminService
      .getUserById(id)
      .then((data) => setUser(data))
      .catch((err) => setError(err.message || 'User not found.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const roleBadgeClass =
    user?.role === 'ADMIN'
      ? 'badge-admin'
      : user?.role === 'STORE_OWNER'
        ? 'badge-owner'
        : 'badge-user';

  if (isLoading) {
    return (
      <div>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/admin/users" className="btn btn-ghost btn-sm">
            <ArrowLeft size={16} />
            <span>Back to Users</span>
          </Link>
        </div>
        <Skeleton count={6} />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div>
        <Link to="/admin/users" className="btn btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Users</span>
        </Link>
        <div className="error-state">
          <AlertCircle size={28} style={{ margin: '0 auto 0.5rem', color: 'var(--color-danger)' }} />
          <h3>Unable to load user</h3>
          <p>{error || 'User not found.'}</p>
          <Link to="/admin/users" className="btn btn-secondary">
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/admin/users" className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} />
          <span>Back to Users</span>
        </Link>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <span
            className="user-avatar"
            style={{
              width: 56,
              height: 56,
              fontSize: '1.125rem',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            {getInitials(user.name)}
          </span>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>{user.name}</h1>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
              {user.email}
            </p>
          </div>
          <span className={`badge ${roleBadgeClass}`} style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
            {user.role}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <h3 className="card-title">Account Information</h3>
        </div>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">
              <Mail size={12} /> Email Address
            </span>
            <span className="detail-value">{user.email}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <Shield size={12} /> System Role
            </span>
            <span className="detail-value">{user.role}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <MapPin size={12} /> Physical Address
            </span>
            <span className="detail-value">{user.address}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <Calendar size={12} /> Registration Date
            </span>
            <span className="detail-value">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Store Owner specific store overview if role is STORE_OWNER */}
      {user.role === 'STORE_OWNER' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Store size={18} style={{ color: 'var(--color-star)' }} />
                Owned Store & Feedback
              </span>
            </h3>
          </div>

          {user.stores && user.stores.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {user.stores.map((s) => (
                <div key={s.id} className="store-chip-card">
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-primary)', marginBottom: 4 }}>
                      {s.name}
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{s.address}</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{s.email}</span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Store Score
                    </div>
                    <RatingStars value={s.averageRating} readonly size={18} count={s.totalRatings} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              No stores have been assigned to this store owner yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
};