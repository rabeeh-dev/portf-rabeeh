import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PillNavbar.css';

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'content', label: 'Content' },
  { id: 'projects', label: 'Projects' },
  { id: 'services', label: 'Services' },
  { id: 'testimonials', label: 'Testimonials' },
];

export default function AdminPillNav({ active, onTabChange, onLogout }) {
  const [open, setOpen] = useState(false);

  const select = (id) => {
    onTabChange(id);
    setOpen(false);
  };

  return (
    <header className="pill-nav-wrap admin-pill-nav-wrap">
      <div className="pill-nav pill-nav--admin">
        <Link to="/" className="pill-nav-logo" title="View portfolio">
          <div className="pill-nav-logo-circle">
            <span className="pill-nav-logo-letter">R</span>
          </div>
        </Link>

        <ul className="pill-nav-links">
          {TABS.map((tab) => (
            <li key={tab.id}>
              <button
                type="button"
                className={active === tab.id ? 'active' : ''}
                onClick={() => select(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="pill-nav-actions">
          <button type="button" className="pill-nav-ghost admin-logout-btn" onClick={onLogout}>
            Logout
          </button>
          <button
            type="button"
            className="pill-nav-toggle"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={`pill-nav-mobile ${open ? 'open' : ''}`}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={active === tab.id ? 'active' : ''}
            onClick={() => select(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        <button type="button" onClick={onLogout}>Logout</button>
        <Link to="/" onClick={() => setOpen(false)}>View Portfolio</Link>
      </div>
    </header>
  );
}
