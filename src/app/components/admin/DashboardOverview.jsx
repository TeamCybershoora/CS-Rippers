'use client';

import { useState, useEffect } from 'react';

export default function DashboardOverview({ dashboardData, loading, onRefresh }) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  const StatCard = ({ title, value, change, icon, color = 'blue' }) => (
    <div className="stat-card">
      <div className="stat-card-bg"></div>
      <div className="stat-card-content">
        <div className="stat-info">
          <p className="stat-title">{title}</p>
          <div className="stat-value">
            {loading ? (
              <div className="stat-loading">
                <div className="loading-shimmer"></div>
              </div>
            ) : (
              <span className="stat-number">{value}</span>
            )}
          </div>
          {change && (
            <p className={`stat-change ${change >= 0 ? 'stat-change-positive' : 'stat-change-negative'}`}>
              <span className="change-indicator">{change >= 0 ? '↗' : '↘'}</span>
              {Math.abs(change)}% from last month
            </p>
          )}
        </div>
        <div className={`stat-icon stat-icon-${color}`}>
          <div className="icon-glow"></div>
          {icon}
        </div>
      </div>
      <div className="stat-card-glow"></div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon, onClick, color = 'blue' }) => (
    <button
      onClick={onClick}
      className="liquid-glass-button quick-action-card"
    >
      <div className="action-card-bg"></div>
      <div className="action-card-content">
        <div className={`action-icon action-icon-${color}`}>
          <div className="action-icon-glow"></div>
          {icon}
        </div>
        <div className="action-info">
          <h3 className="action-title">{title}</h3>
          <p className="action-description">{description}</p>
        </div>
      </div>
    </button>
  );

  const RecentActivity = ({ activities }) => (
    <div className="liquid-glass-card activity-card">
      <div className="activity-card-bg"></div>
      <div className="activity-card-content">
        <h3 className="activity-title">Recent Activity</h3>
        <div className="activity-list">
          {activities.map((activity, index) => (
            <div key={index} className="activity-item" style={{ '--item-index': index }}>
              <div className="activity-item-bg"></div>
              <div className="activity-item-content">
                <div className={`activity-indicator activity-indicator-${activity.color}`}>
                  <div className="indicator-pulse"></div>
                </div>
                <div className="activity-details">
                  <p className="activity-message">{activity.message}</p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Mock recent activities (in real app, this would come from API)
  const recentActivities = [
    { message: 'New user registered: john@example.com', time: '2 minutes ago', color: 'green' },
    { message: 'Event "React Hackathon" was updated', time: '15 minutes ago', color: 'blue' },
    { message: 'Theme changed to macOS Ventura', time: '1 hour ago', color: 'purple' },
    { message: 'User score updated for leaderboard', time: '2 hours ago', color: 'yellow' },
    { message: 'New event created: "AI Challenge 2024"', time: '3 hours ago', color: 'green' }
  ];

  return (
    <div className="dashboard-overview">
      {/* Header Section */}
      <div className="dashboard-section">
        <div className="dashboard-header">
          <div className="header-info">
            <h1 className="section-title">Dashboard Overview</h1>
            <p className="section-subtitle">Welcome back! Here's what's happening with CS Rippers.</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`refresh-button ${refreshing ? 'refreshing' : ''}`}
          >
            <div className="refresh-button-bg"></div>
            <div className="refresh-button-content">
              <svg className="refresh-button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="refresh-button-text">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-section">
        <div className="dashboard-grid">
        <StatCard
          title="Total Users"
          value={dashboardData.users?.analytics?.totalUsers || 0}
          change={12}
          color="blue"
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          }
        />
        
        <StatCard
          title="Active Events"
          value={dashboardData.events?.analytics?.activeEvents || 0}
          change={8}
          color="green"
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        
        <StatCard
          title="Total Revenue"
          value={`₹${dashboardData.events?.analytics?.totalRevenue?.toLocaleString() || 0}`}
          change={15}
          color="purple"
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
        />
        
        <StatCard
          title="Leaderboard Participants"
          value={dashboardData.leaderboard?.analytics?.totalParticipants || 0}
          change={5}
          color="yellow"
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="dashboard-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="dashboard-grid">
          <QuickActionCard
            title="Create New Event"
            description="Add a new hackathon or competition"
            color="green"
            icon={
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          />
          
          <QuickActionCard
            title="Manage Users"
            description="View and moderate user accounts"
            color="blue"
            icon={
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            }
          />
          
          <QuickActionCard
            title="Update Theme"
            description="Customize platform appearance"
            color="purple"
            icon={
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Activity & Performance Section */}
      <div className="dashboard-section">
        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <RecentActivity activities={recentActivities} />
          
          <div className="liquid-glass-card performers-card">
            <div className="performers-card-bg"></div>
            <div className="performers-card-content">
              <h3 className="performers-title">Top Performers</h3>
              <div className="performers-list">
                {(dashboardData.leaderboard?.analytics?.topPerformers || []).slice(0, 5).map((user, index) => (
                  <div key={user._id} className="performer-item" style={{ '--item-index': index }}>
                    <div className="performer-item-bg"></div>
                    <div className="performer-item-content">
                      <div className={`performer-rank rank-${index + 1}`}>
                        <div className="rank-glow"></div>
                        <span className="rank-number">{index + 1}</span>
                      </div>
                      <div className="performer-details">
                        <p className="performer-name">{user.name || user.email}</p>
                        <p className="performer-score">{user.score} points</p>
                      </div>
                      <div className="performer-type">
                        {user.userType}
                      </div>
                    </div>
                  </div>
                ))}
                {(!dashboardData.leaderboard?.analytics?.topPerformers || dashboardData.leaderboard.analytics.topPerformers.length === 0) && (
                  <div className="no-data-message">
                    <div className="no-data-icon">
                      <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <p className="no-data-text">No leaderboard data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}