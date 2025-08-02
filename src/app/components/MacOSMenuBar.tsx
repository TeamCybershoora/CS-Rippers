import { memo, useCallback, useState, useEffect, useMemo } from 'react';
import OptimizedImage from './OptimizedImage';

interface MacOSMenuBarProps {
  onAboutClick: () => void;
}

const MacOSMenuBar = memo(({ onAboutClick }: MacOSMenuBarProps) => {
  const handleAboutClick = useCallback(() => {
    onAboutClick();
  }, [onAboutClick]);

  // Real-time clock state
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Update time and date every second
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      const timeString = now.toLocaleTimeString([], {
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
      
      const dateString = now.toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };

    // Update immediately
    updateDateTime();

    // Set up interval to update every second
    const interval = setInterval(updateDateTime, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Memoized tooltip text for better performance
  const tooltipText = useMemo(() => {
    if (!currentDate || !currentTime) return '';
    return `${currentDate} ${currentTime}`;
  }, [currentDate, currentTime]);

  return (
    <div className="macos-menubar">
      <div className="menubar-left">
        <div className="cs-logo">
          <OptimizedImage 
            src="/images/CSR-logo.svg" 
            alt="CS RIPPERS" 
            className="logo-image"
            width={20}
            height={20}
            priority
          />
        </div>
        <span className="menu-item menu-item-1 active">CS RIPPERS</span>
      </div>
      <div className="menubar-center">
        <span className="menu-item menu-item-2 datetime" title={tooltipText}>
          <div className="date-time-display">
            <div className="time-display">{currentTime}</div>
            <div className="date-display">{currentDate}</div>
          </div>
        </span>
      </div>
      <div className="menubar-right">
        <div className="system-controls">
          <span className="menu-item system-icon system-icon-1" title="Spotlight Search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <span className="menu-item system-icon system-icon-2" title="Control Center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </span>
          <span className="menu-item system-icon system-icon-3" title="WiFi">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
              <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
              <line x1="12" y1="20" x2="12.01" y2="20"/>
            </svg>
          </span>
          <span className="menu-item system-icon system-icon-4" title="Battery">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="6" width="18" height="12" rx="2" ry="2"/>
              <line x1="23" y1="13" x2="23" y2="11"/>
              <rect x="3" y="8" width="12" height="8" rx="1" ry="1" fill="currentColor" opacity="0.7"/>
            </svg>
          </span>
          <span className="menu-item system-icon system-icon-5" title="Bluetooth">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6.5 6.5l11 11L12 23l-5.5-5.5L12 12l5.5-5.5L12 1l5.5 5.5-11 11"/>
            </svg>
          </span>
          <span className="menu-item system-icon system-icon-6" title="Sound">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
          </span>
          <span className="menu-item system-icon system-icon-7" title="System Preferences">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m15.5-3.5L19 8.5m-14 7L7.5 13m11 3.5L16.5 19m-9-9L5 7.5"/>
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
});

MacOSMenuBar.displayName = 'MacOSMenuBar';

export default MacOSMenuBar;