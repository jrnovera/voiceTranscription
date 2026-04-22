import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNoteById, updateNote, deleteNote } from '../services/noteService';
import DOMPurify from 'dompurify';
import './NoteDetail.css';

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editText, setEditText] = useState('');
  const [copied, setCopied] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    async function fetchNote() {
      try {
        const data = await getNoteById(id);
        if (!data) {
          navigate('/notes');
          return;
        }
        setNote(data);
        setEditTitle(data.title || '');
        setEditText(data.text || '');
      } catch (err) {
        console.error('Error fetching note:', err);
        navigate('/notes');
      } finally {
        setLoading(false);
      }
    }
    fetchNote();
  }, [id, navigate]);

  async function handleSave() {
    try {
      setSaveLoading(true);
      const sanitizedTitle = DOMPurify.sanitize(editTitle.trim()) || 'Untitled Note';
      const sanitizedText = DOMPurify.sanitize(editText.trim());
      await updateNote(id, { title: sanitizedTitle, text: sanitizedText });
      setNote((prev) => ({ ...prev, title: sanitizedTitle, text: sanitizedText }));
      setEditing(false);
    } catch (err) {
      console.error('Error saving note:', err);
    } finally {
      setSaveLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await deleteNote(id);
      navigate('/notes');
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  }



  function handleCopy() {
    const content = `${note.title}\n\n${note.text}`;
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    const content = `${note.title}\n${'='.repeat(note.title.length)}\n\n${note.text}\n\nCreated: ${note.createdAt instanceof Date ? note.createdAt.toLocaleString() : 'Unknown'}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(note.title || 'note').replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="note-detail">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading note...</p>
        </div>
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="note-detail">
      <div className="note-detail-header">
        <button className="btn-back" onClick={() => navigate('/notes')}>
          ← Back to Notes
        </button>
        <div className="note-detail-actions">
          {!editing && (
            <>
              <button className="btn-action" onClick={() => setEditing(true)} title="Edit">
                ✏️ Edit
              </button>
              <button className="btn-action" onClick={handleCopy} title="Copy">
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
              <button className="btn-action" onClick={handleDownload} title="Download">
                ⬇️ Download
              </button>
              <button className="btn-action btn-danger" onClick={handleDelete} title="Delete">
                🗑️ Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="note-detail-card">
        {editing ? (
          <div className="note-edit-form">
            <input
              className="note-edit-title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Note title..."
              maxLength={100}
            />
            <textarea
              className="note-edit-textarea"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Note content..."
              rows={12}
            />
            <div className="note-edit-actions">
              <button className="btn-primary" onClick={handleSave} disabled={saveLoading}>
                {saveLoading ? 'Saving...' : '💾 Save Changes'}
              </button>
              <button className="btn-outline" onClick={() => {
                setEditing(false);
                setEditTitle(note.title);
                setEditText(note.text);
              }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="note-detail-title">{DOMPurify.sanitize(note.title)}</h1>
            <div className="note-detail-meta">
              <span>
                {note.createdAt instanceof Date
                  ? note.createdAt.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'No date'}
              </span>
              <span>•</span>
              <span>{(note.text || '').split(/\s+/).filter(Boolean).length} words</span>
            </div>

            <div className="note-detail-body">
              <p>{DOMPurify.sanitize(note.text)}</p>
            </div>


          </>
        )}
      </div>
    </div>
  );
}
