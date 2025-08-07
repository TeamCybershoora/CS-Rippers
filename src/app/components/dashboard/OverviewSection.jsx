"use client";
import { useState, useEffect } from 'react';

export default function OverviewSection({ userProfile }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const recentActivities = [
    {
      id: 1,
      type: 'hackathon',
      title: 'Submitted solution for AI Challenge 2024',
      time: '2 hours ago',
      icon: '🏆',
      status: 'completed'
    },
    {
      id: 2,
      type: 'task',
      title: 'Completed React Advanced Components task',
      time: '5 hours ago',
      icon: '✅',
      status: 'completed'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Earned "Code Master" badge',
      time: '1 day ago',
      icon: '🎖️',
      status: 'achievement'
    },
    {
      id: 4,
      type: 'member',
      title: 'New team member joined your project',
      time: '2 days ago',
      icon: '👥',
      status: 'info'
    }
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: 'Machine Learning Project',
      dueDate: '2024-04-15',
      priority: 'high',
      progress: 75
    },
    {
      id: 2,
      title: 'Web Development Assignment',
      dueDate: '2024-04-18',
      priority: 'medium',
      progress: 45
    },
    {
      id: 3,
      title: 'Database Design Task',
      dueDate: '2024-04-20',
      priority: 'low',
      progress: 20
    }
  ];

  const quickStats = [
    {
      label: 'Active Projects',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: '📊'
    },
    {
      label: 'Team Members',
      value: '24',
      change: '+3',
      trend: 'up',
      icon: '👥'
    },
    {
      label: 'Completed Tasks',
      value: '156',
      change: '+12',
      trend: 'up',
      icon: '✅'
    },
    {
      label: 'Success Rate',
      value: '94%',
      change: '+5%',
      trend: 'up',
      icon: '🎯'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'achievement': return '#8B5CF6';
      case 'info': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  return (
    <div className="overview-section">
      {/* Welcome Header */}
      <div className="welcome-header">
        <div className="welcome-content">
          <div className="welcome-text">
            <h1>Welcome back, {userProfile.name}! 👋</h1>
            <p>Here's what's happening with your projects today.</p>
            <div className="current-time">
              {currentTime.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
          <div className="welcome-avatar">
            <img src={userProfile.avatar} alt={userProfile.name} />
            <div className="status-ring"></div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats-grid">
        {quickStats.map((stat, index) => (
          <div key={index} className="stat-card floating">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className={`stat-change ${stat.trend}`}>
                {stat.trend === 'up' ? '↗' : '↘'} {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="overview-grid">
        {/* Recent Activities */}
        <div className="activity-section liquid-glass">
          <div className="section-header">
            <h3>Recent Activities</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="activity-list">
            {recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon" style={{ backgroundColor: getStatusColor(activity.status) + '20' }}>
                  {activity.icon}
                </div>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-time">{activity.time}</div>
                </div>
                <div className={`activity-status ${activity.status}`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="deadlines-section liquid-glass">
          <div className="section-header">
            <h3>Upcoming Deadlines</h3>
            <button className="add-btn-small">+ Add</button>
          </div>
          <div className="deadlines-list">
            {upcomingDeadlines.map(deadline => (
              <div key={deadline.id} className="deadline-item">
                <div className="deadline-header">
                  <div className="deadline-title">{deadline.title}</div>
                  <div 
                    className="deadline-priority"
                    style={{ color: getPriorityColor(deadline.priority) }}
                  >
                    {deadline.priority}
                  </div>
                </div>
                <div className="deadline-date">
                  Due: {new Date(deadline.dueDate).toLocaleDateString()}
                </div>
                <div className="deadline-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${deadline.progress}%`,
                        backgroundColor: getPriorityColor(deadline.priority)
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">{deadline.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        <div className="performance-chart liquid-glass">
          <div className="section-header">
            <h3>Performance Overview</h3>
            <select className="time-filter">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="chart-container">
            <div className="chart-bars">
              <div className="chart-bar" style={{ height: '60%' }}>
                <div className="bar-value">60</div>
                <div className="bar-label">Mon</div>
              </div>
              <div className="chart-bar" style={{ height: '75%' }}>
                <div className="bar-value">75</div>
                <div className="bar-label">Tue</div>
              </div>
              <div className="chart-bar" style={{ height: '90%' }}>
                <div className="bar-value">90</div>
                <div className="bar-label">Wed</div>
              </div>
              <div className="chart-bar" style={{ height: '85%' }}>
                <div className="bar-value">85</div>
                <div className="bar-label">Thu</div>
              </div>
              <div className="chart-bar" style={{ height: '95%' }}>
                <div className="bar-value">95</div>
                <div className="bar-label">Fri</div>
              </div>
              <div className="chart-bar" style={{ height: '70%' }}>
                <div className="bar-value">70</div>
                <div className="bar-label">Sat</div>
              </div>
              <div className="chart-bar" style={{ height: '80%' }}>
                <div className="bar-value">80</div>
                <div className="bar-label">Sun</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions liquid-glass">
          <div className="section-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="actions-grid">
            <button className="action-card">
              <div className="action-icon">📝</div>
              <div className="action-label">Create Task</div>
            </button>
            <button className="action-card">
              <div className="action-icon">👥</div>
              <div className="action-label">Add Member</div>
            </button>
            <button className="action-card">
              <div className="action-icon">🏆</div>
              <div className="action-label">Join Hackathon</div>
            </button>
            <button className="action-card">
              <div className="action-icon">📊</div>
              <div className="action-label">View Analytics</div>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .overview-section {
          padding: 0;
        }

        .welcome-header {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border: 1px solid rgba(102, 126, 234, 0.2);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 32px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
        }

        .welcome-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.05),
            transparent
          );
          transition: left 0.8s ease;
        }

        .welcome-header:hover::before {
          left: 100%;
        }

        .welcome-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .welcome-text h1 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 700;
          color: #ffffff;
        }

        .welcome-text p {
          margin: 0 0 12px 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: 16px;
        }

        .current-time {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          font-family: monospace;
        }

        .welcome-avatar {
          position: relative;
          width: 80px;
          height: 80px;
        }

        .welcome-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(102, 126, 234, 0.3);
        }

        .status-ring {
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          border: 2px solid transparent;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 3s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .quick-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: rgba(15, 15, 15, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.03),
            transparent
          );
          transition: left 0.6s ease;
        }

        .stat-card:hover::before {
          left: 100%;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(102, 126, 234, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          position: relative;
          overflow: hidden;
        }

        .stat-icon::before {
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
          transition: left 0.5s ease;
        }

        .stat-icon:hover::before {
          left: 100%;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 4px;
        }

        .stat-change {
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .stat-change.up {
          color: #10B981;
        }

        .stat-change.down {
          color: #EF4444;
        }

        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
        }

        .liquid-glass {
          background: rgba(15, 15, 15, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .liquid-glass::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.03),
            transparent
          );
          transition: left 0.6s ease;
        }

        .liquid-glass:hover::before {
          left: 100%;
        }

        .liquid-glass:hover {
          transform: translateY(-2px);
          border-color: rgba(102, 126, 234, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
        }

        .view-all-btn,
        .add-btn-small {
          padding: 6px 12px;
          background: rgba(102, 126, 234, 0.2);
          border: 1px solid rgba(102, 126, 234, 0.3);
          border-radius: 6px;
          color: #667eea;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-all-btn:hover,
        .add-btn-small:hover {
          background: rgba(102, 126, 234, 0.3);
          transform: scale(1.05);
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.2s ease;
        }

        .activity-item:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateX(4px);
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .activity-content {
          flex: 1;
        }

        .activity-title {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2px;
        }

        .activity-time {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        .activity-status {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .activity-status.completed {
          background: #10B981;
        }

        .activity-status.achievement {
          background: #8B5CF6;
        }

        .activity-status.info {
          background: #3B82F6;
        }

        .deadlines-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .deadline-item {
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.2s ease;
        }

        .deadline-item:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: scale(1.02);
        }

        .deadline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .deadline-title {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
        }

        .deadline-priority {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .deadline-date {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 12px;
        }

        .deadline-progress {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .progress-bar {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
          min-width: 35px;
          text-align: right;
        }

        .chart-container {
          height: 200px;
          display: flex;
          align-items: end;
          justify-content: center;
        }

        .chart-bars {
          display: flex;
          align-items: end;
          gap: 12px;
          height: 100%;
          width: 100%;
          justify-content: space-around;
        }

        .chart-bar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px 4px 0 0;
          min-height: 20px;
          width: 32px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
        }

        .chart-bar:hover {
          transform: scale(1.1);
          filter: brightness(1.2);
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
        }

        .bar-value {
          color: #ffffff;
          font-size: 10px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .bar-label {
          position: absolute;
          bottom: -20px;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
        }

        .time-filter {
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
          cursor: pointer;
        }

        .time-filter option {
          background: #1a1a1a;
          color: #ffffff;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .action-card {
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .action-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(102, 126, 234, 0.3);
          transform: translateY(-2px);
        }

        .action-icon {
          font-size: 24px;
        }

        .action-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .welcome-content {
            flex-direction: column;
            text-align: center;
            gap: 20px;
          }

          .quick-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .overview-grid {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .chart-bars {
            gap: 8px;
          }

          .chart-bar {
            width: 24px;
          }
        }
      `}</style>
    </div>
  );
}