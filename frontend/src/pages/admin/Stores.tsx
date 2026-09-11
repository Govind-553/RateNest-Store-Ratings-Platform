import React, { useState, useEffect, useCallback } from 'react';
import { Plus, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { Store } from '../../types';
import { SearchBar } from '../../components/SearchBar';
import { Pagination } from '../../components/Pagination';
import { Skeleton } from '../../components/Skeleton';
import { EmptyState } from '../../components/EmptyState';
import { RatingStars } from '../../components/RatingStars';
import { CreateStoreModal } from './CreateStoreModal';

export const AdminStores: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getStores({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      });
      setStores(data.items);
      setTotal(data.meta.total);
      setTotalPages(data.meta.totalPages);
    } catch (err) {
      console.error('Failed to load stores:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

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

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Stores Directory</h1>
          <p>Review registered stores, ratings, and merchant owner assignments</p>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} />
            <span>Add Store</span>
          </button>
        </div>
      </div>

      <div className="data-table-container">
        {/* Toolbar */}
        <div className="data-table-toolbar">
          <SearchBar
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search stores by name, email, or address…"
            style={{ flex: 1, minWidth: 280 }}
          />
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort('name')} aria-sort={sortBy === 'name' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : undefined}>
                  <span className="th-sort">{'Store Name'} {renderSortIcon('name')}</span>
                </th>
                <th className="sortable" onClick={() => handleSort('email')} aria-sort={sortBy === 'email' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : undefined}>
                  <span className="th-sort">{'Email'} {renderSortIcon('email')}</span>
                </th>
                <th className="sortable" onClick={() => handleSort('address')} aria-sort={sortBy === 'address' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : undefined}>
                  <span className="th-sort">{'Address'} {renderSortIcon('address')}</span>
                </th>
                <th>Average Rating</th>
                <th>Assigned Owner</th>
              </tr>
            </thead>

            {isLoading ? (
              <Skeleton type="row" count={5} />
            ) : stores.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={5} style={{ padding: 0 }}>
                    <EmptyState
                      title="No stores found"
                      description="Try adjusting your search criteria or register a new store."
                    />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {stores.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <span className="table-cell-strong">{s.name}</span>
                    </td>
                    <td>{s.email || '—'}</td>
                    <td style={{ maxWidth: 280 }} title={s.address} className="truncate">
                      {s.address}
                    </td>
                    <td>
                      <RatingStars
                        value={s.averageRating}
                        readonly
                        size={16}
                        count={s.totalRatings}
                      />
                    </td>
                    <td>
                      {s.owner ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
                            {s.owner.name}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            {s.owner.email}
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                          Unassigned
                        </span>
                      )}
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

      <CreateStoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStoreCreated={fetchStores}
      />
    </div>
  );
};