import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { User } from '../../types';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';

interface CreateStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoreCreated: () => void;
}

export const CreateStoreModal: React.FC<CreateStoreModalProps> = ({
  isOpen,
  onClose,
  onStoreCreated,
}) => {
  const { showSuccess, showError } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [storeOwners, setStoreOwners] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Fetch available store owners for dropdown
      adminService
        .getUsers({ role: 'STORE_OWNER', limit: 50 })
        .then((res) => setStoreOwners(res.items))
        .catch(console.error);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Store name is required.');
      return;
    }

    if (!email.trim()) {
      setError('Store email is required.');
      return;
    }

    if (!address.trim() || address.length > 400) {
      setError('Address is required and must not exceed 400 characters.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await adminService.createStore({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        address: address.trim(),
        ownerId: ownerId || undefined,
      });

      showSuccess(`Store "${name}" created successfully!`);
      setName('');
      setEmail('');
      setAddress('');
      setOwnerId('');
      onClose();
      onStoreCreated();
    } catch (err: any) {
      const msg = err.message || 'Failed to create store.';
      setError(msg);
      showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Store" maxWidth="540px">
      {error && (
        <div className="alert alert-error" role="alert">
          <AlertCircle size={16} className="alert-icon" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Store Name</label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Blue Bottle Specialty Roasters"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Store Email</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. contact@store.com"
            required
          />
        </div>

        <div className="form-group">
          <div className="field-meta">
            <label className="form-label">Store Address</label>
            <span className={`field-count ${address.length > 400 ? 'over' : ''}`}>
              {address.length}/400 max
            </span>
          </div>
          <textarea
            className={`form-textarea ${address.length > 400 ? 'error' : ''}`}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 500 Broadway Avenue, New York, NY 10012"
            rows={2}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Assigned Store Owner (Optional)</label>
          <select className="form-select" value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
            <option value="">-- No Owner (Unassigned) --</option>
            {storeOwners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name} ({owner.email})
              </option>
            ))}
          </select>
          <span className="form-hint">Only users with the STORE_OWNER role can be assigned.</span>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !name || !email || !address || address.length > 400}
          >
            {isSubmitting ? 'Creating…' : 'Create Store'}
          </button>
        </div>
      </form>
    </Modal>
  );
};