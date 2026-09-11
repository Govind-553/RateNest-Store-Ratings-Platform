import React, { useState } from 'react';
import { Eye, EyeOff, Check, X, ShieldCheck, AlertCircle } from 'lucide-react';
import { userService } from '../../services/userService';
import { useToast } from '../../context/ToastContext';

export const ChangePassword: React.FC = () => {
  const { showSuccess, showError } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMinMax = newPassword.length >= 8 && newPassword.length <= 16;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const isPasswordValid = hasMinMax && hasUppercase && hasSpecial;
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      setError(
        'New password must be 8-16 characters and contain an uppercase letter and a special character.',
      );
      return;
    }

    if (!passwordsMatch) {
      setError('Confirm password does not match new password.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await userService.updatePassword({
        currentPassword,
        newPassword,
      });
      showSuccess(res.message || 'Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const msg = err.message || 'Failed to update password. Verify your current password.';
      setError(msg);
      showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="settings-shell">
      <div className="page-header">
        <div className="page-title">
          <h1>Change Password</h1>
          <p>Keep your account secure with a strong and updated password</p>
        </div>
      </div>

      <div className="card">
        {error && (
          <div className="alert alert-error" role="alert">
            <AlertCircle size={16} className="alert-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="current-pw">
              Current Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="current-pw"
                type={showCurrent ? 'text' : 'password'}
                className="form-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowCurrent(!showCurrent)}
                aria-label={showCurrent ? 'Hide current password' : 'Show current password'}
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="new-pw">
              New Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="new-pw"
                type={showNew ? 'text' : 'password'}
                className="form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowNew(!showNew)}
                aria-label={showNew ? 'Hide new password' : 'Show new password'}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <ul className="criteria-list">
              <li className={`criteria-item ${hasMinMax ? 'met' : ''}`}>
                {hasMinMax ? <Check size={14} /> : <X size={14} />}
                8 to 16 characters
              </li>
              <li className={`criteria-item ${hasUppercase ? 'met' : ''}`}>
                {hasUppercase ? <Check size={14} /> : <X size={14} />}
                At least one uppercase letter
              </li>
              <li className={`criteria-item ${hasSpecial ? 'met' : ''}`}>
                {hasSpecial ? <Check size={14} /> : <X size={14} />}
                At least one special character
              </li>
            </ul>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirm-pw">
              Confirm New Password
            </label>
            <input
              id="confirm-pw"
              type="password"
              className={`form-input ${confirmPassword && !passwordsMatch ? 'error' : ''}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              autoComplete="new-password"
              required
            />
            {confirmPassword && !passwordsMatch && (
              <span className="form-error">Passwords do not match.</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            style={{ marginTop: '1rem' }}
            disabled={isSubmitting || !currentPassword || !isPasswordValid || !passwordsMatch}
          >
            {isSubmitting ? (
              <span>Updating password…</span>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>Update Password</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};