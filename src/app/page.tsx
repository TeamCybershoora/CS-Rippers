"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { usePerformance, useThrottle } from "../hooks/usePerformance";
import "../styles/glass-effects.css";
import "../styles/macos-styles.css";

// Lazy load components for better performance
const MacOSMenuBar = dynamic(() => import('./components/MacOSMenuBar'), {
  ssr: false,
  loading: () => <div className="menubar-loading" />
});

const MacOSDock = dynamic(() => import('./components/MacOSDock'), {
  ssr: false,
  loading: () => <div className="dock-loading" />
});

export default function Home() {
  // Performance monitoring
  usePerformance('HomePage');
  
  const [theme, setTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('blue');
  const [wallpaper, setWallpaper] = useState('default');
  const [showAbout, setShowAbout] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [showDesktop, setShowDesktop] = useState(false);
  const [bootStage, setBootStage] = useState('logo'); // 'logo', 'hello', 'loading'

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("isLoggedIn") &&
      localStorage.getItem("isOtpVerified")
    ) {
      window.location.replace("/dashboard");
    }

    // Load user preferences - default to dark theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedAccent = localStorage.getItem('accentColor') || 'blue';
    const savedWallpaper = localStorage.getItem('wallpaper') || 'default';
    
    setTheme(savedTheme);
    setAccentColor(savedAccent);
    setWallpaper(savedWallpaper);

    // Apply custom wallpaper if selected
    if (savedWallpaper === 'custom') {
      const customWallpaper = localStorage.getItem('customWallpaper');
      if (customWallpaper) {
        document.documentElement.style.setProperty('--custom-wallpaper', `url(${customWallpaper})`);
      }
    }
  }, []);

  // macOS Boot Sequence
  useEffect(() => {
    if (isBooting) {
      // Stage 1: Show logo for 2 seconds
      const logoTimer = setTimeout(() => {
        setBootStage('hello');
      }, 2000);

      // Stage 2: Show hello text for 1.5 seconds
      const helloTimer = setTimeout(() => {
        setBootStage('loading');
      }, 3500);

      // Stage 3: Loading progress
      const loadingTimer = setTimeout(() => {
        const bootTimer = setInterval(() => {
          setBootProgress(prev => {
            if (prev >= 100) {
              clearInterval(bootTimer);
              setTimeout(() => {
                setIsBooting(false);
                setTimeout(() => setShowDesktop(true), 500);
              }, 1000);
              return 100;
            }
            return prev + 2;
          });
        }, 60);
      }, 3500);

      return () => {
        clearTimeout(logoTimer);
        clearTimeout(helloTimer);
        clearTimeout(loadingTimer);
      };
    }
  }, [isBooting]);

  const savePreference = useCallback((key: string, value: string) => {
    localStorage.setItem(key, value);
  }, []);

  const handleThemeChange = useCallback((newTheme: string) => {
    setTheme(newTheme);
    savePreference('theme', newTheme);
  }, [savePreference]);

  const handleAccentChange = useCallback((newAccent: string) => {
    setAccentColor(newAccent);
    savePreference('accentColor', newAccent);
  }, [savePreference]);

  const handleWallpaperChange = useCallback((newWallpaper: string) => {
    setWallpaper(newWallpaper);
    savePreference('wallpaper', newWallpaper);
  }, [savePreference]);

  const handleWallpaperUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        localStorage.setItem('customWallpaper', imageUrl);
        document.documentElement.style.setProperty('--custom-wallpaper', `url(${imageUrl})`);
        setWallpaper('custom');
        savePreference('wallpaper', 'custom');
      };
      reader.readAsDataURL(file);
    }
  }, [savePreference]);

  // Reset all customizations to default values
  const resetToDefaults = useCallback(() => {
    const confirmReset = confirm('🔄 Reset all customizations to default settings?\n\nThis will restore:\n• Theme: Dark Mode\n• Accent Color: Blue\n• Wallpaper: macOS Default\n• All custom uploads will be cleared\n• All preferences will be removed\n\nAre you sure you want to continue?');
    
    if (confirmReset) {
      try {
        // Reset all states to defaults
        setTheme('dark');
        setAccentColor('blue');
        setWallpaper('default');
        
        // Clear all localStorage preferences
        const keysToRemove = ['theme', 'accentColor', 'wallpaper', 'customWallpaper'];
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Reset CSS custom properties and classes
        document.documentElement.style.removeProperty('--custom-wallpaper');
        document.documentElement.className = 'theme-dark accent-blue wallpaper-default';
        
        // Close customization panel
        setIsPanelOpen(false);
        
        // Show success message with delay
        setTimeout(() => {
          alert('✅ All settings have been reset to default successfully!\n\n🎉 Your interface has been restored to the original macOS look.');
        }, 400);
        
      } catch (error) {
        console.error('Error resetting settings:', error);
        alert('❌ Error occurred while resetting settings. Please try again.');
      }
    }
  }, []);

  // Memoized callbacks for child components
  const handleAboutClick = useCallback(() => {
    setShowAbout(!showAbout);
  }, [showAbout]);

  const handleCustomizeClick = useCallback(() => {
    setIsPanelOpen(!isPanelOpen);
  }, [isPanelOpen]);

  // Throttled handlers for better performance
  const throttledThemeChange = useThrottle(handleThemeChange, 100);
  const throttledAccentChange = useThrottle(handleAccentChange, 100);
  const throttledWallpaperChange = useThrottle(handleWallpaperChange, 100);

  // Memoized desktop classes
  const desktopClasses = useMemo(() => {
    return `macos-desktop ${showDesktop ? 'desktop-loaded' : ''} theme-${theme} accent-${accentColor} wallpaper-${wallpaper}`;
  }, [showDesktop, theme, accentColor, wallpaper]);

  // Boot Screen Component
  if (isBooting) {
    return (
      <div className="loading-screen">
        {bootStage === 'logo' && (
          <div className="boot-logo-stage">
            <img 
              src="/images/CSR-logo.svg" 
              alt="CS RIPPERS" 
              className="boot-logo"
            />
          </div>
        )}
        
        {bootStage === 'hello' && (
          <div className="boot-hello-stage">
            <div className="hello-text">Hello</div>
          </div>
        )}
        
        {bootStage === 'loading' && (
          <div className="boot-loading-stage">
            <img 
              src="/images/CSR-logo.svg" 
              alt="CS RIPPERS" 
              className="boot-logo-small"
            />
            <div className="loading-line">
              <div className="moving-line" style={{ width: `${bootProgress}%` }}></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <main className={desktopClasses}>
      {/* macOS Menu Bar - Optimized Component */}
      <MacOSMenuBar onAboutClick={handleAboutClick} />

      {/* Customization Panel */}
      {isPanelOpen && (
      <div className="customization-panel liquid-glass-form liquid-pulse panel-open-animation">
        <div className="panel-header">
          <span>🎨 Customize</span>
          <div className="window-controls-right">
            <div className="control yellow" title="Minimize"></div>
            <div className="control green" title="Maximize"></div>
            <div className="control red" onClick={() => setIsPanelOpen(false)} title="Close"></div>
          </div>
        </div>
        <div className="panel-content">
          <div className="control-group">
            <label htmlFor="theme-select">Theme:</label>
            <select 
              id="theme-select"
              value={theme} 
              onChange={(e) => throttledThemeChange(e.target.value)}
              aria-label="Select theme preference"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div className="control-group">
            <label>Accent:</label>
            <div className="color-options">
              {['blue', 'purple', 'pink', 'red', 'orange', 'yellow', 'green'].map(color => (
                <div 
                  key={color}
                  className={`color-option ${color} ${accentColor === color ? 'active' : ''}`}
                  onClick={() => throttledAccentChange(color)}
                ></div>
              ))}
            </div>
          </div>
          <div className="control-group">
            <label htmlFor="wallpaper-select">Wallpaper:</label>
            <select 
              id="wallpaper-select"
              value={wallpaper} 
              onChange={(e) => throttledWallpaperChange(e.target.value)}
              aria-label="Select wallpaper style"
            >
              <option value="default">macOS Default</option>
              <option value="monterey">Monterey</option>
              <option value="ventura">Ventura</option>
              <option value="sonoma">Sonoma</option>
              <option value="sequoia">Sequoia</option>
              <option value="big-sur">Big Sur</option>
              <option value="gradient">Gradient</option>
              <option value="minimal">Minimal</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          
          <div className="control-group">
            <label htmlFor="wallpaper-upload">Upload Custom Wallpaper:</label>
            <input 
              id="wallpaper-upload"
              type="file" 
              accept="image/*" 
              onChange={handleWallpaperUpload}
              className="file-input"
              aria-label="Upload custom wallpaper image"
            />
            <small>Upload your own wallpaper image (JPG, PNG, GIF)</small>
          </div>
          
          {/* Reset Button */}
          <div className="control-group reset-section">
            <button className="reset-btn-full" onClick={resetToDefaults} title="Reset all settings to default">
              🔄 Reset All Customizations
            </button>
            <small>This will restore all settings to their default values</small>
          </div>
        </div>
      </div>
      )}

      {/* Main Content Window - Only show when About is clicked */}
      {showAbout && (
      <div className="macos-window main-window window-open-animation">
        <div className="window-header">
          <div className="window-controls">
            <div className="control red" onClick={() => setShowAbout(false)}></div>
            <div className="control yellow"></div>
            <div className="control green"></div>
          </div>
          <div className="window-title">CS RIPPERS - Hackathon Platform</div>
          <div className="window-actions"></div>
        </div>

        <div className="window-content">
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
          </section>

          {/* Call to Action */}
          <section className="cta-section">
            <div className="cta-content">
              <h3 className="cta-title">Ready to join the next big hackathon?</h3>
              <p className="cta-desc">Sign up now and be part of the most exciting coding community. Compete, learn, and win!</p>
              <Link href="/register" className="macos-btn cta-btn">
                Register Now
              </Link>
            </div>
          </section>
        </div>
      </div>
      )}

      {/* macOS Dock - Optimized Component */}
      <MacOSDock onCustomizeClick={handleCustomizeClick} />
    </main>
  );
}
