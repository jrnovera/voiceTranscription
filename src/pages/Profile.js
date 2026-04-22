import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const { currentUser, userRole, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSave(e) {
    e.preventDefault();
    if (!displayName.trim()) return;
    try {
      setSaving(true);
      await updateUserProfile({ displayName: displayName.trim() });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  }

  return (
    <div className="profile-page">
      <h1>Profile</h1>

      <div className="profile-card">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {(currentUser?.displayName || currentUser?.email || '?')[0].toUpperCase()}
          </div>
          <div className="profile-info">
            <h2>{currentUser?.displayName || 'User'}</h2>
            <p className="profile-email">{currentUser?.email}</p>
            <span className="profile-role">{userRole === 'admin' ? '🛡️ Admin' : '👤 User'}</span>
          </div>
        </div>

        {message && (
          <div className={`profile-message ${message.includes('Failed') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="profile-form">
          <div className="form-group">
            <label htmlFor="profile-name">Display Name</label>
            <input
              id="profile-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={50}
            />
          </div>
          <div className="form-group">
            <label htmlFor="profile-email">Email</label>
            <input
              id="profile-email"
              type="email"
              value={currentUser?.email || ''}
              disabled
            />
            <span className="form-hint">Email cannot be changed</span>
          </div>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="profile-card danger-zone">
        <h3>Account</h3>
        <p>Sign out of your account on this device.</p>
        <button className="btn-logout" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
