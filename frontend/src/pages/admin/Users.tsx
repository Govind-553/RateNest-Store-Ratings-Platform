import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  UserPlus,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Eye,
  Shield,
  Store,
  User as UserIcon,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { Role, User } from '../../types';
import { SearchBar } from '../../components/SearchBar';
import { Pagination } from '../../components/Pagination';
import { Skeleton } from '../../components/Skeleton';
import { EmptyState } from '../../components/EmptyState';
import { CreateUserModal } from './CreateUserModal';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | ''>('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getUsers({
        page,
        limit,
        search,
        role: roleFilter || undefined,
        sortBy,
        sortOrder,
      });
      setUsers(data.items);
      setTotal(data.meta.total);
      setTotalPages(data.meta.totalPages);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, roleFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return <ChevronsUpDown size={14} className="th-sort-icon" />;
    return sortOrder === 'asc' ? (
      <ChevronUp size={14} className="th-sort-icon th-sort-active" />
    ) : (
      <ChevronDown size={14} className="th-sort-icon th-sort-active" />
    );
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="badge badge-admin">
            <Shield size={12} />
            ADMIN
          </span>
        );
      case 'STORE_OWNER':
        return (
          <span className="badge badge-owner">
            <Store size={12} />
            OWNER
          </span>
        );
      case 'USER':
      default:
        return (
          <span className="badge badge-user">
            <UserIcon size={12} />
            USER
          </span>
        );
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Users Management</h1>
          <p>Manage accounts, inspect permissions, and register new members</p>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <UserPlus size={16} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      <div className="data-table-container">
        {/* Table Filters Toolbar */}
        <div className="data-table-toolbar">
          <SearchBar
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search by name, email, or address…"
            style={{ flex: 1, minWidth: 260 }}
          />

          <div className="filter-bar">
            <div className="filter-group">
              <span className="filter-label">Role</span>
              <select
                className="form-select filter-select"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value as Role | '');
                  setPage(1);
                }}
              >
                <option value="">All Roles</option>
                <option value="USER">Normal Users</option>
                <option value="STORE_OWNER">Store Owners</option>
                <option value="ADMIN">Administrators</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort('name')} aria-sort={sortBy === 'name' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : undefined}>
                  <span className="th-sort">{'Name'} {renderSortIcon('name')}</span>
                </th>
                <th className="sortable" onClick={() => handleSort('email')} aria-sort={sortBy === 'email' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : undefined}>
                  <span className="th-sort">{'Email'} {renderSortIcon('email')}</span>
                </th>
                <th className="sortable" onClick={() => handleSort('address')} aria-sort={sortBy === 'address' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : undefined}>
                  <span className="th-sort">{'Address'} {renderSortIcon('address')}</span>
                </th>
                <th className="sortable" onClick={() => handleSort('role')} aria-sort={sortBy === 'role' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : undefined}>
                  <span className="th-sort">{'Role'} {renderSortIcon('role')}</span>
                </th>
                <th>Store Rating</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>

            {isLoading ? (
              <Skeleton type="row" count={5} />
            ) : users.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={6} style={{ padding: 0 }}>
                    <EmptyState
                      title="No users found"
                      description="Try adjusting your search criteria or role filter."
                    />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <span className="table-cell-strong">{u.name}</span>
                    </td>
                    <td>{u.email}</td>
                    <td style={{ maxWidth: 280 }} title={u.address} className="truncate">
                      {u.address}
                    </td>
                    <td>{getRoleBadge(u.role)}</td>
                    <td>
                      {u.role === 'STORE_OWNER' && u.storeRatingInfo ? (
                        <span className="rating-badge">
                          ★ {u.storeRatingInfo.averageRating ?? 'N/A'} ·{' '}
                          {u.storeRatingInfo.storeName}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>—</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to={`/admin/users/${u.id}`} className="btn btn-ghost btn-sm" title="View details">
                        <Eye size={15} />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>

      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserCreated={fetchUsers}
      />
    </div>
  );
};