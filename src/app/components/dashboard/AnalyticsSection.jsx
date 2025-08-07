"use client";
import { useState } from 'react';

export default function AnalyticsSection() {
  const [timeRange, setTimeRange] = useState('month');
  const [activeMetric, setActiveMetric] = useState('performance');

  // Mock data for analytics
  const performanceData = {
    month: [
      { period: 'Week 1', value: 75, tasks: 12, points: 240 },
      { period: 'Week 2', value: 82, tasks: 15, points: 310 },
      { period: 'Week 3', value: 78, tasks: 13, points: 285 },
      { period: 'Week 4', value: 88, tasks: 18, points: 420 }
    ],
    quarter: [
      { period: 'Jan', value: 75, tasks: 45, points: 1200 },
      { period: 'Feb', value: 82, tasks: 52, points: 1450 },
      { period: 'Mar', value: 88, tasks: 58, points: 1680 }
    ],
    year: [
      { period: 'Q1', value: 78, tasks: 155, points: 4330 },
      { period: 'Q2', value: 85, tasks: 168, points: 4820 },
      { period: 'Q3', value: 82, tasks: 162, points: 4650 },
      { period: 'Q4', value: 90, tasks: 175, points: 5200 }
    ]
  };

  const skillsData = [
    { name: 'React', level: 92, growth: +8, category: 'Frontend' },
    { name: 'Node.js', level: 88, growth: +5, category: 'Backend' },
    { name: 'Python', level: 85, growth: +12, category: 'Programming' },
    { name: 'TypeScript', level: 90, growth: +6, category: 'Programming' },
    { name: 'MongoDB', level: 78, growth: +15, category: 'Database' },
    { name: 'Docker', level: 72, growth: +20, category: 'DevOps' },
    { name: 'AWS', level: 68, growth: +18, category: 'Cloud' },
    { name: 'GraphQL', level: 75, growth: +10, category: 'API' }
  ];

  const productivityMetrics = {
    tasksCompleted: { value: 156, change: +12, trend: 'up' },
    avgCompletionTime: { value: '2.3 days', change: -0.5, trend: 'down' },
    qualityScore: { value: 94, change: +3, trend: 'up' },
    collaborationScore: { value: 4.8, change: +0.2, trend: 'up' }
  };

  const activityHeatmap = [
    [0, 1, 2, 1, 3, 2, 1],
    [2, 3, 4, 2, 1, 3, 2],
    [1, 2, 3, 4, 3, 2, 1],
    [3, 4, 5, 3, 2, 4, 3],
    [2, 3, 2, 1, 4, 3, 2],
    [1, 2, 3, 2, 3, 4, 1],
    [0, 1, 2, 3, 2, 1, 0]
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getActivityColor = (intensity) => {
    const colors = [
      'rgba(255, 255, 255, 0.05)',
      'rgba(102, 126, 234, 0.2)',
      'rgba(102, 126, 234, 0.4)',
      'rgba(102, 126, 234, 0.6)',
      'rgba(102, 126, 234, 0.8)',
      'rgba(102, 126, 234, 1)'
    ];
    return colors[intensity] || colors[0];
  };

  const getSkillColor = (level) => {
    if (level >= 90) return '#10B981';
    if (level >= 75) return '#3B82F6';
    if (level >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️';
  };

  const currentData = performanceData[timeRange];

  return (
    <div className="analytics-section">
      <div className="section-header">
        <div className="header-left">
          <h2>Performance Analytics</h2>
          <p>Track your progress and identify areas for improvement</p>
        </div>
        <div className="header-actions">
          <div className="time-range-selector">
            <button 
              className={`range-btn ${timeRange === 'month' ? 'active' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              Month
            </button>
            <button 
              className={`range-btn ${timeRange === 'quarter' ? 'active' : ''}`}
              onClick={() => setTimeRange('quarter')}
            >
              Quarter
            </button>
            <button 
              className={`range-btn ${timeRange === 'year' ? 'active' : ''}`}
              onClick={() => setTimeRange('year')}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card liquid-glass">
          <div className="metric-header">
            <h3>Tasks Completed</h3>
            <span className={`trend-indicator ${productivityMetrics.tasksCompleted.trend}`}>
              {getTrendIcon(productivityMetrics.tasksCompleted.trend)}
            </span>
          </div>
          <div className="metric-value">{productivityMetrics.tasksCompleted.value}</div>
          <div className="metric-change">
            <span className={productivityMetrics.tasksCompleted.change > 0 ? 'positive' : 'negative'}>
              {productivityMetrics.tasksCompleted.change > 0 ? '+' : ''}{productivityMetrics.tasksCompleted.change} this {timeRange}
            </span>
          </div>
        </div>

        <div className="metric-card liquid-glass">
          <div className="metric-header">
            <h3>Avg Completion Time</h3>
            <span className={`trend-indicator ${productivityMetrics.avgCompletionTime.trend}`}>
              {getTrendIcon(productivityMetrics.avgCompletionTime.trend)}
            </span>
          </div>
          <div className="metric-value">{productivityMetrics.avgCompletionTime.value}</div>
          <div className="metric-change">
            <span className={productivityMetrics.avgCompletionTime.change < 0 ? 'positive' : 'negative'}>
              {productivityMetrics.avgCompletionTime.change > 0 ? '+' : ''}{productivityMetrics.avgCompletionTime.change} days
            </span>
          </div>
        </div>

        <div className="metric-card liquid-glass">
          <div className="metric-header">
            <h3>Quality Score</h3>
            <span className={`trend-indicator ${productivityMetrics.qualityScore.trend}`}>
              {getTrendIcon(productivityMetrics.qualityScore.trend)}
            </span>
          </div>
          <div className="metric-value">{productivityMetrics.qualityScore.value}%</div>
          <div className="metric-change">
            <span className={productivityMetrics.qualityScore.change > 0 ? 'positive' : 'negative'}>
              {productivityMetrics.qualityScore.change > 0 ? '+' : ''}{productivityMetrics.qualityScore.change}% this {timeRange}
            </span>
          </div>
        </div>

        <div className="metric-card liquid-glass">
          <div className="metric-header">
            <h3>Collaboration Score</h3>
            <span className={`trend-indicator ${productivityMetrics.collaborationScore.trend}`}>
              {getTrendIcon(productivityMetrics.collaborationScore.trend)}
            </span>
          </div>
          <div className="metric-value">{productivityMetrics.collaborationScore.value}/5</div>
          <div className="metric-change">
            <span className={productivityMetrics.collaborationScore.change > 0 ? 'positive' : 'negative'}>
              {productivityMetrics.collaborationScore.change > 0 ? '+' : ''}{productivityMetrics.collaborationScore.change} this {timeRange}
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container liquid-glass">
          <div className="chart-header">
            <h3>Performance Trend</h3>
            <div className="chart-legend">
              <span className="legend-item">
                <div className="legend-color performance"></div>
                Performance Score
              </span>
              <span className="legend-item">
                <div className="legend-color tasks"></div>
                Tasks Completed
              </span>
            </div>
          </div>
          <div className="chart-content">
            <div className="chart-bars">
              {currentData.map((item, index) => (
                <div key={index} className="chart-bar-group">
                  <div className="chart-bars-container">
                    <div 
                      className="chart-bar performance"
                      style={{ height: `${item.value}%` }}
                      title={`Performance: ${item.value}%`}
                    ></div>
                    <div 
                      className="chart-bar tasks"
                      style={{ height: `${(item.tasks / Math.max(...currentData.map(d => d.tasks))) * 100}%` }}
                      title={`Tasks: ${item.tasks}`}
                    ></div>
                  </div>
                  <div className="chart-label">{item.period}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="activity-heatmap liquid-glass">
          <div className="chart-header">
            <h3>Activity Heatmap</h3>
            <p>Last 7 weeks activity pattern</p>
          </div>
          <div className="heatmap-content">
            <div className="heatmap-days">
              {weekDays.map(day => (
                <div key={day} className="day-label">{day}</div>
              ))}
            </div>
            <div className="heatmap-grid">
              {activityHeatmap.map((week, weekIndex) => (
                <div key={weekIndex} className="heatmap-week">
                  {week.map((intensity, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="heatmap-cell"
                      style={{ backgroundColor: getActivityColor(intensity) }}
                      title={`Week ${weekIndex + 1}, ${weekDays[dayIndex]}: ${intensity} activities`}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
            <div className="heatmap-legend">
              <span>Less</span>
              <div className="legend-scale">
                {[0, 1, 2, 3, 4, 5].map(level => (
                  <div
                    key={level}
                    className="legend-cell"
                    style={{ backgroundColor: getActivityColor(level) }}
                  ></div>
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Analysis */}
      <div className="skills-analysis liquid-glass">
        <div className="section-header">
          <h3>Skills Development</h3>
          <p>Track your skill progression and identify growth areas</p>
        </div>
        <div className="skills-grid">
          {skillsData.map((skill, index) => (
            <div key={index} className="skill-item">
              <div className="skill-header">
                <div className="skill-info">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-category">{skill.category}</span>
                </div>
                <div className="skill-metrics">
                  <span className="skill-level">{skill.level}%</span>
                  <span className={`skill-growth ${skill.growth > 0 ? 'positive' : 'negative'}`}>
                    {skill.growth > 0 ? '+' : ''}{skill.growth}%
                  </span>
                </div>
              </div>
              <div className="skill-progress">
                <div className="skill-bar">
                  <div 
                    className="skill-fill"
                    style={{ 
                      width: `${skill.level}%`,
                      backgroundColor: getSkillColor(skill.level)
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="detailed-analytics">
        <div className="analytics-tabs">
          <button 
            className={`tab-btn ${activeMetric === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveMetric('performance')}
          >
            📊 Performance
          </button>
          <button 
            className={`tab-btn ${activeMetric === 'productivity' ? 'active' : ''}`}
            onClick={() => setActiveMetric('productivity')}
          >
            ⚡ Productivity
          </button>
          <button 
            className={`tab-btn ${activeMetric === 'collaboration' ? 'active' : ''}`}
            onClick={() => setActiveMetric('collaboration')}
          >
            👥 Collaboration
          </button>
          <button 
            className={`tab-btn ${activeMetric === 'growth' ? 'active' : ''}`}
            onClick={() => setActiveMetric('growth')}
          >
            📈 Growth
          </button>
        </div>

        <div className="analytics-content liquid-glass">
          {activeMetric === 'performance' && (
            <div className="performance-analytics">
              <h4>Performance Insights</h4>
              <div className="insights-grid">
                <div className="insight-card">
                  <div className="insight-icon">🎯</div>
                  <div className="insight-content">
                    <h5>Goal Achievement</h5>
                    <p>You've achieved 92% of your monthly goals. Keep up the excellent work!</p>
                    <div className="insight-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '92%', backgroundColor: '#10B981' }}></div>
                      </div>
                      <span>92%</span>
                    </div>
                  </div>
                </div>
                <div className="insight-card">
                  <div className="insight-icon">⏱️</div>
                  <div className="insight-content">
                    <h5>Time Management</h5>
                    <p>Your average task completion time has improved by 15% this month.</p>
                    <div className="insight-metric">
                      <span className="metric-value">2.3 days</span>
                      <span className="metric-change positive">-15%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMetric === 'productivity' && (
            <div className="productivity-analytics">
              <h4>Productivity Analysis</h4>
              <div className="productivity-breakdown">
                <div className="breakdown-item">
                  <span className="breakdown-label">Peak Hours</span>
                  <span className="breakdown-value">9 AM - 11 AM</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Most Productive Day</span>
                  <span className="breakdown-value">Tuesday</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Focus Time</span>
                  <span className="breakdown-value">6.2 hours/day</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Distraction Rate</span>
                  <span className="breakdown-value">12%</span>
                </div>
              </div>
            </div>
          )}

          {activeMetric === 'collaboration' && (
            <div className="collaboration-analytics">
              <h4>Collaboration Metrics</h4>
              <div className="collaboration-stats">
                <div className="collab-stat">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <span className="stat-value">24</span>
                    <span className="stat-label">Team Members Worked With</span>
                  </div>
                </div>
                <div className="collab-stat">
                  <div className="stat-icon">💬</div>
                  <div className="stat-info">
                    <span className="stat-value">156</span>
                    <span className="stat-label">Messages Sent</span>
                  </div>
                </div>
                <div className="collab-stat">
                  <div className="stat-icon">🔄</div>
                  <div className="stat-info">
                    <span className="stat-value">42</span>
                    <span className="stat-label">Code Reviews</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMetric === 'growth' && (
            <div className="growth-analytics">
              <h4>Growth Trajectory</h4>
              <div className="growth-insights">
                <div className="growth-item">
                  <div className="growth-icon">📚</div>
                  <div className="growth-content">
                    <h5>Learning Progress</h5>
                    <p>Completed 8 new courses this quarter</p>
                    <div className="growth-tags">
                      <span className="growth-tag">React Advanced</span>
                      <span className="growth-tag">Node.js</span>
                      <span className="growth-tag">Docker</span>
                    </div>
                  </div>
                </div>
                <div className="growth-item">
                  <div className="growth-icon">🏆</div>
                  <div className="growth-content">
                    <h5>Achievements Unlocked</h5>
                    <p>Earned 5 new badges this month</p>
                    <div className="achievement-preview">
                      <span className="achievement-badge">🥇</span>
                      <span className="achievement-badge">⚡</span>
                      <span className="achievement-badge">🎯</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .analytics-section {
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

        .time-range-selector {
          display: flex;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 4px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .range-btn {
          padding: 8px 16px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .range-btn.active,
        .range-btn:hover {
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .metric-card {
          padding: 24px;
          text-align: center;
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .metric-header h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .trend-indicator {
          font-size: 16px;
        }

        .metric-value {
          font-size: 32px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .metric-change {
          font-size: 12px;
        }

        .metric-change .positive {
          color: #10B981;
        }

        .metric-change .negative {
          color: #EF4444;
        }

        .charts-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .chart-container,
        .activity-heatmap {
          padding: 24px;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .chart-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
        }

        .chart-header p {
          margin: 0;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        .chart-legend {
          display: flex;
          gap: 16px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        .legend-color.performance {
          background: #667eea;
        }

        .legend-color.tasks {
          background: #10B981;
        }

        .chart-bars {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 200px;
          gap: 16px;
        }

        .chart-bar-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }

        .chart-bars-container {
          display: flex;
          align-items: flex-end;
          gap: 4px;
          height: 180px;
          width: 100%;
          justify-content: center;
        }

        .chart-bar {
          width: 20px;
          border-radius: 4px 4px 0 0;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .chart-bar.performance {
          background: linear-gradient(to top, #667eea, #764ba2);
        }

        .chart-bar.tasks {
          background: linear-gradient(to top, #10B981, #059669);
        }

        .chart-bar:hover {
          transform: scaleY(1.05);
        }

        .chart-label {
          margin-top: 8px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        .heatmap-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .heatmap-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
          margin-bottom: 4px;
        }

        .day-label {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
        }

        .heatmap-grid {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .heatmap-week {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }

        .heatmap-cell {
          width: 12px;
          height: 12px;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .heatmap-cell:hover {
          transform: scale(1.2);
        }

        .heatmap-legend {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 8px;
        }

        .legend-scale {
          display: flex;
          gap: 2px;
        }

        .legend-cell {
          width: 8px;
          height: 8px;
          border-radius: 1px;
        }

        .skills-analysis {
          padding: 24px;
          margin-bottom: 32px;
        }

        .skills-analysis .section-header {
          margin-bottom: 24px;
        }

        .skills-analysis .section-header h3 {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
        }

        .skills-analysis .section-header p {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }

        .skill-item {
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .skill-item:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(102, 126, 234, 0.2);
        }

        .skill-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .skill-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .skill-name {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
        }

        .skill-category {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 8px;
          width: fit-content;
        }

        .skill-metrics {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .skill-level {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
        }

        .skill-growth {
          font-size: 11px;
          font-weight: 500;
        }

        .skill-growth.positive {
          color: #10B981;
        }

        .skill-growth.negative {
          color: #EF4444;
        }

        .skill-progress {
          width: 100%;
        }

        .skill-bar {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .skill-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .detailed-analytics {
          margin-bottom: 32px;
        }

        .analytics-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 16px;
          background: rgba(255, 255, 255, 0.05);
          padding: 4px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tab-btn {
          padding: 12px 20px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
          flex: 1;
          text-align: center;
        }

        .tab-btn.active {
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          border: 1px solid rgba(102, 126, 234, 0.3);
        }

        .tab-btn:hover:not(.active) {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.8);
        }

        .analytics-content {
          padding: 24px;
        }

        .analytics-content h4 {
          margin: 0 0 20px 0;
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .insight-card {
          display: flex;
          gap: 16px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .insight-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .insight-content h5 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
        }

        .insight-content p {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.4;
        }

        .insight-progress {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .insight-progress .progress-bar {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .insight-progress .progress-fill {
          height: 100%;
          border-radius: 3px;
        }

        .insight-progress span {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
        }

        .insight-metric {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .insight-metric .metric-value {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
        }

        .insight-metric .metric-change {
          font-size: 12px;
          font-weight: 500;
        }

        .productivity-breakdown {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .breakdown-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .breakdown-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .breakdown-value {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
        }

        .collaboration-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .collab-stat {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .stat-icon {
          font-size: 24px;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        .growth-insights {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .growth-item {
          display: flex;
          gap: 16px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .growth-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .growth-content h5 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
        }

        .growth-content p {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .growth-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .growth-tag {
          padding: 4px 8px;
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
        }

        .achievement-preview {
          display: flex;
          gap: 8px;
        }

        .achievement-badge {
          font-size: 20px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .section-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .charts-section {
            grid-template-columns: 1fr;
          }

          .skills-grid {
            grid-template-columns: 1fr;
          }

          .analytics-tabs {
            flex-direction: column;
          }

          .insights-grid {
            grid-template-columns: 1fr;
          }

          .productivity-breakdown {
            grid-template-columns: 1fr;
          }

          .collaboration-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}