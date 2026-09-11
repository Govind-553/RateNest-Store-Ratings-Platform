import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Check, X, MapPin, Star, Store, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Logo } from '../../components/Logo';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        'Password must be 8-16 characters with at least one uppercase letter and one special character.',
      );
      return;
    }

    if (!isAddressValid) {
      setError('Address must be at most 400 characters.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        address: address.trim(),
        password,
      });
      showSuccess('Registration successful! Welcome to RateNest.');
      navigate('/stores', { replace: true });
    } catch (err: any) {
      const msg = err.message || 'Registration failed. Please check your details.';
      setError(msg);
      showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Brand / value proposition panel */}
      <div className="auth-panel">
        <div className="auth-panel-brand">
          <Logo size="lg" />

          <div className="auth-panel-headline">
            <h2>
              Your reviews, <span className="accent-word">your community</span>, your store
              map.
            </h2>
            <p>
              Join RateNest to discover local businesses, share honest 1–5 star feedback, and
              keep your reviews fresh whenever your experience changes.
            </p>
          </div>

          <ul className="auth-features">
            <li className="auth-feature">
              <span className="auth-feature-icon">
                <Star size={16} />
              </span>
              <div>
                <strong>Rate in seconds</strong>
                <span>Simple, accessible five-star ratings — update them anytime.</span>
              </div>
            </li>
            <li className="auth-feature">
              <span className="auth-feature-icon">
                <Store size={16} />
              </span>
              <div>
                <strong>Follow trusted stores</strong>
                <span>Browse verified storefronts with live community scores.</span>
              </div>
            </li>
            <li className="auth-feature">
              <span className="auth-feature-icon">
                <MapPin size={16} />
              </span>
              <div>
                <strong>Smart discovery</strong>
                <span>Search by name or address and explore what people recommend.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-form-side">
        <div>
          {/* Mobile brand */}
          <div className="auth-mobile-brand">
            <Logo size="md" />
          </div>

          <div className="auth-card auth-card-wide">
            <div className="auth-header">
              <Logo size="sm" showWordmark={false} />
              <h1>Create an account</h1>
              <p>Join to discover, browse, and review local stores</p>
            </div>

            {error && (
              <div className="alert alert-error" role="alert">
                <AlertCircle size={16} className="alert-icon" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="field-meta">
                  <label className="form-label" htmlFor="reg-name">
                    Full Name
                  </label>
                  <span
                    className={`field-count ${name ? (isNameValid ? 'ok' : '') : ''}`}
                  >
                    {name.length}/60 · min 20
                  </span>
                </div>
                <input
                  id="reg-name"
                  type="text"
                  className={`form-input ${name && !isNameValid ? 'error' : ''}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jonathan Alexander Sterling"
                  required
                />
                <span className="form-hint">Must be 20 to 60 characters.</span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">
                  Email Address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <div className="field-meta">
                  <label className="form-label" htmlFor="reg-address">
                    Address
                  </label>
                  <span className={`field-count ${address.length > 400 ? 'over' : ''}`}>
                    {address.length}/400 max
                  </span>
                </div>
                <textarea
                  id="reg-address"
                  className={`form-textarea ${address.length > 400 ? 'error' : ''}`}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 742 Evergreen Terrace, Springfield, OR"
                  rows={2}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
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

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isSubmitting || !isNameValid || !isPasswordValid || !isAddressValid}
              >
                {isSubmitting ? (
                  <span>Creating account…</span>
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>Create account</span>
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              Already have an account?{' '}
              <Link to="/login" style={{ fontWeight: 600 }}>
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};