import React, { useState } from 'react';
import { Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react';
import type { Role } from '../../types';
import { adminService } from '../../services/adminService';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onUserCreated,
}) => {
  const { showSuccess, showError } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('USER');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Criteria calculations
  const hasMinMax = password.length >= 8 && password.length <= 16;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isPasswordValid = hasMinMax && hasUppercase && hasSpecial;
  const isNameValid = name.trim().length >= 20 && name.trim().length <= 60;
  const isAddressValid = address.trim().length > 0 && address.trim().length <= 400;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isNameValid) {
      setError('Name must be between 20 and 60 characters.');
      return;
    }

    if (!isPasswordValid) {
      setError(
        'Password must be 8-16 characters and contain at least one uppercase letter and one special character.',
      );
      return;
    }

    if (!isAddressValid) {
      setError('Address must not exceed 400 characters.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await adminService.createUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        address: address.trim(),
        password,
        role,
      });

      showSuccess(`User created successfully (${role})!`);
      setName('');
      setEmail('');
      setAddress('');
      setPassword('');
      setRole('USER');
      onClose();
      onUserCreated();
    } catch (err: any) {
      const msg = err.message || 'Failed to create user.';
      setError(msg);
      showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New User Account" maxWidth="540px">
      {error && (
        <div className="alert alert-error" role="alert">
          <AlertCircle size={16} className="alert-icon" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="field-meta">
            <label className="form-label">Full Name</label>
            <span className={`field-count ${name ? (isNameValid ? 'ok' : '') : ''}`}>
              {name.length}/60 · min 20
            </span>
          </div>
          <input
            type="text"
            className={`form-input ${name && !isNameValid ? 'error' : ''}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Benjamin Franklin Cooper"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. user@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Account Role</label>
          <select className="form-select" value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="USER">Normal User (USER)</option>
            <option value="STORE_OWNER">Store Owner (STORE_OWNER)</option>
            <option value="ADMIN">Administrator (ADMIN)</option>
          </select>
        </div>

        <div className="form-group">
          <div className="field-meta">
            <label className="form-label">Address</label>
            <span className={`field-count ${address.length > 400 ? 'over' : ''}`}>
              {address.length}/400 max
            </span>
          </div>
          <textarea
            className={`form-textarea ${address.length > 400 ? 'error' : ''}`}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 100 Main Street, Suite 400, Chicago, IL"
            rows={2}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Initial Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Assign a temporary password"
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <ul className="criteria-list">
            <li className={`criteria-item ${hasMinMax ? 'met' : ''}`}>
              {hasMinMax ? <Check size={14} /> : <X size={14} />} 8 to 16 characters
            </li>
            <li className={`criteria-item ${hasUppercase ? 'met' : ''}`}>
              {hasUppercase ? <Check size={14} /> : <X size={14} />} At least one uppercase letter
            </li>
            <li className={`criteria-item ${hasSpecial ? 'met' : ''}`}>
              {hasSpecial ? <Check size={14} /> : <X size={14} />} At least one special character
            </li>
          </ul>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !isNameValid || !isPasswordValid || !isAddressValid}
          >
            {isSubmitting ? 'Creating…' : 'Create User'}
          </button>
        </div>
      </form>
    </Modal>
  );
};