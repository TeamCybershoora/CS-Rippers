"use client";
import { useState } from 'react';

export default function AchievementsSection() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const achievements = [
    {
      id: 1,
      title: 'Code Master',
      description: 'Completed 100+ coding challenges across multiple platforms',
      icon: '🏆',
      category: 'Coding',
      rarity: 'legendary',
      points: 500,
      unlockedDate: '2024-03-15',
      progress: 100,
      requirements: [
        { text: 'Complete 100 coding challenges', completed: true },
        { text: 'Achieve 90%+ success rate', completed: true },
        { text: 'Master 5 different languages', completed: true }
      ],
      stats: {
        challengesCompleted: 127,
        successRate: 94,
        languagesMastered: 6
      }
    },
    {
      id: 2,
      title: 'Team Player',
      description: 'Successfully collaborated on 10+ team projects',
      icon: '👥',
      category: 'Collaboration',
      rarity: 'epic',
      points: 300,
      unlockedDate: '2024-02-28',
      progress: 100,
      requirements: [
        { text: 'Complete 10 team projects', completed: true },
        { text: 'Maintain 4.5+ team rating', completed: true },
        { text: 'Lead at least 3 projects', completed: true }
      ],
      stats: {
        projectsCompleted: 12,
        teamRating: 4.8,
        projectsLed: 4
      }
    },
    {
      id: 3,
      title: 'Innovation Pioneer',
      description: 'Created groundbreaking solutions in hackathons',
      icon: '💡',
      category: 'Innovation',
      rarity: 'legendary',
      points: 750,
      unlockedDate: '2024-04-01',
      progress: 100,
      requirements: [
        { text: 'Win 3 hackathons', completed: true },
        { text: 'Create 5 innovative projects', completed: true },
        { text: 'Receive innovation award', completed: true }
      ],
      stats: {
        hackathonsWon: 4,
        innovativeProjects: 7,
        innovationAwards: 2
      }
    },
    {
      id: 4,
      title: 'Speed Demon',
      description: 'Complete tasks with exceptional speed and accuracy',
      icon: '⚡',
      category: 'Performance',
      rarity: 'rare',
      points: 200,
      unlockedDate: '2024-01-20',
      progress: 100,
      requirements: [
        { text: 'Complete 50 tasks ahead of deadline', completed: true },
        { text: 'Maintain 95%+ accuracy', completed: true },
        { text: 'Average completion time < 80% of estimate', completed: true }
      ],
      stats: {
        tasksAheadOfDeadline: 67,
        accuracyRate: 97,
        avgCompletionRatio: 0.72
      }
    },
    {
      id: 5,
      title: 'Mentor Master',
      description: 'Guide and inspire fellow developers',
      icon: '🎓',
      category: 'Leadership',
      rarity: 'epic',
      points: 400,
      unlockedDate: '2024-03-10',
      progress: 100,
      requirements: [
        { text: 'Mentor 20+ developers', completed: true },
        { text: 'Achieve 4.8+ mentor rating', completed: true },
        { text: 'Create educational content', completed: true }
      ],
      stats: {
        developersMentored: 24,
        mentorRating: 4.9,
        contentCreated: 15
      }
    },
    {
      id: 6,
      title: 'Bug Hunter',
      description: 'Expert at finding and fixing critical bugs',
      icon: '🐛',
      category: 'Quality',
      rarity: 'rare',
      points: 250,
      unlockedDate: '2024-02-15',
      progress: 100,
      requirements: [
        { text: 'Find 100+ bugs', completed: true },
        { text: 'Fix 95% of found bugs', completed: true },
        { text: 'Prevent 10+ critical issues', completed: true }
      ],
      stats: {
        bugsFound: 134,
        bugsFixed: 128,
        criticalIssuesPrevented: 12
      }
    },
    {
      id: 7,
      title: 'Full Stack Warrior',
      description: 'Master both frontend and backend development',
      icon: '⚔️',
      category: 'Technical',
      rarity: 'epic',
      points: 350,
      unlockedDate: '2024-01-05',
      progress: 100,
      requirements: [
        { text: 'Complete 5 full-stack projects', completed: true },
        { text: 'Master 3+ frontend frameworks', completed: true },
        { text: 'Master 3+ backend technologies', completed: true }
      ],
      stats: {
        fullStackProjects: 8,
        frontendFrameworks: 4,
        backendTechnologies: 5
      }
    },
    {
      id: 8,
      title: 'Community Builder',
      description: 'Active contributor to developer community',
      icon: '🌟',
      category: 'Community',
      rarity: 'rare',
      points: 300,
      unlockedDate: '2024-03-25',
      progress: 85,
      requirements: [
        { text: 'Make 50+ community contributions', completed: true },
        { text: 'Organize 5+ community events', completed: false },
        { text: 'Help 100+ developers', completed: true }
      ],
      stats: {
        communityContributions: 67,
        eventsOrganized: 3,
        developersHelped: 142
      }
    }
  ];

  const categories = ['all', 'coding', 'collaboration', 'innovation', 'performance', 'leadership', 'quality', 'technical', 'community'];
  const rarities = ['common', 'rare', 'epic', 'legendary'];

  const filteredAchievements = achievements.filter(achievement => {
    if (activeFilter === 'all') return true;
    return achievement.category.toLowerCase() === activeFilter;
  });

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return '#FFD700';
      case 'epic': return '#9333EA';
      case 'rare': return '#3B82F6';
      case 'common': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'coding': return '💻';
      case 'collaboration': return '🤝';
      case 'innovation': return '🚀';
      case 'performance': return '📈';
      case 'leadership': return '👑';
      case 'quality': return '✨';
      case 'technical': return '🔧';
      case 'community': return '🌍';
      default: return '🏅';
    }
  };

  const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0);
  const completedAchievements = achievements.filter(a => a.progress === 100).length;

  return (
    <div className="achievements-section">
      <div className="section-header">
        <div className="header-left">
          <h2>Achievements & Badges</h2>
          <p>Track your progress and celebrate your accomplishments</p>
        </div>
        <div className="header-actions">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              ⊞
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="achievement-stats">
        <div className="stat-item">
          <span className="stat-number">{achievements.length}</span>
          <span className="stat-label">Total Achievements</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{completedAchievements}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{totalPoints.toLocaleString()}</span>
          <span className="stat-label">Total Points</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{Math.round((completedAchievements / achievements.length) * 100)}%</span>
          <span className="stat-label">Completion Rate</span>
        </div>
      </div>

      {/* Category Filters */}
      <div className="filter-section">
        <div className="filter-buttons">
          {categories.map(category => (
            <button 
              key={category}
              className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
              onClick={() => setActiveFilter(category)}
            >
              {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
              {category === 'all' ? ` (${achievements.length})` : ` (${achievements.filter(a => a.category.toLowerCase() === category).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Content */}
      {viewMode === 'grid' ? (
        <div className="achievements-grid">
          {filteredAchievements.map(achievement => (
            <div key={achievement.id} className="achievement-card liquid-glass">
              <div className="achievement-header">
                <div className="achievement-icon-wrapper">
                  <div 
                    className="achievement-icon"
                    style={{ 
                      background: `linear-gradient(135deg, ${getRarityColor(achievement.rarity)}20 0%, ${getRarityColor(achievement.rarity)}40 100%)`,
                      border: `2px solid ${getRarityColor(achievement.rarity)}60`
                    }}
                  >
                    {achievement.icon}
                  </div>
                  <div className="rarity-glow" style={{ backgroundColor: getRarityColor(achievement.rarity) }}></div>
                </div>
                <div className="achievement-meta">
                  <span 
                    className="rarity-badge"
                    style={{ 
                      backgroundColor: getRarityColor(achievement.rarity) + '20',
                      color: getRarityColor(achievement.rarity)
                    }}
                  >
                    {achievement.rarity}
                  </span>
                  <span className="points-badge">+{achievement.points} pts</span>
                </div>
              </div>

              <div className="achievement-content">
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
                
                {achievement.progress < 100 ? (
                  <div className="achievement-progress">
                    <div className="progress-header">
                      <span>Progress</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${achievement.progress}%`,
                          backgroundColor: getRarityColor(achievement.rarity)
                        }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="achievement-completed">
                    <span className="completed-icon">✅</span>
                    <span>Unlocked on {new Date(achievement.unlockedDate).toLocaleDateString()}</span>
                  </div>
                )}

                <div className="achievement-requirements">
                  <h4>Requirements:</h4>
                  <ul>
                    {achievement.requirements.map((req, index) => (
                      <li key={index} className={req.completed ? 'completed' : 'pending'}>
                        <span className="req-icon">{req.completed ? '✅' : '⏳'}</span>
                        {req.text}
                      </li>
                    ))}
                  </ul>
                </div>

                {achievement.stats && (
                  <div className="achievement-stats-detail">
                    <h4>Your Stats:</h4>
                    <div className="stats-grid">
                      {Object.entries(achievement.stats).map(([key, value]) => (
                        <div key={key} className="stat-detail">
                          <span className="stat-value">{typeof value === 'number' && value < 1 ? Math.round(value * 100) + '%' : value}</span>
                          <span className="stat-key">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="achievement-footer">
                <div className="category-tag">
                  {getCategoryIcon(achievement.category)} {achievement.category}
                </div>
                <button className="view-details-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="achievements-list">
          {filteredAchievements.map(achievement => (
            <div key={achievement.id} className="achievement-list-item liquid-glass">
              <div className="list-item-main">
                <div className="list-item-icon">
                  <div 
                    className="achievement-icon small"
                    style={{ 
                      background: `linear-gradient(135deg, ${getRarityColor(achievement.rarity)}20 0%, ${getRarityColor(achievement.rarity)}40 100%)`,
                      border: `2px solid ${getRarityColor(achievement.rarity)}60`
                    }}
                  >
                    {achievement.icon}
                  </div>
                </div>
                <div className="list-item-content">
                  <div className="list-item-header">
                    <h3>{achievement.title}</h3>
                    <div className="list-item-badges">
                      <span 
                        className="rarity-badge"
                        style={{ 
                          backgroundColor: getRarityColor(achievement.rarity) + '20',
                          color: getRarityColor(achievement.rarity)
                        }}
                      >
                        {achievement.rarity}
                      </span>
                      <span className="points-badge">+{achievement.points} pts</span>
                      <span className="category-badge">
                        {getCategoryIcon(achievement.category)} {achievement.category}
                      </span>
                    </div>
                  </div>
                  <p className="list-item-description">{achievement.description}</p>
                  <div className="list-item-meta">
                    {achievement.progress === 100 ? (
                      <span className="completion-status completed">
                        ✅ Completed on {new Date(achievement.unlockedDate).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="completion-status in-progress">
                        ⏳ {achievement.progress}% Complete
                      </span>
                    )}
                  </div>
                </div>
                <div className="list-item-actions">
                  <button className="action-btn">View Details</button>
                  {achievement.progress < 100 && (
                    <button className="action-btn primary">Continue Progress</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredAchievements.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏆</div>
          <h3>No achievements found</h3>
          <p>Try selecting a different category or start working on new achievements!</p>
        </div>
      )}

      <style jsx>{`
        .achievements-section {
          padding: 0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .header-left h2 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
        }

        .header-left p {
          margin: 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: 16px;
          font-weight: 500;
        }

        .header-actions {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .view-toggle {
          display: flex;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 4px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .view-btn {
          padding: 8px 12px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s ease;
          font-size: 16px;
        }

        .view-btn.active,
        .view-btn:hover {
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
        }

        .achievement-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-item {
          background: rgba(15, 15, 15, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .stat-item:hover {
          transform: translateY(-2px);
          border-color: rgba(102, 126, 234, 0.3);
        }

        .stat-number {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-section {
          margin-bottom: 32px;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .filter-btn.active {
          background: rgba(102, 126, 234, 0.2);
          border-color: rgba(102, 126, 234, 0.3);
          color: #667eea;
        }

        .filter-btn:hover:not(.active) {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.9);
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
        }

        .achievement-card {
          padding: 24px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .achievement-card:hover {
          transform: translateY(-4px);
        }

        .achievement-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .achievement-icon-wrapper {
          position: relative;
        }

        .achievement-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          position: relative;
          z-index: 2;
        }

        .achievement-icon.small {
          width: 40px;
          height: 40px;
          font-size: 18px;
        }

        .rarity-glow {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 50%;
          opacity: 0.3;
          filter: blur(8px);
          z-index: 1;
        }

        .achievement-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: flex-end;
        }

        .rarity-badge,
        .points-badge,
        .category-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .points-badge {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }

        .category-badge {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
        }

        .achievement-content h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
        }

        .achievement-content p {
          margin: 0 0 16px 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          line-height: 1.5;
        }

        .achievement-progress {
          margin-bottom: 16px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        .progress-bar {
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

        .achievement-completed {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          padding: 8px 12px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 8px;
          font-size: 12px;
          color: #10b981;
        }

        .achievement-requirements {
          margin-bottom: 16px;
        }

        .achievement-requirements h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
        }

        .achievement-requirements ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .achievement-requirements li {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 0;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        .achievement-requirements li.completed {
          color: #10b981;
        }

        .req-icon {
          font-size: 10px;
        }

        .achievement-stats-detail {
          margin-bottom: 16px;
        }

        .achievement-stats-detail h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
          gap: 8px;
        }

        .stat-detail {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
        }

        .stat-value {
          font-size: 14px;
          font-weight: 600;
          color: #667eea;
        }

        .stat-key {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
        }

        .achievement-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 16px;
        }

        .category-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        .view-details-btn,
        .action-btn {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-details-btn:hover,
        .action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 1);
          transform: scale(1.05);
        }

        .action-btn.primary {
          background: rgba(102, 126, 234, 0.2);
          border-color: rgba(102, 126, 234, 0.3);
          color: #667eea;
        }

        .action-btn.primary:hover {
          background: rgba(102, 126, 234, 0.3);
        }

        .achievements-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .achievement-list-item {
          padding: 20px;
        }

        .list-item-main {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .list-item-content {
          flex: 1;
        }

        .list-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .list-item-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
        }

        .list-item-badges {
          display: flex;
          gap: 8px;
        }

        .list-item-description {
          margin: 0 0 12px 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
        }

        .list-item-meta {
          font-size: 12px;
        }

        .completion-status.completed {
          color: #10b981;
        }

        .completion-status.in-progress {
          color: #f59e0b;
        }

        .list-item-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-shrink: 0;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: rgba(255, 255, 255, 0.6);
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
          color: rgba(255, 255, 255, 0.8);
        }

        .empty-state p {
          margin: 0;
          font-size: 14px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .section-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .header-actions {
            justify-content: center;
          }

          .achievement-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .achievements-grid {
            grid-template-columns: 1fr;
          }

          .filter-buttons {
            justify-content: center;
            flex-wrap: wrap;
          }

          .list-item-main {
            flex-direction: column;
            gap: 12px;
          }

          .list-item-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .list-item-actions {
            flex-direction: row;
            justify-content: center;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}