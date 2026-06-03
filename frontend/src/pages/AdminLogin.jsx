import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  if (isAuthenticated) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      if (!err.response) {
        setError(
          'Cannot reach the API. Start the backend (npm run dev in backend/) and ensure it runs on port 5001.'
        );
      } else {
        setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Decorative background */}
      <div className="login-bg">
        <div className="login-orb orb1" />
        <div className="login-orb orb2" />
        <div className="login-orb orb3" />
        <div className="login-grid-bg" />
      </div>

      <div className="login-card">
        {/* Brand */}
        <div className="login-brand">
          <span className="login-logo">r<span className="dot">.</span></span>
          <span className="login-brand-name">rabeeh</span>
        </div>

        {/* Header */}
        <h1 className="login-title">
          Admin <span className="accent">Portal</span>
        </h1>
        <p className="login-subtitle">
          Access the management dashboard to control your portfolio content.
        </p>

        {/* Error */}
        {error && (
          <div className="login-error">
            <span className="login-error-icon">⚠</span>
            {error}
          </div>
        )}

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              autoComplete="email"
            />
          </div>
          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn-primary login-btn" disabled={loading}>
            {loading ? (
              <span className="login-spinner" />
            ) : (
              'Access Dashboard →'
            )}
          </button>
        </form>

        {/* Footer link */}
        <div className="login-footer-link">
          <Link to="/">← Back to Portfolio</Link>
        </div>
      </div>

      {/* Page footer */}
      <div className="login-page-footer">
        © {new Date().getFullYear()} rabeeh — ENCRYPTED PORTAL
      </div>
    </div>
  );
}
