import React, { useState } from 'react';
import './index.css';
import Platform from './components/Platform';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'platform'>('landing');
  const [selectedLevel, setSelectedLevel] = useState<string>('junior');

  const startChallenge = (level: string) => {
    setSelectedLevel(level);
    setView('platform');
  };

  if (view === 'platform') {
    return (
      <div className="app-container">
        <nav className="glass" style={{ margin: '20px', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          TechQuest
        </div>
        <div style={{ display: 'flex', gap: '30px', fontWeight: '500' }}>
          <a href="#" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Home</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Challenges</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Pricing</a>
        </div>
      </nav>

      <main className="animate-fade-in" style={{ padding: '0 40px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '24px' }}>Master the Real-World <br /> Developer Interview</h1>
        <p style={{ maxWidth: '600px', marginBottom: '40px' }}>
          No more memorizing definitions. Level up your coding skills with real-world scenarios, code refactoring, and conceptual deep-dives.
        </p>

        <div style={{ display: 'flex', gap: '20px' }}>
          <button className="btn-primary" onClick={() => document.getElementById('levels')?.scrollIntoView({ behavior: 'smooth' })}>
            Get Started
          </button>
          <button className="glass" style={{ padding: '12px 24px', color: 'white', border: '1px solid var(--border)', cursor: 'pointer' }}>
            Browse Challenges
          </button>
        </div>
      </main>

      <section id="levels" style={{ padding: '80px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        <div className="glass" style={{ padding: '40px', textAlign: 'left' }}>
          <h3 style={{ marginBottom: '15px', color: '#6366f1' }}>JAVA JUNIOR</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '25px' }}>Perfect for new developers mastering core concepts like OOP, Streams, and solid principles.</p>
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => startChallenge('junior')}>Choose Level</button>
        </div>
        <div className="glass" style={{ padding: '40px', textAlign: 'left', border: '1px solid var(--primary)' }}>
          <h3 style={{ marginBottom: '15px', color: '#a855f7' }}>INTERMEDIATE</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '25px' }}>Deep dive into patterns, performance tuning, and advanced Spring architecture.</p>
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => startChallenge('intermediate')}>Choose Level</button>
        </div>
        <div className="glass" style={{ padding: '40px', textAlign: 'left' }}>
          <h3 style={{ marginBottom: '15px', color: '#ec4899' }}>SENIOR</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '25px' }}>System design, microservices, and complex refactoring for industry veterans.</p>
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => startChallenge('senior')}>Choose Level</button>
        </div>
      </section>

      <footer style={{ padding: '40px', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        &copy; 2026 TechQuest. Built for developers by developers.
      </footer>
    </div>
  );
};

export default App;
