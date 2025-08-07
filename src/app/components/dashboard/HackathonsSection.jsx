"use client";
import { useState, useEffect } from 'react';

export default function HackathonsSection({ userProfile, hackathonHistory = [] }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Combine user's hackathon history with available events
  const [hackathons, setHackathons] = useState([]);

  // Fetch available events from API and combine with user's history
  useEffect(() => {
    fetchAvailableEvents();
  }, []);

  useEffect(() => {
    // Combine user's participated events with available events
    const combinedHackathons = [...hackathonHistory];
    
    // Add available events that user hasn't participated in
    availableEvents.forEach(event => {
      const alreadyParticipated = hackathonHistory.some(h => h.id === event.id);
      if (!alreadyParticipated) {
        combinedHackathons.push({
          ...event,
          position: 'Available',
          team: 'Not Registered',
          prize: formatPrizes(event.prizes)
        });
      }
    });
    
    setHackathons(combinedHackathons);
    setLoading(false);
  }, [hackathonHistory, availableEvents]);

  const fetchAvailableEvents = async () => {
    try {
      const response = await fetch('/api/events?status=all');
      const data = await response.json();
      
      if (data.success) {
        // Transform API data to match component structure
        const transformedEvents = data.data.map(event => ({
          id: event.id,
          name: event.title,
          description: event.description,
          status: getEventStatus(event),
          date: event.startDate,
          endDate: event.endDate,
          technologies: event.technologies || [],
          participants: event.currentParticipants || 0,
          maxParticipants: event.maxParticipants,
          category: event.category || 'General',
          difficulty: event.difficulty || 'Intermediate',
          eventType: event.eventType || 'hackathon',
          originalPrice: event.originalPrice,
          finalPrice: event.finalPrice,
          registrationDeadline: event.registrationDeadline,
          prizes: event.prizes || []
        }));
        
        setAvailableEvents(transformedEvents);
      } else {
        setError(data.error || 'Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
    }
  };

  // Helper functions to transform data
  const getEventStatus = (event) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    if (now < startDate) return 'upcoming';
    if (now >= startDate && now <= endDate) return 'in-progress';
    if (now > endDate) return 'completed';
    return 'upcoming';
  };

  const getUserPosition = (event) => {
    // This would need to be determined based on user's actual participation
    // For now, return a default value
    return 'Registered';
  };

  const getUserTeam = (event) => {
    // This would need to be determined based on user's actual team
    // For now, return a default value
    return 'Individual';
  };

  const formatPrizes = (prizes) => {
    if (!prizes || prizes.length === 0) return 'Certificate';
    if (prizes.length === 1) return prizes[0];
    return prizes[0]; // Return first prize for display
  };

  const handleEventRegistration = async (eventId) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert('Please login to register for events');
        return;
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: eventId,
          userId: userId,
          userType: userProfile?.userType || 'student'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Successfully registered for the event!');
        // Refresh the events data
        fetchAvailableEvents();
      } else {
        alert(data.error || 'Failed to register for event');
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Failed to register for event');
    }
  };

  // Fallback static data for development/testing
  const staticHackathons = [
    {
      id: 1,
      name: 'AI Innovation Challenge 2024',
      description: 'Build innovative AI solutions for real-world problems',
      status: 'completed',
      position: '2nd Place',
      team: 'Code Crushers',
      prize: '$5,000',
      date: '2024-03-15',
      endDate: '2024-03-17',
      technologies: ['Python', 'TensorFlow', 'React', 'FastAPI'],
      participants: 150,
      category: 'AI/ML',
      difficulty: 'Advanced',
      submission: {
        title: 'Smart Healthcare Assistant',
        description: 'AI-powered healthcare diagnosis and recommendation system',
        githubUrl: 'https://github.com/team/healthcare-ai',
        demoUrl: 'https://demo.healthcare-ai.com',
        score: 92
      }
    },
    {
      id: 2,
      name: 'Web3 Hackathon 2024',
      description: 'Decentralized applications for the future',
      status: 'completed',
      position: '1st Place',
      team: 'Blockchain Builders',
      prize: '$10,000',
      date: '2024-02-20',
      endDate: '2024-02-22',
      technologies: ['Solidity', 'React', 'Web3.js', 'IPFS'],
      participants: 200,
      category: 'Blockchain',
      difficulty: 'Expert',
      submission: {
        title: 'DeFi Portfolio Manager',
        description: 'Decentralized portfolio management platform',
        githubUrl: 'https://github.com/team/defi-portfolio',
        demoUrl: 'https://demo.defi-portfolio.com',
        score: 98
      }
    },
    {
      id: 3,
      name: 'Mobile App Challenge',
      description: 'Create innovative mobile applications',
      status: 'in-progress',
      position: 'Participating',
      team: 'Mobile Masters',
      prize: 'TBD',
      date: '2024-04-01',
      endDate: '2024-04-15',
      technologies: ['React Native', 'Firebase', 'Node.js'],
      participants: 120,
      category: 'Mobile',
      difficulty: 'Intermediate',
      submission: {
        title: 'EcoTracker App',
        description: 'Track and reduce your carbon footprint',
        githubUrl: 'https://github.com/team/eco-tracker',
        demoUrl: null,
        score: null
      }
    },
    {
      id: 4,
      name: 'Cybersecurity Challenge',
      description: 'Build secure applications and find vulnerabilities',
      status: 'upcoming',
      position: 'Registered',
      team: 'Security Squad',
      prize: '$7,500',
      date: '2024-05-10',
      endDate: '2024-05-12',
      technologies: ['Python', 'Kali Linux', 'Wireshark', 'Metasploit'],
      participants: 80,
      category: 'Security',
      difficulty: 'Advanced',
      submission: null
    }
  ];

  const filteredHackathons = hackathons.filter(hackathon => {
    if (activeFilter === 'all') return true;
    return hackathon.status === activeFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'in-progress': return '#F59E0B';
      case 'upcoming': return '#3B82F6';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#10B981';
      case 'Intermediate': return '#F59E0B';
      case 'Advanced': return '#EF4444';
      case 'Expert': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getPositionIcon = (position) => {
    if (position.includes('1st')) return '🥇';
    if (position.includes('2nd')) return '🥈';
    if (position.includes('3rd')) return '🥉';
    return '🏆';
  };

  // Show loading state
  if (loading) {
    return (
      <div className="hackathons-section">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading hackathons...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="hackathons-section">
        <div className="error-container">
          <p>Error: {error}</p>
          <button onClick={fetchHackathons} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hackathons-section">
      <div className="section-header">
        <div className="header-left">
          <h2>Hackathon Journey</h2>
          <p>Track your hackathon participation and achievements</p>
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
          <button 
            className="add-btn"
            onClick={() => setShowAddModal(true)}
          >
            + Join Hackathon
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="hackathon-stats">
        <div className="stat-item">
          <span className="stat-number">{hackathons.length}</span>
          <span className="stat-label">Total Participated</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{hackathons.filter(h => h.status === 'completed').length}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{hackathons.filter(h => h.position.includes('1st') || h.position.includes('2nd') || h.position.includes('3rd')).length}</span>
          <span className="stat-label">Podium Finishes</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            ${hackathons.reduce((total, h) => {
              const prize = h.prize.replace(/[^0-9]/g, '');
              return total + (prize ? parseInt(prize) : 0);
            }, 0).toLocaleString()}
          </span>
          <span className="stat-label">Total Winnings</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-section">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All ({hackathons.length})
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveFilter('completed')}
          >
            Completed ({hackathons.filter(h => h.status === 'completed').length})
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setActiveFilter('in-progress')}
          >
            In Progress ({hackathons.filter(h => h.status === 'in-progress').length})
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveFilter('upcoming')}
          >
            Upcoming ({hackathons.filter(h => h.status === 'upcoming').length})
          </button>
        </div>
      </div>

      {/* Hackathons Content */}
      {viewMode === 'grid' ? (
        <div className="hackathons-grid">
          {filteredHackathons.map(hackathon => (
            <div key={hackathon.id} className="hackathon-card liquid-glass">
              <div className="hackathon-header">
                <div className="hackathon-title">
                  <h3>{hackathon.name}</h3>
                  <div className="hackathon-category">{hackathon.category}</div>
                </div>
                <div className="hackathon-status">
                  <span 
                    className="status-badge"
                    style={{ 
                      backgroundColor: getStatusColor(hackathon.status) + '20',
                      color: getStatusColor(hackathon.status)
                    }}
                  >
                    {hackathon.status}
                  </span>
                </div>
              </div>

              <div className="hackathon-description">
                {hackathon.description}
              </div>

              <div className="hackathon-meta">
                <div className="meta-item">
                  <span className="meta-label">Date:</span>
                  <span>{new Date(hackathon.date).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Team:</span>
                  <span>{hackathon.team}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Participants:</span>
                  <span>{hackathon.participants}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Difficulty:</span>
                  <span 
                    className="difficulty-badge"
                    style={{ color: getDifficultyColor(hackathon.difficulty) }}
                  >
                    {hackathon.difficulty}
                  </span>
                </div>
              </div>

              {hackathon.status === 'completed' && (
                <div className="hackathon-result">
                  <div className="result-header">
                    <div className="position">
                      {getPositionIcon(hackathon.position)} {hackathon.position}
                    </div>
                    <div className="prize">{hackathon.prize}</div>
                  </div>
                  {hackathon.submission && (
                    <div className="submission-info">
                      <h4>{hackathon.submission.title}</h4>
                      <p>{hackathon.submission.description}</p>
                      {hackathon.submission.score && (
                        <div className="score">Score: {hackathon.submission.score}/100</div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {hackathon.status === 'in-progress' && hackathon.submission && (
                <div className="progress-info">
                  <h4>Current Project: {hackathon.submission.title}</h4>
                  <p>{hackathon.submission.description}</p>
                  <div className="progress-actions">
                    <button className="action-btn">View Progress</button>
                    <button className="action-btn">Update Submission</button>
                  </div>
                </div>
              )}

              <div className="hackathon-technologies">
                {hackathon.technologies.map(tech => (
                  <span key={tech} className="tech-tag">{tech}</span>
                ))}
              </div>

              <div className="hackathon-actions">
                {hackathon.status === 'completed' && hackathon.submission && (
                  <>
                    {hackathon.submission.githubUrl && (
                      <button className="action-btn">
                        <span>📁</span> View Code
                      </button>
                    )}
                    {hackathon.submission.demoUrl && (
                      <button className="action-btn">
                        <span>🚀</span> Live Demo
                      </button>
                    )}
                  </>
                )}
                {hackathon.status === 'in-progress' && hackathon.position !== 'Available' && (
                  <button className="action-btn primary">
                    <span>⚡</span> Continue Working
                  </button>
                )}
                {hackathon.status === 'upcoming' && hackathon.position !== 'Available' && (
                  <button className="action-btn primary">
                    <span>🎯</span> Prepare
                  </button>
                )}
                {hackathon.position === 'Available' && hackathon.status === 'upcoming' && (
                  <button 
                    className="action-btn primary"
                    onClick={() => handleEventRegistration(hackathon.id)}
                  >
                    <span>✅</span> Register Now
                  </button>
                )}
                {hackathon.position === 'Available' && hackathon.status === 'in-progress' && (
                  <button 
                    className="action-btn primary"
                    onClick={() => handleEventRegistration(hackathon.id)}
                  >
                    <span>🚀</span> Join Now
                  </button>
                )}
                <button className="action-btn">
                  <span>📊</span> Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="hackathons-list">
          {filteredHackathons.map(hackathon => (
            <div key={hackathon.id} className="hackathon-list-item liquid-glass">
              <div className="list-item-main">
                <div className="list-item-info">
                  <div className="list-item-header">
                    <h3>{hackathon.name}</h3>
                    <div className="list-item-badges">
                      <span 
                        className="status-badge"
                        style={{ 
                          backgroundColor: getStatusColor(hackathon.status) + '20',
                          color: getStatusColor(hackathon.status)
                        }}
                      >
                        {hackathon.status}
                      </span>
                      <span className="category-badge">{hackathon.category}</span>
                    </div>
                  </div>
                  <p className="list-item-description">{hackathon.description}</p>
                  <div className="list-item-meta">
                    <span>📅 {new Date(hackathon.date).toLocaleDateString()}</span>
                    <span>👥 {hackathon.team}</span>
                    <span>🏆 {hackathon.position}</span>
                    <span>💰 {hackathon.prize}</span>
                  </div>
                </div>
                <div className="list-item-actions">
                  <button className="action-btn">View Details</button>
                  {hackathon.status === 'completed' && (
                    <button className="action-btn">View Submission</button>
                  )}
                </div>
              </div>
              <div className="list-item-technologies">
                {hackathon.technologies.map(tech => (
                  <span key={tech} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredHackathons.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏆</div>
          <h3>No hackathons found</h3>
          <p>Try adjusting your filter or join a new hackathon!</p>
          <button className="add-btn">+ Join Your First Hackathon</button>
        </div>
      )}

      <style jsx>{`
        .hackathons-section {
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

        .add-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .add-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: left 0.4s ease;
        }

        .add-btn:hover::before {
          left: 100%;
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
        }

        .hackathon-stats {
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

        .hackathons-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
        }

        .hackathon-card {
          padding: 24px;
          transition: all 0.3s ease;
        }

        .hackathon-card:hover {
          transform: translateY(-4px);
        }

        .hackathon-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .hackathon-title h3 {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
        }

        .hackathon-category {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.1);
          padding: 4px 8px;
          border-radius: 12px;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .hackathon-description {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .hackathon-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .meta-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }

        .meta-label {
          color: rgba(255, 255, 255, 0.5);
          font-weight: 500;
        }

        .meta-item span:last-child {
          color: rgba(255, 255, 255, 0.9);
        }

        .difficulty-badge {
          font-weight: 600;
          font-size: 12px;
        }

        .hackathon-result {
          margin-bottom: 16px;
          padding: 16px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 8px;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .position {
          font-size: 16px;
          font-weight: 600;
          color: #10b981;
        }

        .prize {
          font-size: 16px;
          font-weight: 600;
          color: #f59e0b;
        }

        .submission-info h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
        }

        .submission-info p {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .score {
          font-size: 14px;
          font-weight: 600;
          color: #667eea;
        }

        .progress-info {
          margin-bottom: 16px;
          padding: 16px;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 8px;
        }

        .progress-info h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
        }

        .progress-info p {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .progress-actions {
          display: flex;
          gap: 8px;
        }

        .hackathon-technologies {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
        }

        .tech-tag {
          padding: 4px 8px;
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
          border: 1px solid rgba(102, 126, 234, 0.3);
        }

        .hackathon-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .action-btn {
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        }

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

        .hackathons-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .hackathon-list-item {
          padding: 20px;
        }

        .list-item-main {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .list-item-info {
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

        .category-badge {
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
        }

        .list-item-description {
          margin: 0 0 12px 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
        }

        .list-item-meta {
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          flex-wrap: wrap;
        }

        .list-item-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .list-item-technologies {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
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
          margin: 0 0 20px 0;
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
            justify-content: space-between;
          }

          .hackathon-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .hackathons-grid {
            grid-template-columns: 1fr;
          }

          .filter-buttons {
            justify-content: center;
          }

          .list-item-main {
            flex-direction: column;
            gap: 16px;
          }

          .list-item-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .list-item-meta {
            flex-direction: column;
            gap: 4px;
          }

          .hackathon-actions {
            justify-content: center;
          }
        }

        .loading-container, .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(102, 126, 234, 0.2);
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .retry-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          margin-top: 16px;
          transition: all 0.2s ease;
        }

        .retry-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
      `}</style>
    </div>
  );
}