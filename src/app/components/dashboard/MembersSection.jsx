"use client";
import { useState } from 'react';

export default function MembersSection() {
  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      role: 'Team Lead',
      department: 'Frontend Development',
      joinDate: '2024-01-15',
      status: 'active',
      avatar: '/images/CSR Logo.png',
      skills: ['React', 'TypeScript', 'UI/UX'],
      projects: 12,
      rating: 4.8,
      lastActive: '2024-04-10T10:30:00Z'
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      role: 'Senior Developer',
      department: 'Backend Development',
      joinDate: '2024-02-01',
      status: 'active',
      avatar: '/images/CSR Logo.png',
      skills: ['Node.js', 'Python', 'MongoDB'],
      projects: 8,
      rating: 4.6,
      lastActive: '2024-04-10T09:15:00Z'
    },
    {
      id: 3,
      name: 'Carol Davis',
      email: 'carol.davis@example.com',
      role: 'Designer',
      department: 'UI/UX Design',
      joinDate: '2024-01-20',
      status: 'inactive',
      avatar: '/images/CSR Logo.png',
      skills: ['Figma', 'Adobe XD', 'Prototyping'],
      projects: 15,
      rating: 4.9,
      lastActive: '2024-04-08T16:45:00Z'
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david.wilson@example.com',
      role: 'DevOps Engineer',
      department: 'Infrastructure',
      joinDate: '2024-03-01',
      status: 'active',
      avatar: '/images/CSR Logo.png',
      skills: ['Docker', 'Kubernetes', 'AWS'],
      projects: 6,
      rating: 4.7,
      lastActive: '2024-04-10T11:20:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const filteredMembers = members
    .filter(member => 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(member => filterRole === 'all' || member.role === filterRole)
    .filter(member => filterStatus === 'all' || member.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'joinDate':
          return new Date(b.joinDate) - new Date(a.joinDate);
        case 'rating':
          return b.rating - a.rating;
        case 'projects':
          return b.projects - a.projects;
        default:
          return 0;
      }
    });

  const getStatusColor = (status) => {
    return status === 'active' ? '#10B981' : '#6B7280';
  };

  const getRoleColor = (role) => {
    const colors = {
      'Team Lead': '#8B5CF6',
      'Senior Developer': '#3B82F6',
      'Designer': '#F59E0B',
      'DevOps Engineer': '#EF4444',
      'Developer': '#10B981'
    };
    return colors[role] || '#6B7280';
  };

  const formatLastActive = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="members-section">
      <div className="section-header">
        <div className="header-left">
          <h2>Team Members</h2>
          <p>Manage your team members and their roles</p>
        </div>
        <button 
          className="add-btn"
          onClick={() => setShowAddModal(true)}
        >
          + Add Member
        </button>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <select 
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="Team Lead">Team Lead</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Designer">Designer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="Developer">Developer</option>
          </select>

          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="name">Sort by Name</option>
            <option value="joinDate">Sort by Join Date</option>
            <option value="rating">Sort by Rating</option>
            <option value="projects">Sort by Projects</option>
          </select>
        </div>
      </div>

      {/* Members Stats */}
      <div className="members-stats">
        <div className="stat-item">
          <span className="stat-number">{members.length}</span>
          <span className="stat-label">Total Members</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{members.filter(m => m.status === 'active').length}</span>
          <span className="stat-label">Active Members</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{Math.round(members.reduce((acc, m) => acc + m.rating, 0) / members.length * 10) / 10}</span>
          <span className="stat-label">Avg Rating</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{members.reduce((acc, m) => acc + m.projects, 0)}</span>
          <span className="stat-label">Total Projects</span>
        </div>
      </div>

      {/* Members Grid */}
      <div className="members-grid">
        {filteredMembers.map(member => (
          <div key={member.id} className="member-card">
            <div className="member-header">
              <div className="member-avatar">
                <img src={member.avatar} alt={member.name} />
                <div className={`status-indicator ${member.status}`}></div>
              </div>
              <div className="member-actions">
                <button 
                  className="action-btn" 
                  title="View Profile"
                  onClick={() => setSelectedMember(member)}
                >
                  👤
                </button>
                <button 
                  className="action-btn" 
                  title="Message"
                  onClick={() => alert(`Messaging ${member.name}`)}
                >
                  💬
                </button>
                <button 
                  className="action-btn" 
                  title="More"
                  onClick={() => alert(`More options for ${member.name}`)}
                >
                  ⋯
                </button>
              </div>
            </div>

            <div className="member-info">
              <h3>{member.name}</h3>
              <p className="member-email">{member.email}</p>
              <div className="member-role" style={{ color: getRoleColor(member.role) }}>
                {member.role}
              </div>
              <div className="member-department">{member.department}</div>
            </div>

            <div className="member-stats">
              <div className="stat">
                <span className="stat-value">{member.projects}</span>
                <span className="stat-name">Projects</span>
              </div>
              <div className="stat">
                <span className="stat-value">⭐ {member.rating}</span>
                <span className="stat-name">Rating</span>
              </div>
            </div>

            <div className="member-skills">
              {member.skills.slice(0, 3).map(skill => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
              {member.skills.length > 3 && (
                <span className="skill-tag more">+{member.skills.length - 3}</span>
              )}
            </div>

            <div className="member-footer">
              <span className="join-date">
                Joined {new Date(member.joinDate).toLocaleDateString()}
              </span>
              <span className="last-active">
                {formatLastActive(member.lastActive)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No members found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content liquid-glass" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Member</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Enter member name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="Enter email address" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Role</label>
                  <select>
                    <option>Developer</option>
                    <option>Senior Developer</option>
                    <option>Team Lead</option>
                    <option>Designer</option>
                    <option>DevOps Engineer</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select>
                    <option>Frontend Development</option>
                    <option>Backend Development</option>
                    <option>UI/UX Design</option>
                    <option>Infrastructure</option>
                    <option>Quality Assurance</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Skills (comma separated)</label>
                <input type="text" placeholder="React, Node.js, Python..." />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button 
                className="submit-btn"
                onClick={() => {
                  alert('Member added successfully!');
                  setShowAddModal(false);
                }}
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="modal-overlay" onClick={() => setSelectedMember(null)}>
          <div className="modal-content liquid-glass large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Member Profile</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedMember(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="member-profile">
                <div className="profile-header">
                  <img src={selectedMember.avatar} alt={selectedMember.name} />
                  <div className="profile-info">
                    <h4>{selectedMember.name}</h4>
                    <p>{selectedMember.email}</p>
                    <span className={`status-badge ${selectedMember.status}`}>
                      {selectedMember.status}
                    </span>
                  </div>
                </div>
                <div className="profile-details">
                  <div className="detail-section">
                    <h5>Professional Information</h5>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="label">Role:</span>
                        <span className="value" style={{ color: getRoleColor(selectedMember.role) }}>
                          {selectedMember.role}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Department:</span>
                        <span className="value">{selectedMember.department}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Join Date:</span>
                        <span className="value">
                          {new Date(selectedMember.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Rating:</span>
                        <span className="value">⭐ {selectedMember.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="detail-section">
                    <h5>Project Statistics</h5>
                    <div className="stats-grid">
                      <div className="stat-card">
                        <span className="stat-number">{selectedMember.projects}</span>
                        <span className="stat-label">Total Projects</span>
                      </div>
                      <div className="stat-card">
                        <span className="stat-number">{selectedMember.rating}</span>
                        <span className="stat-label">Average Rating</span>
                      </div>
                    </div>
                  </div>
                  <div className="detail-section">
                    <h5>Skills & Expertise</h5>
                    <div className="skills-list">
                      {selectedMember.skills.map(skill => (
                        <span key={skill} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="detail-section">
                    <h5>Activity</h5>
                    <div className="activity-info">
                      <span>Last Active: {formatLastActive(selectedMember.lastActive)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="action-btn-modal"
                onClick={() => alert(`Messaging ${selectedMember.name}`)}
              >
                💬 Message
              </button>
              <button 
                className="action-btn-modal"
                onClick={() => alert(`Editing ${selectedMember.name}`)}
              >
                ✏️ Edit
              </button>
              <button 
                className="close-btn-modal"
                onClick={() => setSelectedMember(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .members-section {
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

        .filters-section {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          align-items: center;
        }

        .search-box {
          position: relative;
          flex: 1;
          min-width: 300px;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.5);
          font-size: 16px;
        }

        .search-box input {
          width: 100%;
          padding: 12px 16px 12px 48px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #ffffff;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .search-box input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          background: rgba(255, 255, 255, 0.08);
        }

        .search-box input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .filter-controls {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-select {
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #ffffff;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 140px;
        }

        .filter-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .filter-select option {
          background: #1a1a1a;
          color: #ffffff;
        }

        .members-stats {
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

        .members-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .member-card {
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

        .member-card::before {
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

        .member-card:hover::before {
          left: 100%;
        }

        .member-card:hover {
          transform: translateY(-4px);
          border-color: rgba(102, 126, 234, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .member-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .member-avatar {
          position: relative;
          width: 60px;
          height: 60px;
        }

        .member-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(102, 126, 234, 0.3);
        }

        .status-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 3px solid rgba(15, 15, 15, 0.8);
        }

        .status-indicator.active {
          background: #10b981;
          animation: pulse 2s ease-in-out infinite;
        }

        .status-indicator.inactive {
          background: #6b7280;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .member-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
          transform: scale(1.1);
        }

        .member-info {
          margin-bottom: 16px;
        }

        .member-info h3 {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
        }

        .member-email {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
        }

        .member-role {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .member-department {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        .member-stats {
          display: flex;
          gap: 24px;
          margin-bottom: 16px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
        }

        .stat-name {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .member-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
        }

        .skill-tag {
          padding: 4px 8px;
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
          border: 1px solid rgba(102, 126, 234, 0.3);
        }

        .skill-tag.more {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .member-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 16px;
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
          .filters-section {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            min-width: auto;
          }

          .filter-controls {
            justify-content: space-between;
          }

          .filter-select {
            flex: 1;
            min-width: auto;
          }

          .members-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .members-grid {
            grid-template-columns: 1fr;
          }

          .member-stats {
            justify-content: space-around;
          }
        }
      `}</style>
    </div>
  );
}