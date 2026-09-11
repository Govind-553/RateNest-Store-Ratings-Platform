import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn, ShieldCheck, Star, Users, Store, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Logo } from '../../components/Logo';

export const Login: React.FC = () => {
  const { login, getDefaultRoute } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const loggedInUser = await login(email, password);
      showSuccess(`Welcome back, ${loggedInUser.name}!`);
      const targetPath = from || getDefaultRoute(loggedInUser.role);
      navigate(targetPath, { replace: true });
    } catch (err: any) {
      const msg = err.message || 'Invalid email or password.';
      setError(msg);
      showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const setDemoCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password@123');
    setError(null);
  };

  return (
    <div className="auth-page">
      {/* Brand / value proposition panel */}
      <div className="auth-panel">
        <div className="auth-panel-brand">
          <Logo size="lg" />

          <div className="auth-panel-headline">
            <h2>
              Store intelligence, <span className="accent-word">powered by community</span>{' '}
              reviews.
            </h2>
            <p>
              RateNest brings every local store, its rating, and your voice together in one
              polished, real-time platform.
            </p>
          </div>

          <ul className="auth-features">
            <li className="auth-feature">
              <span className="auth-feature-icon">
                <Star size={16} />
              </span>
              <div>
                <strong>Transparent ratings</strong>
                <span>Submit and refine your own 1–5 star reviews anytime.</span>
              </div>
            </li>
            <li className="auth-feature">
              <span className="auth-feature-icon">
                <Store size={16} />
              </span>
              <div>
                <strong>Curated store directory</strong>
                <span>Search, filter and compare local storefronts by reputation.</span>
              </div>
            </li>
            <li className="auth-feature">
              <span className="auth-feature-icon">
                <ShieldCheck size={16} />
              </span>
              <div>
                <strong>Role-aware experiences</strong>
                <span>Seamless dashboards for administrators, owners and reviewers.</span>
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

          <div className="auth-card">
            <div className="auth-header">
              <Logo size="sm" showWordmark={false} />
              <h1>Welcome back</h1>
              <p>Sign in to access your dashboard and stores</p>
            </div>

            {/* Quick Demo Credentials */}
            <div className="demo-accounts-box">
              <div className="demo-title">
                <span aria-hidden="true">✦</span> Quick demo accounts
              </div>
              <div className="demo-buttons-grid">
                <button
                  type="button"
                  className="demo-pill"
                  onClick={() => setDemoCredentials('admin@storerating.com')}
                >
                  <span className="demo-role-tag" style={{ color: 'var(--color-danger)' }}>
                    <ShieldCheck size={12} /> Admin
                  </span>
                  <span className="demo-pill-email">admin@storerating.com</span>
                </button>
                <button
                  type="button"
                  className="demo-pill"
                  onClick={() => setDemoCredentials('user.alexander@storerating.com')}
                >
                  <span className="demo-role-tag" style={{ color: 'var(--color-info)' }}>
                    <Users size={12} /> Normal User
                  </span>
                  <span className="demo-pill-email">user.alexander…</span>
                </button>
                <button
                  type="button"
                  className="demo-pill"
                  onClick={() => setDemoCredentials('owner.organic@storerating.com')}
                >
                  <span className="demo-role-tag" style={{ color: 'var(--color-warning)' }}>
                    <Store size={12} /> Store Owner
                  </span>
                  <span className="demo-pill-email">owner.organic…</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-error" role="alert">
                <AlertCircle size={16} className="alert-icon" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
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
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Signing in…</span>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Sign in</span>
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              Don't have an account?{' '}
              <Link to="/register" style={{ fontWeight: 600 }}>
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};