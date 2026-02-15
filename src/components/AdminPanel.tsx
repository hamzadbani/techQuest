import React, { useEffect, useState } from 'react';
import { fetchPendingChallenges, approveChallenge } from '../services/apiService';

interface AdminPanelProps {
    onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
    const [pending, setPending] = useState<any[]>([]);
    const [selected, setSelected] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [editData, setEditData] = useState({
        title: '',
        description: '',
        learningContent: '',
        concepts: '',
        initialCode: '',
        expectedCode: ''
    });

    useEffect(() => {
        loadPending();
    }, []);

    const loadPending = async () => {
        setIsLoading(true);
        const data = await fetchPendingChallenges();
        setPending(data);
        setIsLoading(false);
    };

    const handleSelect = (item: any) => {
        setSelected(item);
        setEditData({
            title: item.title,
            description: item.description,
            learningContent: item.learningContent || '',
            concepts: (item.concepts || []).join(', '),
            initialCode: item.initialCode || '',
            expectedCode: item.expectedCode || ''
        });
    };

    const handleApprove = async () => {
        if (!selected) return;

        const conceptsArray = editData.concepts.split(',').map(s => s.trim()).filter(Boolean);
        const updates = {
            ...editData,
            concepts: conceptsArray
        };

        const result = await approveChallenge(selected.id, updates);
        if (result) {
            setSelected(null);
            loadPending();
        }
    };

    return (
        <div className="glass animate-fade-in" style={{ padding: '30px', margin: '20px auto', maxWidth: '1200px', display: 'grid', gridTemplateColumns: selected ? '350px 1fr' : '1fr', gap: '30px' }}>
            {/* List Side */}
            <div style={{ borderRight: selected ? '1px solid var(--glass-border)' : 'none', paddingRight: selected ? '30px' : '0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2 style={{ margin: 0 }}>Review Desk</h2>
                    {!selected && <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Back</button>}
                </div>

                {isLoading ? (
                    <p>Scanning for contributions...</p>
                ) : pending.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <p style={{ color: 'var(--text-muted)' }}>Everything has been polished! 💎</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {pending.map(item => (
                            <div
                                key={item.id}
                                onClick={() => handleSelect(item)}
                                style={{
                                    padding: '15px',
                                    background: selected?.id === item.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px' }}>{item.title}</div>
                                <div style={{ fontSize: '0.8rem', color: selected?.id === item.id ? 'white' : 'var(--text-muted)' }}>{item.level.toUpperCase()} • {item.category}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Side */}
            {selected && (
                <div className="animate-fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0 }}>Editing Submission</h3>
                        <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Title</label>
                            <input
                                type="text"
                                value={editData.title}
                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Concepts (comma separated for scoring)</label>
                            <input
                                type="text"
                                value={editData.concepts}
                                placeholder="e.g. Garbage Collection, Heap, Stack"
                                onChange={(e) => setEditData({ ...editData, concepts: e.target.value })}
                                style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Learning Content (Expert Answer)</label>
                        <textarea
                            value={editData.learningContent}
                            onChange={(e) => setEditData({ ...editData, learningContent: e.target.value })}
                            style={{ width: '100%', height: '150px', padding: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', borderRadius: '8px', resize: 'none' }}
                            placeholder="Write the definitive answer here..."
                        />
                    </div>

                    {selected.type === 'refactor' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Initial Code Snippet</label>
                                <textarea
                                    value={editData.initialCode}
                                    onChange={(e) => setEditData({ ...editData, initialCode: e.target.value })}
                                    style={{ width: '100%', height: '120px', padding: '10px', background: '#1e1e2e', color: '#cdd6f4', border: '1px solid var(--glass-border)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.8rem' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Ideal Code Solution</label>
                                <textarea
                                    value={editData.expectedCode}
                                    onChange={(e) => setEditData({ ...editData, expectedCode: e.target.value })}
                                    style={{ width: '100%', height: '120px', padding: '10px', background: '#1e1e2e', color: '#cdd6f4', border: '1px solid var(--glass-border)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.8rem' }}
                                />
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn-primary" onClick={handleApprove} style={{ padding: '12px 30px' }}>
                            Publish to Platform 🚀
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
