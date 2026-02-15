import React, { useState, useEffect } from 'react';
import { verifyExplanation } from '../services/verificationService';
import type { VerificationResult } from '../services/verificationService';
import { fetchChallenges } from '../services/apiService';

interface Challenge {
    id: string;
    category: string;
    level: string;
    title: string;
    description: string;
    type: string;
    initialCode?: string;
    expectedCode?: string;
    concepts: string[];
    learningContent: string;
}

interface PlatformProps {
    level: string;
    onExit: () => void;
}

interface UserResponse {
    challengeId: string;
    userInput: string;
    evaluation?: VerificationResult;
}

const Platform: React.FC<PlatformProps> = ({ level, onExit }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [responses, setResponses] = useState<UserResponse[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [sessionChallenges, setSessionChallenges] = useState<Challenge[]>([]);

    useEffect(() => {
        const loadChallenges = async () => {
            setIsLoading(true);

            // Get already seen IDs from localStorage
            const history = localStorage.getItem('techquest_history');
            const seenIds = history ? JSON.parse(history) : [];

            const challenges = await fetchChallenges(level, 20, seenIds);

            if (challenges && challenges.length > 0) {
                setSessionChallenges(challenges);
            } else if (seenIds.length > 0) {
                // FALLBACK: If we've seen EVERYTHING, reset history and fetch again
                console.log("User saw all questions. Resetting history for variety.");
                localStorage.removeItem('techquest_history');
                const freshChallenges = await fetchChallenges(level, 20);
                setSessionChallenges(freshChallenges);
            } else {
                console.error("No challenges returned from API");
            }
            setIsLoading(false);
        };

        loadChallenges();
    }, [level]);

    const challenge = sessionChallenges[currentIdx];

    const handleNext = () => {
        const newResponses = [...responses, { challengeId: challenge.id, userInput }];
        setResponses(newResponses);

        if (currentIdx < sessionChallenges.length - 1) {
            setCurrentIdx(currentIdx + 1);
            setUserInput('');
        } else {
            // SESSION FINISHED
            // 1. Save seen IDs to localStorage
            const history = localStorage.getItem('techquest_history');
            const seenIds = history ? JSON.parse(history) : [];
            const newSeenIds = [...new Set([...seenIds, ...sessionChallenges.map(c => c.id)])];
            localStorage.setItem('techquest_history', JSON.stringify(newSeenIds));

            // 2. Evaluate
            const evaluatedResponses = newResponses.map(resp => {
                const chall = sessionChallenges.find(c => c.id === resp.challengeId)!;
                return {
                    ...resp,
                    evaluation: verifyExplanation(resp.userInput, chall.concepts)
                };
            });
            setResponses(evaluatedResponses);
            setIsFinished(true);
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <div className="animate-fade-in" style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '10px' }}>
                    Preparing session questions from database...
                </div>
                <div style={{ width: '200px', height: '4px', background: 'var(--glass)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '60%', height: '100%', background: 'var(--primary)', animation: 'loader 2s infinite ease-in-out' }}></div>
                </div>
                <style>{`
                    @keyframes loader {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(200%); }
                    }
                `}</style>
            </div>
        );
    }

    if (isFinished) {
        const totalScore = Math.round(responses.reduce((acc: number, curr: UserResponse) => acc + (curr.evaluation?.score || 0), 0) / responses.length);
        return (
            <div className="animate-fade-in" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
                <div className="glass" style={{ padding: '40px', textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>Session Complete!</h1>
                    <div style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>Overall Score: {totalScore}%</div>
                    <button className="btn-primary" style={{ marginTop: '20px' }} onClick={onExit}>Back to Home</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {responses.map((resp, idx) => {
                        const chall = sessionChallenges.find(c => c.id === resp.challengeId)!;
                        return (
                            <div key={resp.challengeId} className="glass" style={{ padding: '25px' }}>
                                <h3 style={{ marginBottom: '10px' }}>{idx + 1}. {chall.title}</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <h5 style={{ color: 'var(--text-muted)', marginBottom: '5px' }}>YOUR ANSWER</h5>
                                        <p style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>"{resp.userInput || '[No answer provided]'}"</p>
                                    </div>
                                    <div>
                                        <h5 style={{ color: 'var(--primary)', marginBottom: '5px' }}>EVALUATION & FEEDBACK</h5>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '5px' }}>Score: {resp.evaluation?.score}%</div>
                                        <p style={{ fontSize: '0.85rem', marginBottom: '10px' }}>{resp.evaluation?.feedback}</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                            {resp.evaluation?.matchedConcepts.map((c: string) => (
                                                <span key={c} style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>{c}</span>
                                            ))}
                                            {resp.evaluation?.missingConcepts.map((c: string) => (
                                                <span key={c} style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>{c}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ marginTop: '20px', padding: '15px', background: 'var(--glass)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                                    <h5 style={{ color: 'var(--secondary)', marginBottom: '5px' }}>LEARNING POINT</h5>
                                    <p style={{ fontSize: '0.85rem' }}>{chall.learningContent}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    if (!challenge) {
        return (
            <div className="glass animate-fade-in" style={{ padding: '60px', margin: '40px auto', maxWidth: '600px', textAlign: 'center' }}>
                <h2 style={{ color: '#ef4444', marginBottom: '20px' }}>Database is empty!</h2>
                <p style={{ marginBottom: '30px', color: 'var(--text-muted)' }}>
                    It looks like the platform's database hasn't been populated yet. Please run the recovery script to restore your session questions.
                </p>
                <div style={{ background: '#1e1e2e', padding: '20px', borderRadius: '8px', textAlign: 'left', marginBottom: '30px' }}>
                    <code style={{ color: '#cdd6f4', fontSize: '0.9rem' }}>
                        cd backend <br />
                        node restore-db.js
                    </code>
                </div>
                <button className="btn-primary" onClick={onExit}>Return to Home</button>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px', height: 'calc(100vh - 100px)' }}>
            <div className="glass" style={{ padding: '30px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        Question {currentIdx + 1} of {sessionChallenges.length}
                    </span>
                    <button onClick={onExit} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel Session</button>
                </div>
                <h2 style={{ marginBottom: '15px' }}>{challenge.title}</h2>
                <p style={{ marginBottom: '20px', whiteSpace: 'pre-wrap' }}>{challenge.description}</p>
                {challenge.initialCode && (
                    <pre style={{ background: '#1e1e2e', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem', color: '#cdd6f4', marginBottom: '20px' }}>
                        <code>{challenge.initialCode}</code>
                    </pre>
                )}
            </div>

            <div className="glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ marginBottom: '15px', color: 'var(--text-muted)' }}>YOUR EXPLANATION</h4>
                <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Explain the concept and/or provide your refactored code here..."
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', resize: 'none', fontSize: '1rem', lineHeight: '1.6' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                    <button className="btn-primary" onClick={handleNext}>
                        {currentIdx < sessionChallenges.length - 1 ? 'Save & Next Question' : 'Finish Session'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Platform;
