"use client";
import { useState } from 'react';

export default function Sidebar({ activeTab, setActiveTab, onLogout, userProfile, onSidebarToggle }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'hackathons', icon: '🏆', label: 'Hackathons' },
    { id: 'tasks', icon: '📋', label: 'Tasks' },
    { id: 'achievements', icon: '🎖️', label: 'Achievements' },
    { id: 'analytics', icon: '📈', label: 'Analytics' }
  ];

  // Check if user is admin
  const isAdmin = userProfile?.email === 'teamcybershoora@gmail.com';

  const handleAdminPanelClick = () => {
    window.open('/admin', '_blank');
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-section">
          <div className="logo-icon">🎯</div>
          {!isCollapsed && <h2>CS Rippers</h2>}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => {
            setIsCollapsed(!isCollapsed);
            onSidebarToggle && onSidebarToggle(!isCollapsed);
          }}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        {navigationItems.map(item => (
          <button 
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            title={isCollapsed ? item.label : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {!isCollapsed && item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="user-info">
            <div className="user-avatar-small">
              <img src={userProfile.avatar} alt="User" />
              <div className="status-dot"></div>
            </div>
            <div className="user-details">
              <span className="user-name">{userProfile.name}</span>
              <span className="user-role">{userProfile.role}</span>
            </div>
          </div>
        )}
        
        {/* Admin Panel Button - Only show for admin */}
        {isAdmin && (
          <button onClick={handleAdminPanelClick} className="admin-btn" title="Admin Panel">
            <span className="nav-icon">⚙️</span>
            {!isCollapsed && 'Admin Panel'}
          </button>
        )}
        
        <button onClick={onLogout} className="logout-btn" title="Logout">
          <span className="nav-icon">🚪</span>
          {!isCollapsed && 'Logout'}
        </button>
      </div>

      <style jsx>{`
        .sidebar {
          width: ${isCollapsed ? '80px' : '280px'};
          background: rgba(8, 8, 8, 0.85);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 100;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          box-shadow: 
            inset -1px 0 0 rgba(255, 255, 255, 0.05),
            4px 0 24px rgba(0, 0, 0, 0.3);
        }

        .sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            180deg,
            rgba(102, 126, 234, 0.03) 0%,
            rgba(118, 75, 162, 0.02) 50%,
            rgba(16, 185, 129, 0.01) 100%
          );
          pointer-events: none;
        }

        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 88px;
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.02);
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: hidden;
        }

        .logo-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #10b981 100%);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 
            0 4px 16px rgba(102, 126, 234, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .logo-icon::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left 0.6s ease;
        }

        .logo-icon:hover {
          transform: scale(1.1) rotate(8deg);
          box-shadow: 
            0 8px 24px rgba(102, 126, 234, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .logo-icon:hover::before {
          left: 100%;
        }

        .logo-section h2 {
          margin: 0;
          font-size: 22px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          white-space: nowrap;
          opacity: ${isCollapsed ? '0' : '1'};
          transition: opacity 0.4s ease;
          letter-spacing: -0.5px;
        }

        .collapse-btn {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .collapse-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
          transform: scale(1.1);
        }

        .sidebar-nav {
          flex: 1;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 16px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.75);
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: left;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
          justify-content: ${isCollapsed ? 'center' : 'flex-start'};
          margin: 2px 0;
        }

        .nav-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(102, 126, 234, 0.1),
            transparent
          );
          transition: left 0.4s ease;
        }

        .nav-item:hover::before {
          left: 100%;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.95);
          transform: ${isCollapsed ? 'scale(1.1)' : 'translateX(6px)'};
          box-shadow: 
            0 4px 16px rgba(102, 126, 234, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .nav-item.active {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.2) 100%);
          color: #ffffff;
          border: 1px solid rgba(102, 126, 234, 0.4);
          box-shadow: 
            0 8px 24px rgba(102, 126, 234, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            0 0 0 1px rgba(102, 126, 234, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .nav-item.active::after {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: #667eea;
          border-radius: 0 2px 2px 0;
        }

        .nav-icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .nav-item:hover .nav-icon {
          transform: scale(1.2);
        }

        .sidebar-footer {
          padding: 24px 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          opacity: ${isCollapsed ? '0' : '1'};
          transition: opacity 0.3s ease;
        }

        .user-avatar-small {
          position: relative;
          width: 36px;
          height: 36px;
          flex-shrink: 0;
        }

        .user-avatar-small img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(102, 126, 234, 0.3);
        }

        .status-dot {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 10px;
          height: 10px;
          background: #10b981;
          border-radius: 50%;
          border: 2px solid rgba(15, 15, 15, 0.95);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .user-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow: hidden;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          position: relative;
          overflow: hidden;
          justify-content: ${isCollapsed ? 'center' : 'flex-start'};
        }

        .logout-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(239, 68, 68, 0.1),
            transparent
          );
          transition: left 0.4s ease;
        }

        .logout-btn:hover::before {
          left: 100%;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
        }

        .admin-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(102, 126, 234, 0.2);
          color: #667eea;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          position: relative;
          overflow: hidden;
          justify-content: ${isCollapsed ? 'center' : 'flex-start'};
          margin-bottom: 8px;
        }

        .admin-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(102, 126, 234, 0.1),
            transparent
          );
          transition: left 0.4s ease;
        }

        .admin-btn:hover::before {
          left: 100%;
        }

        .admin-btn:hover {
          background: rgba(102, 126, 234, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
        }

        /* Scrollbar Styling */
        .sidebar-nav::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-nav::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-nav::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }

        .sidebar-nav::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .sidebar {
            width: ${isCollapsed ? '0' : '280px'};
            transform: translateX(${isCollapsed ? '-100%' : '0'});
            z-index: 1000;
          }
          
          .sidebar-header {
            padding: 16px;
          }
          
          .sidebar-nav {
            padding: 16px 12px;
          }
          
          .nav-item {
            padding: 12px 16px;
            font-size: 14px;
          }
          
          .sidebar-footer {
            padding: 16px 12px;
          }
        }

        @media (max-width: 480px) {
          .sidebar {
            width: ${isCollapsed ? '0' : '100vw'};
          }
          
          .logo-section h2 {
            font-size: 18px;
          }
          
          .nav-item {
            padding: 14px 20px;
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
}