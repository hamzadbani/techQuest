import React, { useEffect, useState } from 'react';
import { fetchPendingChallenges, approveChallenge, saveBlog } from '../services/apiService';

interface AdminPanelProps {
    onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
    const [tab, setTab] = useState<'challenges' | 'blogs'>('challenges');
    const [pending, setPending] = useState<any[]>([]);
    const [selected, setSelected] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Blog State
    const [blogData, setBlogData] = useState({
        title: '',
        subtitle: '',
        content: '',
        category: 'Engineering'
    });

    const [editData, setEditData] = useState({
        title: '',
        description: '',
        learningContent: '',
        concepts: '',
        initialCode: '',
        expectedCode: ''
    });

    useEffect(() => {
        if (tab === 'challenges') loadPending();
    }, [tab]);

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
        const updates = { ...editData, concepts: conceptsArray };
        const result = await approveChallenge(selected.id, updates);
        if (result) {
            setSelected(null);
            loadPending();
        }
    };

    const handleSaveBlog = async () => {
        if (!blogData.title || !blogData.content) return;
        const result = await saveBlog(blogData);
        if (result) {
            alert('Publication Successful! 🚀');
            setBlogData({ title: '', subtitle: '', content: '', category: 'Engineering' });
        }
    };

    return (
        <div className="glass animate-fade-in" style={{ padding: '40px', margin: '20px auto', maxWidth: '1200px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', gap: '30px', marginBottom: '40px', borderBottom: '1px solid var(--border)', paddingBottom: '20px', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => { setTab('challenges'); setSelected(null); }}
                        style={{
                            background: tab === 'challenges' ? 'var(--primary)' : 'rgba(255,255,255,0.02)',
                            border: '1px solid var(--glass-border)',
                            color: 'white',
                            padding: '10px 24px',
                            borderRadius: '10px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            transition: 'all 0.3s'
                        }}
                    >
                        Review Desk ({pending.length})
                    </button>
                    <button
                        onClick={() => { setTab('blogs'); setSelected(null); }}
                        style={{
                            background: tab === 'blogs' ? 'var(--primary)' : 'rgba(255,255,255,0.02)',
                            border: '1px solid var(--glass-border)',
                            color: 'white',
                            padding: '10px 24px',
                            borderRadius: '10px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            transition: 'all 0.3s'
                        }}
                    >
                        Publication Hub
                    </button>
                </div>
                <div style={{ flex: 1 }}></div>
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    Exit Admin 🚪
                </button>
            </div>

            {tab === 'challenges' ? (
                <div style={{ display: 'grid', gridTemplateColumns: selected ? '400px 1fr' : '1fr', gap: '40px' }}>
                    {/* List Side */}
                    <div style={{ borderRight: selected ? '1px solid var(--border)' : 'none', paddingRight: selected ? '40px' : '0' }}>
                        {isLoading ? (
                            <div style={{ textAlign: 'center', padding: '100px 0' }}><div className="loading-spinner"></div></div>
                        ) : pending.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '20px', opacity: '0.2' }}>✨</div>
                                <h3 style={{ margin: 0, fontWeight: '500' }}>Review Desk Clear</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Everything has been polished and published! 💎</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {pending.map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleSelect(item)}
                                        className="glass-hover"
                                        style={{
                                            padding: '20px',
                                            background: selected?.id === item.id ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            border: '1px solid var(--glass-border)',
                                            borderLeft: selected?.id === item.id ? '4px solid white' : '1px solid var(--glass-border)'
                                        }}
                                    >
                                        <div style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '8px' }}>{item.title}</div>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}>{item.level}</span>
                                            <span style={{ fontSize: '0.8rem', color: selected?.id === item.id ? 'white' : 'var(--text-muted)' }}>{item.category}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Edit Side */}
                    {selected && (
                        <div className="animate-fade-in">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                <h2 style={{ fontSize: '1.8rem' }}>Review Submission</h2>
                                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Discard Changes</button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Article Title</label>
                                    <input
                                        type="text"
                                        value={editData.title}
                                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                        style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid var(--glass-border)', borderRadius: '12px', fontSize: '1rem' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Concepts</label>
                                    <input
                                        type="text"
                                        value={editData.concepts}
                                        onChange={(e) => setEditData({ ...editData, concepts: e.target.value })}
                                        style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid var(--glass-border)', borderRadius: '12px', fontSize: '1rem' }}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Published Content</label>
                                <textarea
                                    value={editData.learningContent}
                                    onChange={(e) => setEditData({ ...editData, learningContent: e.target.value })}
                                    style={{ width: '100%', height: '250px', padding: '20px', background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid var(--glass-border)', borderRadius: '12px', marginBottom: '30px', fontSize: '1rem', lineHeight: '1.6', resize: 'vertical' }}
                                    placeholder="Write the definitive answer..."
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button className="btn-primary" onClick={handleApprove} style={{ padding: '14px 40px', fontSize: '1rem' }}>
                                    Publish Challenge 🚀
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Create New Publication</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Draft your insights for the TechQuest engineering community.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 250px', gap: '25px', marginBottom: '25px' }}>
                        <input
                            type="text"
                            placeholder="Hooking Title..."
                            value={blogData.title}
                            onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                            style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid var(--glass-border)', borderRadius: '12px', fontSize: '1.1rem' }}
                        />
                        <select
                            value={blogData.category}
                            onChange={(e) => setBlogData({ ...blogData, category: e.target.value })}
                            style={{ padding: '16px', background: '#111', color: 'white', border: '1px solid var(--glass-border)', borderRadius: '12px', fontSize: '1rem' }}
                        >
                            <option value="Engineering">Engineering</option>
                            <option value="Interview">Interview Tips</option>
                            <option value="Architecture">Architecture</option>
                            <option value="Career">Career Growth</option>
                        </select>
                    </div>

                    <input
                        type="text"
                        placeholder="Compelling Subtitle / Lede (Optional)..."
                        value={blogData.subtitle}
                        onChange={(e) => setBlogData({ ...blogData, subtitle: e.target.value })}
                        style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.03)', color: '#94a3b8', border: '1px solid var(--glass-border)', borderRadius: '12px', fontSize: '1.05rem', marginBottom: '25px' }}
                    />

                    <textarea
                        placeholder="Share your technical wisdom (Markdown supported)..."
                        value={blogData.content}
                        onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
                        style={{ width: '100%', height: '500px', padding: '30px', background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid var(--glass-border)', borderRadius: '16px', marginBottom: '20px', fontSize: '1.1rem', lineHeight: '1.7', resize: 'vertical', fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px', background: 'rgba(99, 102, 241, 0.05)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ fontSize: '0.85rem' }}>
                            <div style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '5px' }}>Links</div>
                            <code style={{ color: 'var(--text-muted)' }}>[Text](https://...)</code>
                        </div>
                        <div style={{ fontSize: '0.85rem' }}>
                            <div style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '5px' }}>Images</div>
                            <code style={{ color: 'var(--text-muted)' }}>![Alt](Image_URL)</code>
                        </div>
                        <div style={{ fontSize: '0.85rem' }}>
                            <div style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '5px' }}>Formatting</div>
                            <code style={{ color: 'var(--text-muted)' }}># H1 ## H2 {'>'} Quote</code>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button className="btn-primary" onClick={handleSaveBlog} style={{ padding: '16px 60px', fontSize: '1.1rem' }}>
                            Publish Article ✍️
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
