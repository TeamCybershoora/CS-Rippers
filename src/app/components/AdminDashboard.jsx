'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import DashboardOverview from './admin/DashboardOverview';
import UserManagement from './admin/UserManagement';
import ThemeManagement from './admin/ThemeManagement';
import EventManagement from './admin/EventManagement';
import LeaderboardManagement from './admin/LeaderboardManagement';

export default function AdminDashboard({ adminData, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    users: { analytics: {}, users: [] },
    events: { analytics: {}, events: [] },
    leaderboard: { analytics: {}, leaderboard: [] },
    themes: { currentSettings: {}, availableThemes: {} }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    
    try {
      // Load all dashboard data in parallel
      const [usersRes, eventsRes, leaderboardRes, themesRes] = await Promise.all([
        fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/events', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/leaderboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/themes', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const [usersData, eventsData, leaderboardData, themesData] = await Promise.all([
        usersRes.json(),
        eventsRes.json(),
        leaderboardRes.json(),
        themesRes.json()
      ]);

      setDashboardData({
        users: usersData.success ? usersData.data : { analytics: {}, users: [] },
        events: eventsData.success ? eventsData.data : { analytics: {}, events: [] },
        leaderboard: leaderboardData.success ? leaderboardData.data : { analytics: {}, leaderboard: [] },
        themes: themesData.success ? themesData.data : { currentSettings: {}, availableThemes: {} }
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadDashboardData();
  };

  const renderActiveComponent = () => {
    const commonProps = {
      data: dashboardData[activeTab] || {},
      onRefresh: refreshData,
      loading
    };

    switch (activeTab) {
      case 'overview':
        return <DashboardOverview dashboardData={dashboardData} loading={loading} onRefresh={refreshData} />;
      case 'users':
        return <UserManagement {...commonProps} />;
      case 'themes':
        return <ThemeManagement {...commonProps} />;
      case 'events':
        return <EventManagement {...commonProps} />;
      case 'leaderboard':
        return <LeaderboardManagement {...commonProps} />;
      default:
        return <DashboardOverview dashboardData={dashboardData} loading={loading} onRefresh={refreshData} />;
    }
  };

  return (
    <div className="min-h-screen macos-admin-desktop">
      {/* macOS-style Background with Liquid Glass Effect */}
      <div className="macos-admin-bg">
        <div className="liquid-glass-overlay"></div>
        <div className="floating-particles">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>
      </div>

      {/* macOS Admin Window Container */}
      <div className="macos-admin-window">
        {/* macOS Window Controls */}
        <div className="macos-window-controls">
          <div className="window-control close"></div>
          <div className="window-control minimize"></div>
          <div className="window-control maximize"></div>
          <div className="window-title">
            <span className="window-title-text">CS Rippers Admin Panel</span>
          </div>
        </div>

        {/* Admin Content Container */}
        <div className="admin-content-container">
          {/* Liquid Glass Sidebar */}
          <AdminSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />

          {/* Main Content Area */}
          <div className={`admin-main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            {/* Liquid Glass Header */}
            <AdminHeader
              adminData={adminData}
              onLogout={onLogout}
              onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
              sidebarCollapsed={sidebarCollapsed}
            />

            {/* Content Area with Liquid Glass */}
            <main className="admin-content-area">
              <div className="content-wrapper">
                <div className="liquid-glass-content">
                  {renderActiveComponent()}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}