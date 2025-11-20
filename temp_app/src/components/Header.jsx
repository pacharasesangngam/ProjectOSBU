import React from 'react';

const Header = ({ theme, toggleTheme }) => {
    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            padding: '1.5rem 0',
            background: 'var(--header-bg)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--glass-border)',
            transition: 'background 0.3s, border-color 0.3s'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '24px', height: '24px', background: 'var(--text-color)', borderRadius: '50%' }}></div>
                        <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-color)' }}>Banker</span>
                    </div>
                    <a href="#" style={{ color: 'var(--text-color)', opacity: 0.8, textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'opacity 0.2s' }}>Features</a>
                </div>

                <div
                    onClick={toggleTheme}
                    style={{
                        width: '60px',
                        height: '30px',
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '15px',
                        position: 'relative',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '2px',
                        transition: 'all 0.3s ease'
                    }}
                    role="button"
                    aria-label="Toggle Theme"
                >
                    <div style={{
                        width: '24px',
                        height: '24px',
                        background: 'var(--text-color)',
                        borderRadius: '50%',
                        position: 'absolute',
                        left: theme === 'dark' ? '2px' : '32px',
                        transition: 'left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--bg-color)'
                    }}>
                        {theme === 'dark' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
