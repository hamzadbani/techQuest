import React, { useState } from 'react';
import { submitChallenge } from '../services/apiService';

interface ContributionFormProps {
    onBack: () => void;
}

const ContributionForm: React.FC<ContributionFormProps> = ({ onBack }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        level: 'junior',
        category: 'Java & Spring Boot',
        type: 'explanation'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const result = await submitChallenge(formData);
        if (result) {
            setIsSuccess(true);
        } else {
            setError('Failed to submit. Please check if your backend is running.');
        }
        setIsSubmitting(false);
    };

    if (isSuccess) {
        return (
            <div className="glass animate-fade-in" style={{ padding: '60px', margin: '40px auto', maxWidth: '600px', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⭐</div>
                <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>Thank You, Pioneer!</h2>
                <p style={{ marginBottom: '30px', color: 'var(--text-muted)' }}>
                    Your interview experience has been saved to our database. This will help hundreds of other developers prepare better.
                </p>
                <button className="btn-primary" onClick={onBack}>Back to Home</button>
            </div>
        );
    }

    return (
        <div className="glass animate-fade-in" style={{ padding: '40px', margin: '20px auto', maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: 0 }}>Share Your Experience</h2>
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</button>
            </div>

            <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                Had a tough question in an interview? Paste it here! We'll add it to the community pool.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Title (Short summary)</label>
                        <input
                            type="text"
                            className="glass"
                            required
                            placeholder="e.g. Java Streams vs Parallel Streams"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Level</label>
                        <select
                            className="glass"
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                        >
                            <option value="junior" style={{ background: '#151518', color: 'white' }}>Junior</option>
                            <option value="intermediate" style={{ background: '#151518', color: 'white' }}>Intermediate</option>
                            <option value="senior" style={{ background: '#151518', color: 'white' }}>Senior</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>The Question / Scenario</label>
                    <textarea
                        className="glass"
                        required
                        placeholder="Describe what the interviewer asked..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        style={{ width: '100%', height: '150px', padding: '12px', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white', resize: 'none' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Category</label>
                        <input
                            type="text"
                            className="glass"
                            placeholder="e.g. Spring Boot, Design Patterns"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Format</label>
                        <select
                            className="glass"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                        >
                            <option value="explanation" style={{ background: '#151518', color: 'white' }}>Conceptual Explanation</option>
                            <option value="refactor" style={{ background: '#151518', color: 'white' }}>Live Coding / Refactoring</option>
                        </select>
                    </div>
                </div>

                {error && <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>{error}</div>}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ padding: '12px 40px' }}>
                        {isSubmitting ? 'Submitting...' : 'Submit to Database'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContributionForm;
