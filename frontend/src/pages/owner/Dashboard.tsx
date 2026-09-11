import React, { useState, useEffect } from 'react';
import { Store, Star, Users, MapPin, Mail, Calendar, AlertCircle, BadgeCheck } from 'lucide-react';
import { ownerService } from '../../services/ownerService';
import type { OwnerDashboardData } from '../../types';
import { StatCard } from '../../components/StatCard';
import { RatingStars } from '../../components/RatingStars';
import { Skeleton } from '../../components/Skeleton';
import { EmptyState } from '../../components/EmptyState';

export const OwnerDashboard: React.FC = () => {
  const [data, setData] = useState<OwnerDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOwnerData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await ownerService.getDashboard();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load store owner dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, []);

  if (isLoading) {
    return (
      <div>
        <div className="page-header">
          <div className="page-title">
            <h1>Store Dashboard</h1>
            <p>Performance and feedback overview for your store</p>
          </div>
        </div>
        <Skeleton type="stats" count={3} />
        <div className="section-spacer">
          <Skeleton type="circle" count={4} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <AlertCircle size={28} style={{ margin: '0 auto 0.5rem', color: 'var(--color-danger)' }} />
        <h3>Unable to load dashboard</h3>
        <p>{error}</p>
        <button className="btn btn-secondary" onClick={fetchOwnerData}>
          Retry
        </button>
      </div>
    );
  }

  if (!data || !data.hasStore || !data.store) {
    return (
      <div>
        <div className="page-header">
          <div className="page-title">
            <h1>Store Dashboard</h1>
          </div>
        </div>
        <EmptyState
          title="No store assigned yet"
          description="Your store owner account does not have an assigned store yet. Please contact an administrator to register and assign your store."
          icon={<Store size={30} />}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>{data.store.name}</h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-5)',
              flexWrap: 'wrap',
              color: 'var(--color-text-muted)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <MapPin size={14} /> {data.store.address}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Mail size={14} /> {data.store.email}
            </span>
          </div>
        </div>
        <span className="badge badge-owner" style={{ padding: '0.4rem 0.75rem' }}>
          <BadgeCheck size={13} /> Owner View
        </span>
      </div>

      {/* Overview Stat Cards */}
      <div className="stats-grid">
        <StatCard
          label="Average Rating"
          value={data.averageRating ? `${data.averageRating} / 5.0` : 'N/A'}
          icon={<Star size={22} />}
          hint={data.averageRating ? 'Based on verified customer submissions' : 'No ratings received yet'}
          variant="accent"
        />
        <StatCard
          label="Total Reviews"
          value={data.totalRatings}
          icon={<Users size={22} />}
          hint="Customers who rated your store"
        />
        <StatCard
          label="Store Status"
          value="Active"
          icon={<Store size={22} />}
          hint="Open for customer ratings"
        />
      </div>

      {/* Raters list */}
      <div className="card section-spacer">
        <div className="card-header">
          <h3 className="card-title">
              Customer Reviews &amp; Ratings
              <span className="card-subtitle">Individual feedback submitted by customers</span>
            </h3>
          <span className="rating-badge">★ {data.averageRating || '0.0'} Average</span>
        </div>

        {data.raters.length === 0 ? (
          <EmptyState
            title="No ratings yet"
            description="Your store has not received any ratings from customers yet. Share your store link with customers to get feedback!"
          />
        ) : (
          <div className="raters-container">
            {data.raters.map((rater) => (
              <div key={rater.id} className="rater-item">
                <div className="rater-identity">
                  <span className="rater-avatar">{rater.name.charAt(0).toUpperCase()}</span>
                  <div style={{ minWidth: 0 }}>
                    <div className="rater-name">{rater.name}</div>
                    <div className="rater-email">{rater.email}</div>
                  </div>
                </div>

                <div className="rater-meta">
                  <RatingStars value={rater.rating} readonly size={16} showText={false} />
                  <span className="rater-score">{rater.rating} / 5</span>
                  <span className="rater-date">
                    <Calendar size={12} />
                    {new Date(rater.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};