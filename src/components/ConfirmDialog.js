import React from 'react';
import './ConfirmDialog.css';

function ConfirmDialog({ note, onConfirm, onDiscard }) {
  return (
    <div className="overlay">
      <div className="dialog">
        <h2>Save this note?</h2>
        <div className="dialog-note">
          <p className="dialog-text">"{note.text}"</p>
          <span className="dialog-date">{note.date}</span>
        </div>
        <div className="dialog-actions">
          <button className="btn-confirm" onClick={onConfirm}>
            ✅ Yes, Save
          </button>
          <button className="btn-discard" onClick={onDiscard}>
            ❌ Discard
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
