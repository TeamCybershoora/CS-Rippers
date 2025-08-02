'use client';

import { useState, useEffect } from 'react';

export default function AdminHeader({ adminData, onLogout, onToggleSidebar, sidebarCollapsed }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('AdminHeader: showProfileMenu state changed to:', showProfileMenu);
  }, [showProfileMenu]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.header-profile-menu')) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="macos-liquid-header">
      {/* Header Glass Background */}
      <div className="header-glass-bg">
        <div className="header-liquid-overlay"></div>
      </div>

      <div className="header-content">
        {/* Left Section */}
        <div className="header-left">
          <button
            onClick={onToggleSidebar}
            className="header-toggle-btn"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <div className="toggle-btn-bg"></div>
            <svg className="toggle-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="header-title-section">
            <h1 className="header-title">Admin Dashboard</h1>
            <p className="header-subtitle">Manage your CS Rippers platform</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="header-right">
          {/* Date & Time */}
          <div className="header-datetime">
            <div className="datetime-time">{formatTime(currentTime)}</div>
            <div className="datetime-date">{formatDate(currentTime)}</div>
          </div>

          {/* Control Buttons */}
          <div className="header-controls">
            {/* Notifications */}
            <button className="header-control-btn">
              <div className="control-btn-bg"></div>
              <svg className="control-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V7a2 2 0 012-2h5m5 0v5" />
              </svg>
              <div className="notification-badge"></div>
            </button>

            {/* Settings */}
            <button className="header-control-btn">
              <div className="control-btn-bg"></div>
              <svg className="control-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* Profile Menu */}
          <div className="header-profile-menu">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Profile button clicked, current state:', showProfileMenu);
                setShowProfileMenu(!showProfileMenu);
              }}
              className="profile-menu-btn"
              style={{ 
                backgroundColor: showProfileMenu ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
              }}
            >
              <div className="profile-btn-bg"></div>
              <div className="profile-avatar">
                <div className="avatar-glow"></div>
                <svg className="avatar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="profile-info">
                <div className="profile-name">Admin</div>
                <div className="profile-email">{adminData?.email}</div>
              </div>
              <svg className="profile-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="profile-dropdown" style={{ 
                position: 'absolute', 
                right: '0', 
                top: 'calc(100% + 12px)', 
                zIndex: 99999,
                display: 'block',
                width: '280px',
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                <div className="dropdown-glass-bg"></div>
                <div className="dropdown-content">
                  <div className="dropdown-header">
                    <div className="dropdown-header-title">Logged in as</div>
                    <div className="dropdown-header-email">{adminData?.email || 'admin@test.com'}</div>
                    <div className="dropdown-header-time">
                      Since: {adminData?.loginTime ? new Date(adminData.loginTime).toLocaleString() : 'Now'}
                    </div>
                    <div style={{color: 'yellow', fontSize: '12px', marginTop: '8px'}}>
                      DEBUG: Dropdown is {showProfileMenu ? 'OPEN' : 'CLOSED'}
                    </div>
                  </div>
                  
                  <div className="dropdown-menu">
                    <button className="dropdown-menu-item">
                      <svg className="menu-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="menu-item-text">Profile Settings</span>
                    </button>
                    
                    <button className="dropdown-menu-item">
                      <svg className="menu-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="menu-item-text">Activity Log</span>
                    </button>
                    
                    <div className="dropdown-divider"></div>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Logout button clicked');
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="dropdown-menu-item logout-item"
                      style={{
                        backgroundColor: 'rgba(255, 95, 87, 0.2)',
                        border: '1px solid rgba(255, 95, 87, 0.5)'
                      }}
                    >
                      <svg className="menu-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="menu-item-text">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}