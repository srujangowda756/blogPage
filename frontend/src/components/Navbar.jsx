import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { clearAuth, isAuthenticated } from '../api';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = isAuthenticated();

  function handleAuthAction() {
    if (authenticated) {
      clearAuth();
      navigate('/login');
      return;
    }

    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">✦</span>
          <span className="brand-name">BlogSpace</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/create" className={`nav-link ${location.pathname === '/create' ? 'active' : ''}`}>
            Write
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className="btn-new" onClick={() => navigate('/create')}>
            <span>+</span> New Post
          </button>
          <button className="btn-ghost" onClick={handleAuthAction}>
            {authenticated ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>
    </nav>
  );
}
