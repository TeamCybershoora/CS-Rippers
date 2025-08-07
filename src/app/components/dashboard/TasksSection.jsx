"use client";
import { useState } from 'react';

export default function TasksSection() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('kanban');
  const [showAddModal, setShowAddModal] = useState(false);

  const tasks = [
    {
      id: 1,
      title: 'Implement User Authentication',
      description: 'Create login/signup functionality with JWT tokens and password hashing',
      status: 'in-progress',
      priority: 'high',
      assignee: 'John Doe',
      dueDate: '2024-04-15',
      createdDate: '2024-04-01',
      tags: ['Backend', 'Security', 'API'],
      progress: 65,
      subtasks: [
        { id: 1, title: 'Setup JWT middleware', completed: true },
        { id: 2, title: 'Create login endpoint', completed: true },
        { id: 3, title: 'Create signup endpoint', completed: false },
        { id: 4, title: 'Add password validation', completed: false }
      ],
      comments: 3,
      attachments: 2
    },
    {
      id: 2,
      title: 'Design Dashboard UI',
      description: 'Create responsive dashboard interface with dark theme support',
      status: 'completed',
      priority: 'medium',
      assignee: 'Jane Smith',
      dueDate: '2024-04-10',
      createdDate: '2024-03-25',
      tags: ['Frontend', 'UI/UX', 'React'],
      progress: 100,
      subtasks: [
        { id: 1, title: 'Create wireframes', completed: true },
        { id: 2, title: 'Design components', completed: true },
        { id: 3, title: 'Implement responsive layout', completed: true },
        { id: 4, title: 'Add dark theme', completed: true }
      ],
      comments: 8,
      attachments: 5
    },
    {
      id: 3,
      title: 'Database Schema Design',
      description: 'Design and implement database schema for user management and content',
      status: 'pending',
      priority: 'high',
      assignee: 'Mike Johnson',
      dueDate: '2024-04-20',
      createdDate: '2024-04-05',
      tags: ['Database', 'Backend', 'MongoDB'],
      progress: 0,
      subtasks: [
        { id: 1, title: 'Define user schema', completed: false },
        { id: 2, title: 'Define content schema', completed: false },
        { id: 3, title: 'Setup relationships', completed: false },
        { id: 4, title: 'Create indexes', completed: false }
      ],
      comments: 1,
      attachments: 0
    },
    {
      id: 4,
      title: 'API Documentation',
      description: 'Create comprehensive API documentation using Swagger/OpenAPI',
      status: 'in-progress',
      priority: 'low',
      assignee: 'Sarah Wilson',
      dueDate: '2024-04-25',
      createdDate: '2024-04-03',
      tags: ['Documentation', 'API', 'Swagger'],
      progress: 30,
      subtasks: [
        { id: 1, title: 'Setup Swagger', completed: true },
        { id: 2, title: 'Document auth endpoints', completed: false },
        { id: 3, title: 'Document user endpoints', completed: false },
        { id: 4, title: 'Add examples', completed: false }
      ],
      comments: 2,
      attachments: 1
    },
    {
      id: 5,
      title: 'Performance Optimization',
      description: 'Optimize application performance and reduce load times',
      status: 'review',
      priority: 'medium',
      assignee: 'Alex Brown',
      dueDate: '2024-04-18',
      createdDate: '2024-03-28',
      tags: ['Performance', 'Optimization', 'Frontend'],
      progress: 85,
      subtasks: [
        { id: 1, title: 'Code splitting', completed: true },
        { id: 2, title: 'Image optimization', completed: true },
        { id: 3, title: 'Bundle analysis', completed: true },
        { id: 4, title: 'Performance testing', completed: false }
      ],
      comments: 5,
      attachments: 3
    },
    {
      id: 6,
      title: 'Mobile Responsiveness',
      description: 'Ensure all components work perfectly on mobile devices',
      status: 'completed',
      priority: 'medium',
      assignee: 'Lisa Davis',
      dueDate: '2024-04-12',
      createdDate: '2024-03-30',
      tags: ['Mobile', 'CSS', 'Responsive'],
      progress: 100,
      subtasks: [
        { id: 1, title: 'Mobile breakpoints', completed: true },
        { id: 2, title: 'Touch interactions', completed: true },
        { id: 3, title: 'Mobile navigation', completed: true },
        { id: 4, title: 'Testing on devices', completed: true }
      ],
      comments: 4,
      attachments: 2
    }
  ];

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'all') return true;
    return task.status === activeFilter;
  });

  const tasksByStatus = {
    pending: filteredTasks.filter(task => task.status === 'pending'),
    'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
    review: filteredTasks.filter(task => task.status === 'review'),
    completed: filteredTasks.filter(task => task.status === 'completed')
  };

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
      case 'pending': return '#6B7280';
      case 'in-progress': return '#3B82F6';
      case 'review': return '#F59E0B';
      case 'completed': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#10B981';
    if (progress >= 50) return '#3B82F6';
    if (progress >= 25) return '#F59E0B';
    return '#EF4444';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  return (
    <div className="tasks-section">
      <div className="section-header">
        <div className="header-left">
          <h2>Task Management</h2>
          <p>Organize and track your project tasks efficiently</p>
        </div>
        <div className="header-actions">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
              title="Kanban View"
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
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            + New Task
          </button>
        </div>
      </div>

      {/* Task Stats */}
      <div className="task-stats">
        <div className="stat-item">
          <span className="stat-number">{tasks.length}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{tasks.filter(t => t.status === 'completed').length}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{tasks.filter(t => t.status === 'in-progress').length}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{Math.round(tasks.reduce((acc, t) => acc + t.progress, 0) / tasks.length)}%</span>
          <span className="stat-label">Avg Progress</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-section">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All ({tasks.length})
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveFilter('pending')}
          >
            Pending ({tasks.filter(t => t.status === 'pending').length})
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setActiveFilter('in-progress')}
          >
            In Progress ({tasks.filter(t => t.status === 'in-progress').length})
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'review' ? 'active' : ''}`}
            onClick={() => setActiveFilter('review')}
          >
            Review ({tasks.filter(t => t.status === 'review').length})
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveFilter('completed')}
          >
            Completed ({tasks.filter(t => t.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Tasks Content */}
      {viewMode === 'kanban' ? (
        <div className="kanban-board">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <div key={status} className="kanban-column">
              <div className="column-header">
                <h3>{status.replace('-', ' ').toUpperCase()}</h3>
                <span className="task-count">{statusTasks.length}</span>
              </div>
              <div className="column-tasks">
                {statusTasks.map(task => (
                  <div key={task.id} className="task-card liquid-glass">
                    <div className="task-header">
                      <h4>{task.title}</h4>
                      <div className="task-priority">
                        <span 
                          className="priority-dot"
                          style={{ backgroundColor: getPriorityColor(task.priority) }}
                        ></span>
                      </div>
                    </div>
                    
                    <p className="task-description">{task.description}</p>
                    
                    <div className="task-progress">
                      <div className="progress-header">
                        <span>Progress</span>
                        <span>{task.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${task.progress}%`,
                            backgroundColor: getProgressColor(task.progress)
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="task-subtasks">
                      <span className="subtasks-count">
                        {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
                      </span>
                    </div>

                    <div className="task-tags">
                      {task.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="task-tag">{tag}</span>
                      ))}
                      {task.tags.length > 2 && (
                        <span className="task-tag more">+{task.tags.length - 2}</span>
                      )}
                    </div>

                    <div className="task-footer">
                      <div className="task-assignee">
                        <div className="assignee-avatar">
                          {task.assignee.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="assignee-name">{task.assignee}</span>
                      </div>
                      <div className="task-meta">
                        <span className="due-date">{formatDate(task.dueDate)}</span>
                        <div className="task-actions">
                          <span className="action-item">💬 {task.comments}</span>
                          <span className="action-item">📎 {task.attachments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="add-task-btn">+ Add Task</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="tasks-list">
          {filteredTasks.map(task => (
            <div key={task.id} className="task-list-item liquid-glass">
              <div className="list-item-main">
                <div className="list-item-checkbox">
                  <input 
                    type="checkbox" 
                    checked={task.status === 'completed'}
                    onChange={() => {}}
                  />
                </div>
                <div className="list-item-content">
                  <div className="list-item-header">
                    <h4>{task.title}</h4>
                    <div className="list-item-badges">
                      <span 
                        className="priority-badge"
                        style={{ 
                          backgroundColor: getPriorityColor(task.priority) + '20',
                          color: getPriorityColor(task.priority)
                        }}
                      >
                        {task.priority}
                      </span>
                      <span 
                        className="status-badge"
                        style={{ 
                          backgroundColor: getStatusColor(task.status) + '20',
                          color: getStatusColor(task.status)
                        }}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <p className="list-item-description">{task.description}</p>
                  <div className="list-item-meta">
                    <span>👤 {task.assignee}</span>
                    <span>📅 {formatDate(task.dueDate)}</span>
                    <span>📊 {task.progress}%</span>
                    <span>💬 {task.comments}</span>
                    <span>📎 {task.attachments}</span>
                  </div>
                  <div className="list-item-tags">
                    {task.tags.map(tag => (
                      <span key={tag} className="task-tag">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="list-item-progress">
                  <div className="circular-progress">
                    <svg width="40" height="40">
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="3"
                      />
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        fill="none"
                        stroke={getProgressColor(task.progress)}
                        strokeWidth="3"
                        strokeDasharray={`${task.progress * 1.005} 100.5`}
                        strokeLinecap="round"
                        transform="rotate(-90 20 20)"
                      />
                    </svg>
                    <span className="progress-text">{task.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredTasks.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No tasks found</h3>
          <p>Create your first task to get started!</p>
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            + Create Task
          </button>
        </div>
      )}

      <style jsx>{`
        .tasks-section {
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

        .task-stats {
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

        .kanban-board {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          min-height: 600px;
        }

        .kanban-column {
          background: rgba(15, 15, 15, 0.5);
          border-radius: 12px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .column-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .column-header h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .task-count {
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .column-tasks {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .task-card {
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .task-card:hover {
          transform: translateY(-2px);
        }

        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .task-header h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.3;
        }

        .priority-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .task-description {
          margin: 0 0 12px 0;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .task-progress {
          margin-bottom: 12px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
        }

        .progress-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .task-subtasks {
          margin-bottom: 12px;
        }

        .subtasks-count {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
        }

        .task-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 12px;
        }

        .task-tag {
          padding: 2px 6px;
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 500;
        }

        .task-tag.more {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
        }

        .task-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
        }

        .task-assignee {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .assignee-avatar {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: 600;
          color: white;
        }

        .assignee-name {
          color: rgba(255, 255, 255, 0.7);
        }

        .task-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .due-date {
          color: rgba(255, 255, 255, 0.6);
        }

        .task-actions {
          display: flex;
          gap: 8px;
        }

        .action-item {
          color: rgba(255, 255, 255, 0.5);
          font-size: 10px;
        }

        .add-task-btn {
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .add-task-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(102, 126, 234, 0.3);
          color: #667eea;
        }

        .tasks-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .task-list-item {
          padding: 20px;
        }

        .list-item-main {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .list-item-checkbox input {
          width: 16px;
          height: 16px;
          margin-top: 4px;
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

        .list-item-header h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
        }

        .list-item-badges {
          display: flex;
          gap: 8px;
        }

        .priority-badge,
        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: capitalize;
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
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .list-item-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .list-item-progress {
          position: relative;
        }

        .circular-progress {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .progress-text {
          position: absolute;
          font-size: 10px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
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
        @media (max-width: 1200px) {
          .kanban-board {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .section-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .header-actions {
            justify-content: space-between;
          }

          .task-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .kanban-board {
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

          .list-item-meta {
            flex-direction: column;
            gap: 4px;
          }
        }
      `}</style>
    </div>
  );
}