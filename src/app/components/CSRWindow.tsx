import { memo, useCallback, useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface CSRWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const CSRWindow = memo(({ isOpen, onClose }: CSRWindowProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleMinimize = useCallback(() => {
    console.log('Minimize clicked, current state:', isMinimized);
    setIsMinimized(!isMinimized);
  }, [isMinimized]);

  const handleMaximize = useCallback(() => {
    setIsMaximized(!isMaximized);
  }, [isMaximized]);

  // Double click to maximize/restore
  const handleDoubleClick = useCallback(() => {
    setIsMaximized(!isMaximized);
  }, [isMaximized]);

  // Mouse drag functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return; // Don't allow dragging when maximized
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position, isMaximized]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse event listeners and update transform
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Update window position using transform
  useEffect(() => {
    if (windowRef.current && !isMaximized && !isMinimized) {
      const transform = `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`;
      windowRef.current.style.transform = transform;
      windowRef.current.style.top = '50%';
      windowRef.current.style.left = '50%';
      windowRef.current.style.width = '';
      windowRef.current.style.height = '';
      windowRef.current.style.right = '';
      windowRef.current.style.bottom = '';
    } else if (windowRef.current && isMaximized) {
      windowRef.current.style.transform = 'none';
      windowRef.current.style.top = '0px';
      windowRef.current.style.left = '0px';
      windowRef.current.style.right = '0px';
      windowRef.current.style.bottom = '0px';
      windowRef.current.style.width = '100vw';
      windowRef.current.style.height = '100vh';
    }
  }, [position, isMaximized, isMinimized]);

  // Reset position when window opens
  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 0, y: 0 });
      setIsMinimized(false);
      setIsMaximized(false);
      
      // Ensure window is centered on open
      if (windowRef.current) {
        windowRef.current.style.top = '50%';
        windowRef.current.style.left = '50%';
        windowRef.current.style.transform = 'translate(-50%, -50%)';
      }
    }
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          handleClose();
          break;
        case 'F11':
          e.preventDefault();
          handleMaximize();
          break;
        case 'm':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            handleMinimize();
          }
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleClose, handleMaximize, handleMinimize]);

  if (!isOpen) return null;

  const windowClasses = `macos-window csr-window window-open-animation ${
    isMinimized ? 'minimized' : ''
  } ${isMaximized ? 'maximized' : ''} ${isDragging ? 'dragging' : ''}`;

  // Use data attributes instead of inline styles
  const windowDataAttrs = {
    'data-window-x': position.x,
    'data-window-y': position.y,
    'data-window-maximized': isMaximized,
    'data-window-dragging': isDragging
  };

  return (
    <div 
      ref={windowRef}
      className={windowClasses}
      {...windowDataAttrs}
    >
      <div 
        className={`window-header draggable-header ${isDragging ? 'dragging-cursor' : 'grab-cursor'}`}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <div className="window-controls">
          <div className="control red" onClick={handleClose} title="Close"></div>
          <div className="control yellow" onClick={handleMinimize} title="Minimize"></div>
          <div className="control green" onClick={handleMaximize} title="Maximize"></div>
        </div>
        <div className="window-title">
          CS RIPPERS - Hackathon Platform
        </div>
        <div className="window-actions"></div>
      </div>

      <div className={`window-content csr-window-content ${isMinimized ? 'hidden' : ''}`}>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-icon">⚡</div>
          <h1 className="hero-title">CS RIPPERS</h1>
          <h2 className="hero-subtitle">The Next-Gen Hackathon & Competition Platform</h2>
          <p className="hero-desc">Host, join, and win hackathons and coding competitions. Compete for real prize pools, solve exciting tasks, and showcase your skills to the world. Built for developers, by developers.</p>
          <div className="hero-btns">
            <Link href="/register" className="macos-btn primary">Get Started</Link>
            <Link href="/login" className="macos-btn secondary">Log In</Link>
          </div>
        </section>

        {/* Features as macOS Apps */}
        <section className="apps-grid">
          <div className="app-card">
            <div className="app-icon">🧩</div>
            <h3 className="app-title">Exciting Tasks</h3>
            <p className="app-desc">Solve real-world coding challenges, puzzles, and project-based tasks designed by industry experts.</p>
            <div className="app-actions">
              <button className="action-btn">Explore</button>
            </div>
          </div>

          <div className="app-card featured">
            <div className="app-icon">🏆</div>
            <h3 className="app-title">Hackathons & Competitions</h3>
            <p className="app-desc">Participate in regular hackathons and coding competitions. Compete solo or as a team, climb the leaderboard, and win big!</p>
            <div className="app-actions">
              <button className="action-btn">Join Now</button>
            </div>
          </div>

          <div className="app-card">
            <div className="app-icon">💰</div>
            <h3 className="app-title">Prize Pools</h3>
            <p className="app-desc">Win cash prizes, swags, and exclusive opportunities. The more you win, the higher you rank!</p>
            <div className="app-actions">
              <button className="action-btn">View Prizes</button>
            </div>
          </div>

          <div className="app-card">
            <div className="app-icon">👥</div>
            <h3 className="app-title">Team Collaboration</h3>
            <p className="app-desc">Form teams, collaborate on projects, and compete together. Built-in communication and project management tools.</p>
            <div className="app-actions">
              <button className="action-btn">Find Team</button>
            </div>
          </div>

          <div className="app-card">
            <div className="app-icon">📊</div>
            <h3 className="app-title">Analytics & Progress</h3>
            <p className="app-desc">Track your performance, view detailed analytics, and monitor your progress across competitions.</p>
            <div className="app-actions">
              <button className="action-btn">View Stats</button>
            </div>
          </div>

          <div className="app-card">
            <div className="app-icon">🎯</div>
            <h3 className="app-title">Skill Development</h3>
            <p className="app-desc">Improve your coding skills with targeted challenges and receive feedback from industry professionals.</p>
            <div className="app-actions">
              <button className="action-btn">Start Learning</button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Active Developers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Competitions Hosted</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">$100K+</div>
              <div className="stat-label">Prize Money Distributed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Platform Availability</div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of developers who are already competing and winning on CS RIPPERS.</p>
          <div className="cta-buttons">
            <Link href="/register" className="macos-btn primary large">Join Now</Link>
            <Link href="/login" className="macos-btn secondary large">Sign In</Link>
          </div>
        </section>
      </div>

      {/* Resize handles - only show when not maximized */}
      {!isMaximized && !isMinimized && (
        <>
          <div className="resize-handle resize-handle-se" title="Resize"></div>
          <div className="resize-handle resize-handle-sw" title="Resize"></div>
          <div className="resize-handle resize-handle-ne" title="Resize"></div>
          <div className="resize-handle resize-handle-nw" title="Resize"></div>
        </>
      )}
    </div>
  );
});

CSRWindow.displayName = 'CSRWindow';

export default CSRWindow;