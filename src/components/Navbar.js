import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, FileText, Mic, User, Shield } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { currentUser, userRole, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!currentUser) return null;

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to sign out?')) return;
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/notes', label: 'Notes', icon: <FileText size={20} /> },
    { to: '/record', label: 'Record', icon: <Mic size={20} /> },
    { to: '/profile', label: 'Profile', icon: <User size={20} /> },
  ];

  if (userRole === 'admin') {
    navLinks.push({ to: '/admin', label: 'Admin', icon: <Shield size={20} /> });
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-icon"><Mic size={24} /></span>
          <span className="brand-text">VoiceNotes</span>
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
