import React from 'react';
import './NotesList.css';

function NotesList({ notes, onDelete, onEdit }) {
  if (notes.length === 0) {
    return (
      <div className="notes-empty">
        <p>No notes yet. Record your first voice note above!</p>
      </div>
    );
  }

  return (
    <section className="notes-section">
      <h2>Saved Notes ({notes.length})</h2>
      <ul className="notes-list">
        {notes.map((note) => (
          <li key={note.id} className="note-card">
            <div className="note-content">
              <p className="note-text">{note.text}</p>
              <span className="note-date">{note.date}</span>
            </div>
            <div className="note-actions">
              <button
                className="btn-edit"
                onClick={() => onEdit(note)}
                title="Edit note"
              >
                ✏️
              </button>
              <button
                className="btn-delete"
                onClick={() => onDelete(note.id)}
                title="Delete note"
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default NotesList;
