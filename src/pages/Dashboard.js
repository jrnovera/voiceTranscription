import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserNotes, searchNotes } from '../services/noteService';
import DOMPurify from 'dompurify';
import './Dashboard.css';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const data = await getUserNotes(currentUser.uid);
        setNotes(data);
      } catch (err) {
        console.error('Error fetching notes:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, [currentUser.uid]);

  const filteredNotes = searchQuery ? searchNotes(notes, searchQuery) : notes;
  const recentNotes = filteredNotes.slice(0, 5);

  const thisWeek = notes.filter((n) => {
    const week = new Date();
    week.setDate(week.getDate() - 7);
    return n.createdAt >= week;
  }).length;

  const totalWords = notes.reduce((acc, n) => acc + (n.text || '').split(/\s+/).filter(Boolean).length, 0);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div>
          <h1>{greeting()}, {currentUser.displayName || 'there'}! 👋</h1>
          <p className="dash-subtitle">Here's your notes overview</p>
        </div>
        <Link to="/record" className="btn-record-fab">
          <span>🎙️</span> New Recording
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <span className="stat-value">{notes.length}</span>
            <span className="stat-label">Total Notes</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <span className="stat-value">{thisWeek}</span>
            <span className="stat-label">This Week</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-info">
            <span className="stat-value">{totalWords.toLocaleString()}</span>
            <span className="stat-label">Total Words</span>
          </div>
        </div>
      </div>

      <div className="dash-search">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search your notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(DOMPurify.sanitize(e.target.value))}
          id="dashboard-search"
        />
      </div>

      <div className="recent-section">
        <div className="section-header">
          <h2>Recent Notes</h2>
          <Link to="/notes" className="view-all">View all →</Link>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading notes...</p>
          </div>
        ) : recentNotes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎙️</div>
            <h3>No notes yet</h3>
            <p>Record your first voice note to get started!</p>
            <Link to="/record" className="btn-primary">Start Recording</Link>
          </div>
        ) : (
          <div className="notes-grid">
            {recentNotes.map((note) => (
              <Link key={note.id} to={`/notes/${note.id}`} className="note-preview-card">
                <h3 className="note-preview-title">{DOMPurify.sanitize(note.title)}</h3>
                <p className="note-preview-text">
                  {DOMPurify.sanitize((note.text || '').substring(0, 120))}
                  {(note.text || '').length > 120 ? '...' : ''}
                </p>
                <div className="note-preview-meta">
                  <span className="note-preview-date">
                    {note.createdAt instanceof Date
                      ? note.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : 'No date'}
                  </span>
                  <span className="note-preview-words">
                    {(note.text || '').split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
