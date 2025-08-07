"use client";
import { useState } from 'react';

export default function StudentsSection() {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Emma Thompson',
      email: 'emma.thompson@student.edu',
      studentId: 'CS2024001',
      course: 'Computer Science',
      year: 'Final Year',
      gpa: 3.8,
      enrollmentDate: '2021-09-01',
      status: 'active',
      avatar: '/images/CSR Logo.png',
      skills: ['JavaScript', 'React', 'Python'],
      completedProjects: 15,
      currentProjects: 3,
      hackathonsWon: 2,
      mentorId: 1,
      lastActive: '2024-04-10T14:30:00Z',
      performance: {
        assignments: 92,
        participation: 88,
        projects: 95
      }
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@student.edu',
      studentId: 'CS2024002',
      course: 'Software Engineering',
      year: 'Third Year',
      gpa: 3.6,
      enrollmentDate: '2022-09-01',
      status: 'active',
      avatar: '/images/CSR Logo.png',
      skills: ['Java', 'Spring Boot', 'MySQL'],
      completedProjects: 12,
      currentProjects: 2,
      hackathonsWon: 1,
      mentorId: 2,
      lastActive: '2024-04-10T16:15:00Z',
      performance: {
        assignments: 85,
        participation: 90,
        projects: 88
      }
    },
    {
      id: 3,
      name: 'Sarah Williams',
      email: 'sarah.williams@student.edu',
      studentId: 'CS2024003',
      course: 'Data Science',
      year: 'Second Year',
      gpa: 3.9,
      enrollmentDate: '2023-09-01',
      status: 'active',
      avatar: '/images/CSR Logo.png',
      skills: ['Python', 'Machine Learning', 'R'],
      completedProjects: 8,
      currentProjects: 4,
      hackathonsWon: 3,
      mentorId: 1,
      lastActive: '2024-04-10T12:45:00Z',
      performance: {
        assignments: 96,
        participation: 94,
        projects: 92
      }
    },
    {
      id: 4,
      name: 'James Rodriguez',
      email: 'james.rodriguez@student.edu',
      studentId: 'CS2024004',
      course: 'Cybersecurity',
      year: 'First Year',
      gpa: 3.4,
      enrollmentDate: '2024-01-15',
      status: 'probation',
      avatar: '/images/CSR Logo.png',
      skills: ['Network Security', 'Ethical Hacking'],
      completedProjects: 3,
      currentProjects: 1,
      hackathonsWon: 0,
      mentorId: 3,
      lastActive: '2024-04-09T18:20:00Z',
      performance: {
        assignments: 72,
        participation: 68,
        projects: 75
      }
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = students
    .filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(student => filterCourse === 'all' || student.course === filterCourse)
    .filter(student => filterYear === 'all' || student.year === filterYear)
    .filter(student => filterStatus === 'all' || student.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'gpa':
          return b.gpa - a.gpa;
        case 'enrollmentDate':
          return new Date(b.enrollmentDate) - new Date(a.enrollmentDate);
        case 'performance':
          const avgA = (a.performance.assignments + a.performance.participation + a.performance.projects) / 3;
          const avgB = (b.performance.assignments + b.performance.participation + b.performance.projects) / 3;
          return avgB - avgA;
        default:
          return 0;
      }
    });

  const getStatusColor = (status) => {
    const colors = {
      'active': '#10B981',
      'inactive': '#6B7280',
      'probation': '#F59E0B',
      'suspended': '#EF4444'
    };
    return colors[status] || '#6B7280';
  };

  const getGPAColor = (gpa) => {
    if (gpa >= 3.7) return '#10B981';
    if (gpa >= 3.0) return '#F59E0B';
    return '#EF4444';
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return '#10B981';
    if (score >= 80) return '#3B82F6';
    if (score >= 70) return '#F59E0B';
    return '#EF4444';
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

  const calculateOverallPerformance = (performance) => {
    return Math.round((performance.assignments + performance.participation + performance.projects) / 3);
  };

  return (
    <div className="students-section">
      <div className="section-header">
        <div className="header-left">
          <h2>Student Management</h2>
          <p>Track and manage student progress and performance</p>
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
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              ☰
            </button>
          </div>
          <button 
            className="add-btn"
            onClick={() => setShowAddModal(true)}
          >
            + Add Student
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <select 
            value={filterCourse} 
            onChange={(e) => setFilterCourse(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Courses</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Data Science">Data Science</option>
            <option value="Cybersecurity">Cybersecurity</option>
          </select>

          <select 
            value={filterYear} 
            onChange={(e) => setFilterYear(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Years</option>
            <option value="First Year">First Year</option>
            <option value="Second Year">Second Year</option>
            <option value="Third Year">Third Year</option>
            <option value="Final Year">Final Year</option>
          </select>

          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="probation">Probation</option>
            <option value="suspended">Suspended</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="name">Sort by Name</option>
            <option value="gpa">Sort by GPA</option>
            <option value="enrollmentDate">Sort by Enrollment</option>
            <option value="performance">Sort by Performance</option>
          </select>
        </div>
      </div>

      {/* Students Stats */}
      <div className="students-stats">
        <div className="stat-item">
          <span className="stat-number">{students.length}</span>
          <span className="stat-label">Total Students</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{students.filter(s => s.status === 'active').length}</span>
          <span className="stat-label">Active Students</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{Math.round(students.reduce((acc, s) => acc + s.gpa, 0) / students.length * 100) / 100}</span>
          <span className="stat-label">Average GPA</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{students.reduce((acc, s) => acc + s.hackathonsWon, 0)}</span>
          <span className="stat-label">Hackathons Won</span>
        </div>
      </div>

      {/* Students Content */}
      {viewMode === 'grid' ? (
        <div className="students-grid">
          {filteredStudents.map(student => (
            <div key={student.id} className="student-card">
              <div className="student-header">
                <div className="student-avatar">
                  <img src={student.avatar} alt={student.name} />
                  <div className={`status-indicator ${student.status}`}></div>
                </div>
                <div className="student-actions">
                  <button 
                    className="action-btn" 
                    title="View Profile"
                    onClick={() => setSelectedStudent(student)}
                  >
                    👤
                  </button>
                  <button 
                    className="action-btn" 
                    title="Message"
                    onClick={() => alert(`Messaging ${student.name}`)}
                  >
                    💬
                  </button>
                  <button 
                    className="action-btn" 
                    title="More"
                    onClick={() => alert(`More options for ${student.name}`)}
                  >
                    ⋯
                  </button>
                </div>
              </div>

              <div className="student-info">
                <h3>{student.name}</h3>
                <p className="student-id">{student.studentId}</p>
                <div className="student-course">{student.course}</div>
                <div className="student-year">{student.year}</div>
              </div>

              <div className="student-metrics">
                <div className="metric">
                  <span className="metric-label">GPA</span>
                  <span className="metric-value" style={{ color: getGPAColor(student.gpa) }}>
                    {student.gpa}
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">Projects</span>
                  <span className="metric-value">{student.completedProjects}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Hackathons</span>
                  <span className="metric-value">🏆 {student.hackathonsWon}</span>
                </div>
              </div>

              <div className="performance-section">
                <h4>Performance</h4>
                <div className="performance-bars">
                  <div className="performance-item">
                    <span>Assignments</span>
                    <div className="performance-bar">
                      <div 
                        className="performance-fill" 
                        style={{ 
                          width: `${student.performance.assignments}%`,
                          backgroundColor: getPerformanceColor(student.performance.assignments)
                        }}
                      ></div>
                    </div>
                    <span className="performance-score">{student.performance.assignments}%</span>
                  </div>
                  <div className="performance-item">
                    <span>Participation</span>
                    <div className="performance-bar">
                      <div 
                        className="performance-fill" 
                        style={{ 
                          width: `${student.performance.participation}%`,
                          backgroundColor: getPerformanceColor(student.performance.participation)
                        }}
                      ></div>
                    </div>
                    <span className="performance-score">{student.performance.participation}%</span>
                  </div>
                  <div className="performance-item">
                    <span>Projects</span>
                    <div className="performance-bar">
                      <div 
                        className="performance-fill" 
                        style={{ 
                          width: `${student.performance.projects}%`,
                          backgroundColor: getPerformanceColor(student.performance.projects)
                        }}
                      ></div>
                    </div>
                    <span className="performance-score">{student.performance.projects}%</span>
                  </div>
                </div>
              </div>

              <div className="student-skills">
                {student.skills.slice(0, 3).map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
                {student.skills.length > 3 && (
                  <span className="skill-tag more">+{student.skills.length - 3}</span>
                )}
              </div>

              <div className="student-footer">
                <span className="enrollment-date">
                  Enrolled {new Date(student.enrollmentDate).toLocaleDateString()}
                </span>
                <span className="last-active">
                  {formatLastActive(student.lastActive)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Year</th>
                <th>GPA</th>
                <th>Performance</th>
                <th>Projects</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>
                    <div className="table-student-info">
                      <img src={student.avatar} alt={student.name} className="table-avatar" />
                      <div>
                        <div className="table-name">{student.name}</div>
                        <div className="table-id">{student.studentId}</div>
                      </div>
                    </div>
                  </td>
                  <td>{student.course}</td>
                  <td>{student.year}</td>
                  <td>
                    <span style={{ color: getGPAColor(student.gpa) }}>
                      {student.gpa}
                    </span>
                  </td>
                  <td>
                    <div className="table-performance">
                      <span 
                        className="performance-badge"
                        style={{ 
                          backgroundColor: getPerformanceColor(calculateOverallPerformance(student.performance)) + '20',
                          color: getPerformanceColor(calculateOverallPerformance(student.performance))
                        }}
                      >
                        {calculateOverallPerformance(student.performance)}%
                      </span>
                    </div>
                  </td>
                  <td>{student.completedProjects}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: getStatusColor(student.status) + '20',
                        color: getStatusColor(student.status)
                      }}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="action-btn" 
                        title="View"
                        onClick={() => setSelectedStudent(student)}
                      >
                        👤
                      </button>
                      <button 
                        className="action-btn" 
                        title="Edit"
                        onClick={() => alert(`Editing ${student.name}`)}
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-btn" 
                        title="Message"
                        onClick={() => alert(`Messaging ${student.name}`)}
                      >
                        💬
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredStudents.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎓</div>
          <h3>No students found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content liquid-glass" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Student</h3>
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
                <input type="text" placeholder="Enter student name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="Enter email address" />
              </div>
              <div className="form-group">
                <label>Student ID</label>
                <input type="text" placeholder="Enter student ID" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Course</label>
                  <select>
                    <option>Computer Science</option>
                    <option>Software Engineering</option>
                    <option>Data Science</option>
                    <option>Cybersecurity</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <select>
                    <option>First Year</option>
                    <option>Second Year</option>
                    <option>Third Year</option>
                    <option>Final Year</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Skills (comma separated)</label>
                <input type="text" placeholder="JavaScript, React, Python..." />
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
                  alert('Student added successfully!');
                  setShowAddModal(false);
                }}
              >
                Add Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content liquid-glass large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Student Profile</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedStudent(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="student-profile">
                <div className="profile-header">
                  <img src={selectedStudent.avatar} alt={selectedStudent.name} />
                  <div className="profile-info">
                    <h4>{selectedStudent.name}</h4>
                    <p>{selectedStudent.studentId}</p>
                    <span className={`status-badge ${selectedStudent.status}`}>
                      {selectedStudent.status}
                    </span>
                  </div>
                </div>
                <div className="profile-details">
                  <div className="detail-section">
                    <h5>Academic Information</h5>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="label">Course:</span>
                        <span className="value">{selectedStudent.course}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Year:</span>
                        <span className="value">{selectedStudent.year}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">GPA:</span>
                        <span className="value" style={{ color: getGPAColor(selectedStudent.gpa) }}>
                          {selectedStudent.gpa}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Enrollment Date:</span>
                        <span className="value">
                          {new Date(selectedStudent.enrollmentDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="detail-section">
                    <h5>Performance Metrics</h5>
                    <div className="performance-details">
                      <div className="performance-item">
                        <span>Assignments</span>
                        <div className="performance-bar">
                          <div 
                            className="performance-fill" 
                            style={{ 
                              width: `${selectedStudent.performance.assignments}%`,
                              backgroundColor: getPerformanceColor(selectedStudent.performance.assignments)
                            }}
                          ></div>
                        </div>
                        <span>{selectedStudent.performance.assignments}%</span>
                      </div>
                      <div className="performance-item">
                        <span>Participation</span>
                        <div className="performance-bar">
                          <div 
                            className="performance-fill" 
                            style={{ 
                              width: `${selectedStudent.performance.participation}%`,
                              backgroundColor: getPerformanceColor(selectedStudent.performance.participation)
                            }}
                          ></div>
                        </div>
                        <span>{selectedStudent.performance.participation}%</span>
                      </div>
                      <div className="performance-item">
                        <span>Projects</span>
                        <div className="performance-bar">
                          <div 
                            className="performance-fill" 
                            style={{ 
                              width: `${selectedStudent.performance.projects}%`,
                              backgroundColor: getPerformanceColor(selectedStudent.performance.projects)
                            }}
                          ></div>
                        </div>
                        <span>{selectedStudent.performance.projects}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="detail-section">
                    <h5>Skills & Achievements</h5>
                    <div className="skills-list">
                      {selectedStudent.skills.map(skill => (
                        <span key={skill} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                    <div className="achievements-summary">
                      <div className="achievement-item">
                        <span className="achievement-number">{selectedStudent.completedProjects}</span>
                        <span className="achievement-label">Completed Projects</span>
                      </div>
                      <div className="achievement-item">
                        <span className="achievement-number">{selectedStudent.hackathonsWon}</span>
                        <span className="achievement-label">Hackathons Won</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="action-btn-modal"
                onClick={() => alert(`Messaging ${selectedStudent.name}`)}
              >
                💬 Message
              </button>
              <button 
                className="action-btn-modal"
                onClick={() => alert(`Editing ${selectedStudent.name}`)}
              >
                ✏️ Edit
              </button>
              <button 
                className="close-btn-modal"
                onClick={() => setSelectedStudent(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .students-section {
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

        .students-stats {
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

        /* Grid View Styles */
        .students-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 24px;
        }

        .student-card {
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

        .student-card::before {
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

        .student-card:hover::before {
          left: 100%;
        }

        .student-card:hover {
          transform: translateY(-4px);
          border-color: rgba(102, 126, 234, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .student-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .student-avatar {
          position: relative;
          width: 60px;
          height: 60px;
        }

        .student-avatar img {
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

        .status-indicator.probation {
          background: #f59e0b;
        }

        .status-indicator.suspended {
          background: #ef4444;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .student-actions {
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

        .student-info {
          margin-bottom: 16px;
        }

        .student-info h3 {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
        }

        .student-id {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          font-family: monospace;
        }

        .student-course {
          font-size: 14px;
          color: #667eea;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .student-year {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        .student-metrics {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .metric {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .metric-label {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metric-value {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
        }

        .performance-section {
          margin-bottom: 16px;
        }

        .performance-section h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
        }

        .performance-bars {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .performance-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 12px;
        }

        .performance-item span:first-child {
          min-width: 80px;
          color: rgba(255, 255, 255, 0.6);
        }

        .performance-bar {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .performance-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .performance-score {
          min-width: 35px;
          text-align: right;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }

        .student-skills {
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

        .student-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 16px;
        }

        /* Table View Styles */
        .students-table-container {
          background: rgba(15, 15, 15, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
        }

        .students-table {
          width: 100%;
          border-collapse: collapse;
        }

        .students-table th {
          background: rgba(255, 255, 255, 0.05);
          padding: 16px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .students-table td {
          padding: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.9);
        }

        .students-table tr:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .table-student-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .table-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(102, 126, 234, 0.3);
        }

        .table-name {
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 2px;
        }

        .table-id {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          font-family: monospace;
        }

        .table-performance {
          display: flex;
          align-items: center;
        }

        .performance-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .table-actions {
          display: flex;
          gap: 8px;
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
            justify-content: space-between;
          }

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

          .students-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .students-grid {
            grid-template-columns: 1fr;
          }

          .students-table-container {
            overflow-x: auto;
          }

          .students-table {
            min-width: 800px;
          }
        }
      `}</style>
    </div>
  );
}