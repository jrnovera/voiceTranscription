import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mic, Search, Shield, Copy, Zap } from 'lucide-react';
import './Landing.css';

export default function Landing() {
  const { currentUser } = useAuth();

  const features = [
    {
      icon: <Mic size={32} />,
      title: 'Voice-to-Text',
      desc: 'Record your thoughts instantly with real-time speech recognition. No typing needed.'
    },
    {
      icon: <Search size={32} />,
      title: 'Smart Search',
      desc: 'Find any note in seconds with powerful full-text search across all your content.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Secure & Private',
      desc: 'Your notes are encrypted and stored securely with Firebase. Only you can access them.'
    },
    {
      icon: <Copy size={32} />,
      title: 'Copy & Download',
      desc: 'Export your notes anytime — copy to clipboard or download as text files with one click.'
    },
    {
      icon: <Zap size={32} />,
      title: 'Lightning Fast',
      desc: 'Built for speed with real-time sync. Your notes are always up to date across devices.'
    }
  ];

  return (
    <div className="landing">
      <div className="landing-glow landing-glow-1"></div>
      <div className="landing-glow landing-glow-2"></div>

      <header className="landing-header">
        <Link to="/" className="landing-brand">
          <span className="landing-brand-icon" style={{ display: 'flex', alignItems: 'center' }}><Mic size={28} /></span>
          <span>Voice Transcription</span>
        </Link>
        <div className="landing-header-actions">
          {currentUser ? (
            <Link to="/dashboard" className="btn-primary">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Sign In</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </header>

      <section className="hero">
        <div className="hero-badge"><Zap size={14} style={{marginRight: '6px'}}/> Instant Transcription</div>
        <h1 className="hero-title">
          Your Voice.<br />
          <span className="gradient-text">Your Notes.</span><br />
          Instantly.
        </h1>
        <p className="hero-subtitle">
          Record, transcribe, and organize your thoughts with high-accuracy voice recognition.
          Never lose an idea again.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn-primary btn-lg">
            Start Free →
          </Link>
          <Link to="/login" className="btn-outline btn-lg">
            Sign In
          </Link>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">50+</span>
            <span className="stat-label">Languages</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-number">99%</span>
            <span className="stat-label">Accuracy</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-number">∞</span>
            <span className="stat-label">Notes</span>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Everything you need</h2>
        <p className="section-subtitle">Powerful features to capture and organize your thoughts</p>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-card">
          <h2>Ready to capture your ideas?</h2>
          <p>Join now and start recording your first voice note in seconds.</p>
          <Link to="/register" className="btn-primary btn-lg">
            Get Started — It's Free
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2026 Voice Transcription. Built with ❤️.</p>
      </footer>
    </div>
  );
}
