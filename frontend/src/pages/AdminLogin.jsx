import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
            <div className="password-input-container">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input password-input"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="eye-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="eye-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
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
