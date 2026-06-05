import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addNote } from '../services/noteService';
import DOMPurify from 'dompurify';
import { Mic, Square, Tag, Save, AlertTriangle } from 'lucide-react';
import './Recording.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function Recording() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [finalText, setFinalText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [title, setTitle] = useState('');
  const [supported, setSupported] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const finalTextRef = useRef('');

  const stopRecognition = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  useEffect(() => {
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interim = '';
      let newFinal = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          newFinal += text;
        } else {
          interim += text;
        }
      }

      if (newFinal) {
        const updated = (finalTextRef.current + ' ' + newFinal).trimStart();
        finalTextRef.current = updated;
        setFinalText(updated);
        setInterimText('');
      } else {
        setInterimText(interim);
      }
    };

    recognition.onerror = (e) => {
      if (e.error === 'no-speech') return;
      console.error('Speech error:', e.error);
      isListeningRef.current = false;
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        try {
          recognition.start();
        } catch {
          // already started
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    finalTextRef.current = '';
    setFinalText('');
    setInterimText('');
    setError('');
    isListeningRef.current = true;
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch {
      // already running
    }
  };

  const handleClear = () => {
    stopRecognition();
    finalTextRef.current = '';
    setFinalText('');
    setInterimText('');
  };

  const handleSave = async () => {
    stopRecognition();
    const text = (finalTextRef.current + ' ' + interimText).trim();
    if (!text) {
      setError('No speech content to save. Please record something first.');
      return;
    }
    try {
      setSaving(true);
      const sanitizedTitle = DOMPurify.sanitize(title.trim()) || `Voice Note - ${new Date().toLocaleDateString()}`;
      const sanitizedText = DOMPurify.sanitize(text);
      const noteId = await addNote(currentUser.uid, {
        title: sanitizedTitle,
        text: sanitizedText
      });
      navigate(`/notes/${noteId}`);
    } catch (err) {
      console.error('Error saving note:', err);
      setError('Failed to save note. Please try again.');
      setSaving(false);
    }
  };

  const displayText = (finalText + ' ' + interimText).trim();
  const wordCount = displayText ? displayText.split(/\s+/).filter(Boolean).length : 0;

  if (!supported) {
    return (
      <div className="recording-page">
        <div className="unsupported-msg">
          <div className="unsupported-icon"><AlertTriangle size={36} /></div>
          <h2>Browser Not Supported</h2>
          <p>Speech Recognition requires Chrome or Edge. Please switch browsers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recording-page">
      <div className="recording-header">
        <h1>Voice Recording</h1>
        <p className="recording-subtitle">Click the microphone to start recording your voice note</p>
      </div>

      <div className="recording-card">
        <div className="title-input-area">
          <label htmlFor="recording-title" className="input-label" style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
            <Tag size={16} /> Title of this recording
          </label>
          <input
            type="text"
            className="title-input"
            placeholder="Give your note a name for easy searching..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            id="recording-title"
          />
        </div>

        <div className={`mic-area ${isListening ? 'listening' : ''}`}>
          <div className="mic-rings">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-3"></div>
          </div>
          <button
            className={`mic-btn-large ${isListening ? 'active' : ''}`}
            onClick={isListening ? stopRecognition : startListening}
            title={isListening ? 'Stop recording' : 'Start recording'}
            id="mic-button"
            style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
          >
            {isListening ? <Square size={32} /> : <Mic size={32} />}
          </button>
          <span className="mic-status">
            {isListening ? (
              <span className="status-active">
                <span className="pulse-dot"></span> Listening...
              </span>
            ) : (
              'Tap to record'
            )}
          </span>
        </div>

        {displayText && (
          <div className="transcript-area">
            <div className="transcript-header">
              <h3>Transcript</h3>
              <span className="word-count">{wordCount} words</span>
            </div>
            <div className="transcript-content">
              <span className="final">{finalText}</span>
              {interimText && <span className="interim"> {interimText}</span>}
            </div>
          </div>
        )}

        {error && <div className="recording-error">{error}</div>}

        <div className="recording-actions">
          <button
            className="btn-primary btn-lg"
            onClick={handleSave}
            disabled={saving || !displayText}
            style={{display: 'flex', alignItems: 'center', gap: '8px'}}
          >
            {saving ? 'Saving...' : <><Save size={18} /> Save Note</>}
          </button>
          <button
            className="btn-outline"
            onClick={handleClear}
            disabled={saving || !displayText}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
