import React, { useState } from 'react';
import './index.css';
import Platform from './components/Platform';
import ContributionForm from './components/ContributionForm';
import AdminPanel from './components/AdminPanel';
import BlogSection from './components/BlogSection';

import { adminLogin } from './services/apiService';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'platform' | 'contribute' | 'admin' | 'admin-auth' | 'blog'>('landing');
  const [selectedLevel, setSelectedLevel] = useState<string>('junior');
  const [logoClicks, setLogoClicks] = useState(0);
  const [adminPass, setAdminPass] = useState('');
  const [error, setError] = useState('');
  const startChallenge = (level: string) => {
    setSelectedLevel(level);
    setView('platform');
  };

  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    if (newCount === 5) {
      setView('admin-auth');
      setLogoClicks(0);
    } else {
      setLogoClicks(newCount);
      // Reset if they wait too long (3s)
      setTimeout(() => setLogoClicks(0), 3000);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await adminLogin(adminPass);
    if (result.success) {
      setView('admin');
      setError('');
    } else {
      setError('Invalid passcode');
    }
  };

  if (view === 'admin-auth') {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass animate-fade-in" style={{ padding: '40px', width: '400px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '20px' }}>Admin Entrance</h2>
          <form onSubmit={handleAdminLogin}>
            <input
              type="password"
              autoFocus
              className="glass"
              placeholder="Passcode..."
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              style={{ width: '100%', padding: '12px', marginBottom: '15px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', textAlign: 'center' }}
            />
            {error && <p style={{ color: '#ef4444', marginBottom: '15px' }}>{error}</p>}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setView('landing')} style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ flex: 2 }}>Enter</button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (view === 'admin') {
    return (
      <div className="app-container">
        <nav className="glass" style={{ margin: '20px', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} onClick={() => setView('landing')}>
            TechQuest
          </div>
          <div style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Admin Control</div>
        </nav>
        <AdminPanel onBack={() => setView('landing')} />
      </div>
    );
  }

  if (view === 'blog') {
    return (
      <div className="app-container">
        <nav className="glass" style={{ margin: '20px', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} onClick={() => setView('landing')}>
            TechQuest
          </div>
          <button onClick={() => setView('landing')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Back Home</button>
        </nav>
        <BlogSection onBack={() => setView('landing')} />
      </div>
    );
  }

  if (view === 'contribute') {
    return (
      <div className="app-container">
        <nav className="glass" style={{ margin: '20px', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} onClick={() => setView('landing')}>
            TechQuest
          </div>
        </nav>
        <ContributionForm onBack={() => setView('landing')} />
      </div>
    );
  }

  if (view === 'platform') {
    return (
      <div className="app-container">
        <nav className="glass" style={{ margin: '20px', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} onClick={() => setView('landing')}>
            TechQuest
          </div>
          <div style={{ color: 'var(--text-muted)' }}>Session: Java {selectedLevel.toUpperCase()}</div>
        </nav>
        <Platform level={selectedLevel} onExit={() => setView('landing')} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <nav className="glass" style={{ margin: '20px', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{ cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          onClick={handleLogoClick}
        >
          TechQuest
        </div>
        <div style={{ display: 'flex', gap: '30px', fontWeight: '500' }}>
          <button onClick={() => setView('landing')} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '1rem' }}>Home</button>
          <button onClick={() => setView('contribute')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>Contribute</button>
          <button onClick={() => setView('blog')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem' }}>Blog</button>
        </div>
      </nav>

      <main className="animate-fade-in" style={{ padding: '80px 40px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '80vh' }}>
        <div style={{ marginBottom: '24px', display: 'flex', gap: '10px' }}>
          <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '6px 16px' }}>VERSION 2.0 LIVE</span>
          <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.1)', color: 'var(--secondary)', padding: '6px 16px' }}>60+ REAL CHALLENGES</span>
        </div>
        <h1 style={{ marginBottom: '30px', maxWidth: '900px' }}>Master the Real-World <br /> Engineering Interview</h1>
        <p style={{ maxWidth: '650px', marginBottom: '50px', fontSize: '1.25rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
          Step away from theory. Practice with high-fidelity technical scenarios, deep architectural refactoring, and AI-driven conceptual evaluation.
        </p>

        <div style={{ display: 'flex', gap: '20px' }}>
          <button className="btn-primary" onClick={() => document.getElementById('levels')?.scrollIntoView({ behavior: 'smooth' })}>
            Access Path  <span>→</span>
          </button>
          <button className="glass glass-hover" style={{ padding: '14px 28px', color: 'white', border: '1px solid var(--glass-border)', cursor: 'pointer', fontWeight: '600' }} onClick={() => setView('blog')}>
            Read the Blog
          </button>
        </div>
      </main>

      <section id="levels" style={{ padding: '100px 40px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
        <div className="glass glass-hover" style={{ padding: '50px 40px', textAlign: 'left', transition: 'all 0.4s' }}>
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>🌱</div>
          <h3 style={{ marginBottom: '15px', color: '#6366f1', fontSize: '1.5rem', fontWeight: '800' }}>JAVA JUNIOR</h3>
          <p style={{ fontSize: '1rem', marginBottom: '30px', color: 'var(--text-muted)' }}>Core mastery: OOP patterns, Collections API, and Java 8+ features through practical puzzles.</p>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => startChallenge('junior')}>Start Level</button>
        </div>

        <div className="glass glass-hover" style={{ padding: '50px 40px', textAlign: 'left', border: '1px solid var(--primary)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '15px', right: '-35px', background: 'var(--primary)', color: 'white', padding: '5px 40px', transform: 'rotate(45deg)', fontSize: '0.75rem', fontWeight: 'bold' }}>POPULAR</div>
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>⚡</div>
          <h3 style={{ marginBottom: '15px', color: '#a855f7', fontSize: '1.5rem', fontWeight: '800' }}>INTERMEDIATE</h3>
          <p style={{ fontSize: '1rem', marginBottom: '30px', color: 'var(--text-muted)' }}>Systems thinking: Spring Boot internals, Hibernate tuning, and defensive coding patterns.</p>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => startChallenge('intermediate')}>Start Level</button>
        </div>

        <div className="glass glass-hover" style={{ padding: '50px 40px', textAlign: 'left' }}>
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>🏛️</div>
          <h3 style={{ marginBottom: '15px', color: '#ec4899', fontSize: '1.5rem', fontWeight: '800' }}>SENIOR STAFF</h3>
          <p style={{ fontSize: '1rem', marginBottom: '30px', color: 'var(--text-muted)' }}>Architecture: Distributed systems logic, complex refactoring, and infrastructure-as-code scenarios.</p>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => startChallenge('senior')}>Start Level</button>
        </div>
      </section>

      <footer style={{ padding: '40px', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        &copy; 2026 TechQuest. Built for developers by developers.
      </footer>
    </div>
  );
};

export default App;
