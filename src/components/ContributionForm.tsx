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
            <div className="glass animate-fade-in" style={{ padding: '80px 60px', margin: '40px auto', maxWidth: '700px', textAlign: 'center', border: '1px solid var(--primary)' }}>
                <div style={{ fontSize: '5rem', marginBottom: '30px' }}>💎</div>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Contribution Received</h2>
                <p style={{ marginBottom: '40px', fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    Your technical insights have been submitted for review. Once approved, they will be immortalized in our community pool to help fellow engineers.
                </p>
                <button className="btn-primary" onClick={onBack} style={{ padding: '16px 40px' }}>Return to HQ</button>
            </div>
        );
    }

    return (
        <div className="glass animate-fade-in" style={{ padding: '60px', margin: '20px auto', maxWidth: '850px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>Share Personal Experience</h2>
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: '500' }}>Discard</button>
            </div>

            <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '1.1rem' }}>
                Help us expand the boundary of technical preparation. Contribute a scenario you faced in the field.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '25px' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Submission Title</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Distributed Lock Strategy in Spring"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            style={{ width: '100%', padding: '14px', border: '1px solid var(--glass-border)', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Level</label>
                        <select
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                            style={{ width: '100%', padding: '14px', border: '1px solid var(--glass-border)', borderRadius: '12px', background: '#111', color: 'white', fontSize: '1rem' }}
                        >
                            <option value="junior">Junior</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="senior">Senior Staff</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>The Challenge Details</label>
                    <textarea
                        required
                        placeholder="Detailed technical scenario or question context..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        style={{ width: '100%', height: '180px', padding: '16px', border: '1px solid var(--glass-border)', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', color: 'white', resize: 'vertical', fontSize: '1rem', lineHeight: '1.6' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Concept Category</label>
                        <input
                            type="text"
                            placeholder="e.g. Microservices, Concurrency"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            style={{ width: '100%', padding: '14px', border: '1px solid var(--glass-border)', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interaction Format</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            style={{ width: '100%', padding: '14px', border: '1px solid var(--glass-border)', borderRadius: '12px', background: '#111', color: 'white', fontSize: '1rem' }}
                        >
                            <option value="explanation">Architectural Discourse</option>
                            <option value="refactor">Technical Refactoring</option>
                        </select>
                    </div>
                </div>

                {error && <div style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ padding: '16px 80px', fontSize: '1.1rem' }}>
                        {isSubmitting ? 'Verifying...' : 'Submit Contribution'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContributionForm;
