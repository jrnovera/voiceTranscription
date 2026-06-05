import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserNotes, searchNotes, deleteNote } from '../services/noteService';
import DOMPurify from 'dompurify';
import { Mic, Search, FileText, Copy, Download, Trash2 } from 'lucide-react';
import './Notes.css';

export default function Notes() {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line
  }, [currentUser.uid]);

  async function fetchNotes() {
    try {
      setLoading(true);
      const data = await getUserNotes(currentUser.uid);
      setNotes(data);
    } catch (err) {
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  }

  const filtered = searchQuery ? searchNotes(notes, searchQuery) : notes;
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'oldest') return a.createdAt - b.createdAt;
    if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
    return b.createdAt - a.createdAt;
  });

  return (
    <div className="notes-page">
      <div className="notes-page-header">
        <h1>Your Notes</h1>
        <Link to="/record" className="btn-primary" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Mic size={18} /> New Recording
        </Link>
      </div>

      <div className="notes-toolbar">
        <div className="notes-search">
          <span className="search-icon"><Search size={20} /></span>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(DOMPurify.sanitize(e.target.value))}
            id="notes-search"
          />
        </div>
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          id="notes-sort"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title">By title</option>
        </select>
      </div>

      <p className="notes-count">
        {sorted.length} {sorted.length === 1 ? 'note' : 'notes'}
        {searchQuery && ` matching "${searchQuery}"`}
      </p>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading notes...</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><FileText size={48} opacity={0.5} /></div>
          <h3>{searchQuery ? 'No notes found' : 'No notes yet'}</h3>
          <p>{searchQuery ? 'Try a different search term.' : 'Record your first voice note!'}</p>
          {!searchQuery && <Link to="/record" className="btn-primary">Start Recording</Link>}
        </div>
      ) : (
        <div className="notes-list-full">
          {sorted.map((note) => (
            <div key={note.id} className="note-list-item">
              <Link to={`/notes/${note.id}`} className="note-list-content">
                <h3>{DOMPurify.sanitize(note.title)}</h3>
                <p className="note-list-text">
                  {DOMPurify.sanitize((note.text || '').substring(0, 200))}
                  {(note.text || '').length > 200 ? '...' : ''}
                </p>
                <div className="note-list-meta">
                  <span>
                    {note.createdAt instanceof Date
                      ? note.createdAt.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : 'No date'}
                  </span>
                  <span>•</span>
                  <span>{(note.text || '').split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </Link>
              <button
                className="note-list-delete"
                onClick={(e) => {
                  e.preventDefault();
                  const content = `${note.title}\n\n${note.text}`;
                  navigator.clipboard.writeText(content).then(() => {
                    // Optional tiny UX: user knows it copied, alert is simple
                    alert('Copied to clipboard!');
                  });
                }}
                title="Copy note"
                style={{ borderRadius: 0, padding: '0 12px', display: 'flex', alignItems: 'center' }}
              >
                <Copy size={16} />
              </button>
              <button
                className="note-list-delete"
                onClick={(e) => {
                  e.preventDefault();
                  const content = `${note.title}\n${'='.repeat((note.title || 'Note').length)}\n\n${note.text}\n\nCreated: ${note.createdAt instanceof Date ? note.createdAt.toLocaleString() : 'Unknown'}`;
                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${(note.title || 'note').replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                title="Download note"
                style={{ borderRadius: 0, padding: '0 12px', display: 'flex', alignItems: 'center' }}
              >
                <Download size={16} />
              </button>
              <button
                className="note-list-delete"
                onClick={(e) => { e.preventDefault(); handleDelete(note.id); }}
                title="Delete note"
                style={{ padding: '0 12px', display: 'flex', alignItems: 'center' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
