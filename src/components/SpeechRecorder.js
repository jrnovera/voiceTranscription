import React, { useState, useRef, useEffect, useCallback } from 'react';
import './SpeechRecorder.css';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

function SpeechRecorder({ onResult }) {
  const [isListening, setIsListening] = useState(false);
  const [finalText, setFinalText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [supported, setSupported] = useState(true);

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false); // ref for use inside callbacks
  const finalTextRef = useRef('');      // ref so onresult always sees latest value

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
        // Append final words with a space separator
        const updated = (finalTextRef.current + ' ' + newFinal).trimStart();
        finalTextRef.current = updated;
        setFinalText(updated);
        setInterimText('');
      } else {
        setInterimText(interim);
      }
    };

    recognition.onerror = (e) => {
      // 'no-speech' is common and non-fatal — just restart
      if (e.error === 'no-speech') return;
      console.error('Speech error:', e.error);
      isListeningRef.current = false;
      setIsListening(false);
    };

    // Auto-restart when recognition ends mid-session (browser timeout)
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
    isListeningRef.current = true;
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch {
      // already running
    }
  };

  const handleDone = () => {
    stopRecognition();
    const result = (finalTextRef.current + ' ' + interimText).trim();
    if (result) {
      onResult(result);
      finalTextRef.current = '';
      setFinalText('');
      setInterimText('');
    }
  };

  const handleClear = () => {
    finalTextRef.current = '';
    setFinalText('');
    setInterimText('');
  };

  const displayText = (finalText + ' ' + interimText).trim();

  if (!supported) {
    return (
      <div className="recorder unsupported">
        Your browser does not support Speech Recognition. Try Chrome or Edge.
      </div>
    );
  }

  return (
    <div className="recorder">
      <div className={`mic-area ${isListening ? 'listening' : ''}`}>
        <button
          className={`mic-btn ${isListening ? 'active' : ''}`}
          onClick={isListening ? stopRecognition : startListening}
          title={isListening ? 'Stop recording' : 'Start recording'}
        >
          {isListening ? '⏹' : '🎙️'}
        </button>
        <span className="mic-label">
          {isListening ? 'Listening... click to stop' : 'Click to record'}
        </span>
      </div>

      {displayText && (
        <div className="transcript-box">
          <p className="transcript-text">
            <span className="final-text">{finalText}</span>
            {interimText && (
              <span className="interim-text"> {interimText}</span>
            )}
          </p>
          <div className="transcript-actions">
            <button className="btn-save" onClick={handleDone}>
              Done — Preview Note
            </button>
            <button className="btn-clear" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpeechRecorder;
