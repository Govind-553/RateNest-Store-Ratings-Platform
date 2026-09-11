import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Store, Star, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { AdminDashboardStats } from '../../types';
import { StatCard } from '../../components/StatCard';
import { Skeleton } from '../../components/Skeleton';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch admin stats.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Platform Administration</h1>
          <p>Real-time ecosystem metrics and system management</p>
        </div>
        <span className="badge badge-admin" style={{ padding: '0.4rem 0.75rem' }}>
          <ShieldCheck size={13} /> Admin Console
        </span>
      </div>

      {isLoading ? (
        <Skeleton type="stats" count={3} />
      ) : error ? (
        <div className="error-state">
          <AlertCircle size={28} className="alert-icon" style={{ margin: '0 auto 0.5rem' }} />
          <h3>Unable to load dashboard</h3>
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={fetchStats}>
            Try again
          </button>
        </div>
      ) : (
        <div className="stats-grid">
          <StatCard
            label="Total Platform Users"
            value={stats?.totalUsers || 0}
            icon={<Users size={22} />}
            hint="Administrators, owners & users"
            variant="accent"
          />
          <StatCard
            label="Registered Stores"
            value={stats?.totalStores || 0}
            icon={<Store size={22} />}
            hint="Active storefronts"
          />
          <StatCard
            label="Submitted Ratings"
            value={stats?.totalRatings || 0}
            icon={<Star size={22} />}
            hint="Total reviews submitted"
          />
        </div>
      )}

      {/* Quick Navigation / Action Section */}
      <div className="quick-actions-grid">
        <div className="card">
          <span className="quick-action-icon" style={{ backgroundColor: 'var(--color-info-soft)', color: 'var(--color-info)' }}>
            <Users size={20} />
          </span>
          <h3 className="quick-action-title" style={{ margin: '0.85rem 0 0.35rem' }}>
            User Management
          </h3>
          <p className="quick-action-desc">
            Manage platform accounts across all roles — administrators, normal users, and store
            owners. Inspect individual profiles and permissions.
          </p>
          <div className="quick-action-actions">
            <Link to="/admin/users" className="btn btn-secondary btn-sm">
              <span>View All Users</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="card">
          <span className="quick-action-icon" style={{ backgroundColor: 'var(--color-star-soft)', color: 'var(--color-star)' }}>
            <Store size={20} />
          </span>
          <h3 className="quick-action-title" style={{ margin: '0.85rem 0 0.35rem' }}>
            Store Directory
          </h3>
          <p className="quick-action-desc">
            Browse registered stores, monitor store feedback scores, and register new merchant
            stores with assigned owners.
          </p>
          <div className="quick-action-actions">
            <Link to="/admin/stores" className="btn btn-secondary btn-sm">
              <span>View All Stores</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};