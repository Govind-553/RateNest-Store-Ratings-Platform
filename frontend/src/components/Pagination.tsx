import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (newPage: number) => void;
}

const getPageItems = (page: number, totalPages: number): (number | '…')[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: (number | '…')[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) items.push('…');
  for (let i = start; i <= end; i += 1) items.push(i);
  if (end < totalPages - 1) items.push('…');

  items.push(totalPages);
  return items;
};

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}) => {
  if (total === 0) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const safeTotalPages = Math.max(totalPages, 1);
  const pageItems = getPageItems(page, safeTotalPages);

  return (
    <div className="pagination">
      <span className="pagination-info">
        Showing <strong>{start}</strong>–<strong>{end}</strong> of <strong>{total}</strong> results
      </span>
      <div className="pagination-controls">
        <button
          className="page-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {pageItems.map((item, idx) =>
          item === '…' ? (
            <span key={`ellipsis-${idx}`} className="page-btn" style={{ borderColor: 'transparent', cursor: 'default', color: 'var(--color-text-muted)' }} aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={item}
              className={`page-btn ${item === page ? 'page-btn-active' : ''}`}
              onClick={() => onPageChange(item)}
              aria-label={`Page ${item}`}
              aria-current={item === page ? 'page' : undefined}
            >
              {item}
            </button>
          ),
        )}

        <button
          className="page-btn"
          disabled={page >= safeTotalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};