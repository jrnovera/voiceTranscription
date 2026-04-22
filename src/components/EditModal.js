import React, { useState } from 'react';
import './EditModal.css';

function EditModal({ note, onSave, onClose }) {
  const [text, setText] = useState(note.text);

  const handleSave = () => {
    if (text.trim()) {
      onSave(note.id, text.trim());
    }
  };

  return (
    <div className="overlay">
      <div className="edit-modal">
        <h2>Edit Note</h2>
        <textarea
          className="edit-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          autoFocus
        />
        <div className="edit-actions">
          <button className="btn-confirm" onClick={handleSave}>
            💾 Save Changes
          </button>
          <button className="btn-discard" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
