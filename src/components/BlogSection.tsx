import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchBlogs } from '../services/apiService';

interface BlogSectionProps {
    onBack: () => void;
}

const BlogSection: React.FC<BlogSectionProps> = ({ onBack }) => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [selectedBlog, setSelectedBlog] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        setIsLoading(true);
        const data = await fetchBlogs();
        setBlogs(data);
        setIsLoading(false);
    };

    if (selectedBlog) {
        return (
            <div className="animate-fade-in article-container">
                <button
                    onClick={() => setSelectedBlog(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '40px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <span style={{ fontSize: '1.2rem' }}>←</span> Back to Publications
                </button>

                <article>
                    <header className="article-header">
                        <div style={{ marginBottom: '16px' }}>
                            <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 12px' }}>
                                {selectedBlog.category}
                            </span>
                        </div>

                        <h1 className="article-title">{selectedBlog.title}</h1>

                        {selectedBlog.subtitle && (
                            <div className="article-subtitle">
                                {selectedBlog.subtitle}
                            </div>
                        )}

                        <div className="author-bar">
                            <div className="avatar">T</div>
                            <div className="author-meta">
                                <div className="author-name-row">
                                    <span className="author-name">TechQuest Editorial</span>
                                    <button className="btn-follow">Follow</button>
                                </div>
                                <div className="meta-details">
                                    <span>{selectedBlog.readTime} min read</span>
                                    <span>·</span>
                                    <span>{new Date(selectedBlog.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>

                        <div className="action-bar">
                            <div className="action-group">
                                <div className="action-item">👏 <span>2.4K</span></div>
                                <div className="action-item">💬 <span>128</span></div>
                            </div>
                            <div className="action-group">
                                <div className="action-item">🔖</div>
                                <div className="action-item">▶️</div>
                                <div className="action-item">📤</div>
                                <div className="action-item">···</div>
                            </div>
                        </div>
                    </header>

                    <div className="article-body">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {selectedBlog.content}
                        </ReactMarkdown>
                    </div>

                    <footer style={{ marginTop: '80px', padding: '40px 0', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
                            <h3 style={{ marginBottom: '20px', color: 'white' }}>Enjoyed this publication?</h3>
                            <button className="btn-primary" onClick={onBack} style={{ padding: '12px 32px' }}>Explore the Full Library</button>
                        </div>
                    </footer>
                </article>
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ padding: '80px 20px', maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                <h1 style={{ marginBottom: '16px' }}>The TechQuest Blog</h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', fontWeight: '400', maxWidth: '600px', margin: '0 auto' }}>
                    Deep dives into engineering, system design, and the future of development.
                </p>
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <div className="loading-spinner"></div>
                    <p style={{ marginTop: '20px', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.8rem', opacity: '0.6' }}>Curating Content...</p>
                </div>
            ) : blogs.length === 0 ? (
                <div className="glass" style={{ textAlign: 'center', padding: '100px 40px', borderStyle: 'dashed' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: '0.2' }}>📚</div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>The library is empty</h3>
                    <p style={{ color: 'var(--text-muted)' }}>We're currently drafting new insights. Check back soon for our first publication.</p>
                    <button className="btn-primary" style={{ marginTop: '30px' }} onClick={onBack}>Return Home</button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '60px', maxWidth: '800px', margin: '0 auto' }}>
                    {blogs.map(blog => (
                        <article
                            key={blog._id}
                            onClick={() => setSelectedBlog(blog)}
                            className="glass-hover"
                            style={{
                                padding: '0 0 60px 0',
                                textAlign: 'left',
                                display: 'grid',
                                gridTemplateColumns: '1fr 200px',
                                gap: '40px',
                                cursor: 'pointer',
                                borderBottom: '1px solid var(--border)'
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.6rem' }}>T</div>
                                    <span style={{ color: 'white', fontWeight: '600' }}>TechQuest Editorial</span>
                                    <span>•</span>
                                    <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                                </div>

                                <h2 style={{ fontSize: '1.75rem', marginBottom: '12px', color: 'white', lineHeight: '1.3', fontWeight: '800' }}>{blog.title}</h2>
                                <div style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '1rem',
                                    lineHeight: '1.6',
                                    display: '-webkit-box',
                                    WebkitLineClamp: '2',
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    marginBottom: '24px'
                                }}>
                                    {blog.content.replace(/[#*`]/g, '')}
                                </div>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <span className="badge" style={{ fontSize: '0.7rem' }}>{blog.category}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{blog.readTime} min read</span>
                                </div>
                            </div>
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05))',
                                borderRadius: '4px',
                                border: '1px solid var(--glass-border)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '140px'
                            }}>
                                <div style={{ fontSize: '3rem', opacity: '0.3' }}>📄</div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogSection;
