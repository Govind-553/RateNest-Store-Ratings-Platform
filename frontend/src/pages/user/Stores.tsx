import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Star, AlertCircle, ArrowUpDown } from 'lucide-react';
import { storeService } from '../../services/storeService';
import type { Store } from '../../types';
import { RatingStars } from '../../components/RatingStars';
import { SearchBar } from '../../components/SearchBar';
import { Pagination } from '../../components/Pagination';
import { Skeleton } from '../../components/Skeleton';
import { EmptyState } from '../../components/EmptyState';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';

export const UserStores: React.FC = () => {
  const { showSuccess, showError } = useToast();

  const [stores, setStores] = useState<Store[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeStore, setActiveStore] = useState<Store | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await storeService.getStores({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      });
      setStores(data.items);
      setTotal(data.meta.total);
      setTotalPages(data.meta.totalPages);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch stores.');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleOpenRatingModal = (store: Store) => {
    setActiveStore(store);
    setSelectedRating(store.myRating || 5);
  };

  const handleCloseRatingModal = () => {
    setActiveStore(null);
  };

  const handleSubmitRating = async () => {
    if (!activeStore) return;
    setIsSubmittingRating(true);

    try {
      if (activeStore.myRating !== null) {
        const res = await storeService.updateRating(activeStore.id, selectedRating);
        showSuccess(res.message || 'Rating updated successfully!');
      } else {
        const res = await storeService.rateStore(activeStore.id, selectedRating);
        showSuccess(res.message || 'Rating submitted successfully!');
      }

      handleCloseRatingModal();
      fetchStores();
    } catch (err: any) {
      showError(err.message || 'Failed to save rating.');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Browse Stores</h1>
          <p>Discover community-reviewed businesses and share your feedback</p>
        </div>
      </div>

      {/* Toolbar: Search + Sort controls */}
      <div className="store-toolbar">
        <div className="store-toolbar-row">
          <SearchBar
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search stores by name or address…"
            style={{ flex: 1, minWidth: 280 }}
          />

          <div className="filter-group">
            <span className="filter-label">
              <ArrowUpDown size={12} style={{ verticalAlign: '-2px' }} /> Sort
            </span>
            <select
              className="form-select filter-select"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb);
                setSortOrder(so as 'asc' | 'desc');
                setPage(1);
              }}
            >
              <option value="name-asc">Name (A–Z)</option>
              <option value="name-desc">Name (Z–A)</option>
              <option value="address-asc">Address (A–Z)</option>
              <option value="createdAt-desc">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="error-state">
          <AlertCircle size={28} style={{ margin: '0 auto 0.5rem', color: 'var(--color-danger)' }} />
          <h3>Unable to load stores</h3>
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={fetchStores}>
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && !error && <Skeleton type="card" count={6} />}

      {/* Empty state */}
      {!isLoading && !error && stores.length === 0 && (
        <EmptyState
          title="No stores found"
          description={
            search
              ? `No stores matching "${search}". Try clearing your search term.`
              : 'There are currently no stores available in the platform.'
          }
          actionText={search ? 'Clear filters' : undefined}
          onAction={() => setSearch('')}
        />
      )}

      {/* Store cards grid */}
      {!isLoading && !error && stores.length > 0 && (
        <>
          <div className="store-grid">
            {stores.map((store) => {
              const hasRated = store.myRating !== null;

              return (
                <div key={store.id} className="store-card">
                  <div>
                    <div className="store-card-top">
                      <h3 className="store-card-title">{store.name}</h3>
                    </div>

                    <div className="store-card-address">
                      <MapPin size={15} />
                      <span>{store.address}</span>
                    </div>
                  </div>

                  <div className="store-rating-section">
                    <div className="rating-row">
                      <span className="rating-label">Overall Rating</span>
                      <RatingStars value={store.averageRating} readonly size={15} count={store.totalRatings} />
                    </div>

                    <div className="user-rating-action">
                      <div className="user-rating-block">
                        <span className="user-rating-block-label">Your Rating</span>
                        {hasRated ? (
                          <span className="user-rating-value">
                            <Star size={13} fill="currentColor" style={{ display: 'inline', verticalAlign: '-2px', marginRight: 2 }} />
                            {store.myRating} of 5
                          </span>
                        ) : (
                          <span className="user-rating-value-none">Not rated yet</span>
                        )}
                      </div>

                      <button
                        className={`btn btn-sm ${hasRated ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => handleOpenRatingModal(store)}
                      >
                        <Star size={13} />
                        <span>{hasRated ? 'Modify Rating' : 'Rate Store'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="section-spacer">
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={limit}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </>
      )}

      {/* Rating Interactive Modal */}
      {activeStore && (
        <Modal
          isOpen={!!activeStore}
          onClose={handleCloseRatingModal}
          title={activeStore.myRating !== null ? 'Modify Rating' : 'Rate Store'}
          maxWidth="440px"
          footer={
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseRatingModal}
                disabled={isSubmittingRating}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmitRating}
                disabled={isSubmittingRating || selectedRating < 1 || selectedRating > 5}
              >
                {isSubmittingRating
                  ? 'Saving…'
                  : activeStore.myRating !== null
                    ? 'Update Rating'
                    : 'Submit Rating'}
              </button>
            </>
          }
        >
          <div className="rating-modal-body">
            <div className="rating-modal-store">{activeStore.name}</div>
            <p className="rating-modal-prompt">
              {activeStore.myRating !== null
                ? 'Update your rating from 1 to 5 stars.'
                : 'Select your rating from 1 to 5 stars.'}
            </p>

            <div className="rating-modal-stars">
              <RatingStars
                value={selectedRating}
                onChange={(val) => setSelectedRating(val)}
                size={38}
                showText={false}
              />
            </div>

            <div className="rating-modal-value">{selectedRating} of 5 stars</div>
            <span className="rating-modal-hint">Hover and click a star to set your rating</span>
          </div>
        </Modal>
      )}
    </div>
  );
};