import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { currentUser, userRole, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!currentUser) return null;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/notes', label: 'Notes', icon: '📝' },
    { to: '/record', label: 'Record', icon: '🎙️' },
    { to: '/profile', label: 'Profile', icon: '👤' },
  ];

  if (userRole === 'admin') {
    navLinks.push({ to: '/admin', label: 'Admin', icon: '🛡️' });
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-icon">🎙️</span>
          <span className="brand-text">Voice Transcription</span>
        </Link>

        <button
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}
          <button className="nav-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
