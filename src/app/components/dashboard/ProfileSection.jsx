"use client";
import { useState, useEffect } from 'react';

export default function ProfileSection({ userProfile, onProfileUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);
  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  // Update editedProfile when userProfile changes
  useEffect(() => {
    setEditedProfile(userProfile);
  }, [userProfile]);

  const skills = [
    { name: 'React', level: 90, category: 'Frontend' },
    { name: 'Node.js', level: 85, category: 'Backend' },
    { name: 'Python', level: 80, category: 'Programming' },
    { name: 'MongoDB', level: 75, category: 'Database' },
    { name: 'TypeScript', level: 88, category: 'Programming' },
    { name: 'Docker', level: 70, category: 'DevOps' },
    { name: 'AWS', level: 65, category: 'Cloud' },
    { name: 'GraphQL', level: 72, category: 'API' }
  ];

  const achievements = [
    {
      id: 1,
      title: 'Code Master',
      description: 'Completed 100+ coding challenges',
      icon: '🏆',
      date: '2024-03-15',
      rarity: 'legendary'
    },
    {
      id: 2,
      title: 'Team Player',
      description: 'Successfully collaborated on 10 projects',
      icon: '👥',
      date: '2024-02-28',
      rarity: 'epic'
    },
    {
      id: 3,
      title: 'Quick Learner',
      description: 'Mastered 5 new technologies in a month',
      icon: '⚡',
      date: '2024-01-20',
      rarity: 'rare'
    },
    {
      id: 4,
      title: 'Hackathon Winner',
      description: 'Won first place in AI Challenge 2024',
      icon: '🥇',
      date: '2024-04-01',
      rarity: 'legendary'
    }
  ];

  const projects = [
    {
      id: 1,
      name: 'E-commerce Platform',
      description: 'Full-stack web application with React and Node.js',
      status: 'completed',
      progress: 100,
      technologies: ['React', 'Node.js', 'MongoDB'],
      startDate: '2024-01-15',
      endDate: '2024-03-20',
      role: 'Full Stack Developer'
    },
    {
      id: 2,
      name: 'Mobile Banking App',
      description: 'React Native app with secure payment integration',
      status: 'in-progress',
      progress: 75,
      technologies: ['React Native', 'Firebase', 'Stripe'],
      startDate: '2024-03-01',
      endDate: '2024-05-15',
      role: 'Frontend Developer'
    },
    {
      id: 3,
      name: 'AI Chatbot',
      description: 'Intelligent customer service bot using NLP',
      status: 'planning',
      progress: 15,
      technologies: ['Python', 'TensorFlow', 'FastAPI'],
      startDate: '2024-04-10',
      endDate: '2024-06-30',
      role: 'AI Developer'
    }
  ];

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');
    
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setSaveMessage('User ID not found. Please login again.');
        setSaving(false);
        return;
      }

      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...editedProfile
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsEditing(false);
        setSaveMessage('Profile updated successfully!');
        // Update parent component with new profile data
        if (onProfileUpdate) {
          onProfileUpdate(data.user);
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveMessage('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(userProfile);
    setIsEditing(false);
  };

  // Photo upload functions
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setShowPhotoUpload(true);
    }
  };

  const uploadToCloudinary = async (file) => {
    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "cs_ripper/profile-photo");
    
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) return data.secure_url;
      throw new Error(data.error?.message || "Cloudinary upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;
    
    try {
      const photoUrl = await uploadToCloudinary(photoFile);
      
      // Update the profile with new photo
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setSaveMessage('User ID not found. Please login again.');
        return;
      }

      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          photo: photoUrl
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSaveMessage('Profile picture updated successfully!');
        setShowPhotoUpload(false);
        setPhotoFile(null);
        setPhotoPreview(null);
        
        // Update parent component with new profile data
        if (onProfileUpdate) {
          onProfileUpdate(data.user);
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage(data.error || 'Failed to update profile picture');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      setSaveMessage('Photo upload failed. Please try again.');
    }
  };

  const handlePhotoCancel = () => {
    setShowPhotoUpload(false);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return '#FFD700';
      case 'epic': return '#9333EA';
      case 'rare': return '#3B82F6';
      case 'common': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'in-progress': return '#F59E0B';
      case 'planning': return '#3B82F6';
      case 'on-hold': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getSkillColor = (level) => {
    if (level >= 90) return '#10B981';
    if (level >= 75) return '#3B82F6';
    if (level >= 60) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="profile-section">
      {/* Profile Header */}
      <div className="profile-header liquid-glass">
        <div className="profile-banner">
          <div className="banner-gradient"></div>
        </div>
        <div className="profile-info">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <img src={photoPreview || userProfile.avatar} alt={userProfile.name} />
              <div className="avatar-ring"></div>
              <label htmlFor="photo-upload" className="avatar-edit-btn">
                📷
                <input 
                  id="photo-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoChange} 
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            <div className="profile-details">
              <h1>{userProfile.name}</h1>
              <p className="profile-role">{userProfile.role}</p>
              <p className="profile-email">{userProfile.email}</p>
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-value">{userProfile.points}</span>
                  <span className="stat-label">Points</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{userProfile.rank}</span>
                  <span className="stat-label">Rank</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{userProfile.level}</span>
                  <span className="stat-label">Level</span>
                </div>
              </div>
            </div>
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                ✏️ Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button 
                  className="save-btn" 
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? '⏳ Saving...' : '✅ Save'}
                </button>
                <button className="cancel-btn" onClick={handleCancel} disabled={saving}>
                  ❌ Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`save-message ${saveMessage.includes('success') ? 'success' : 'error'}`}>
          {saveMessage}
        </div>
      )}

      {/* Photo Upload Confirmation */}
      {showPhotoUpload && (
        <div className="photo-upload-modal liquid-glass">
          <div className="photo-upload-content">
            <h3>Update Profile Picture</h3>
            <div className="photo-preview">
              <img src={photoPreview} alt="Preview" />
            </div>
            <div className="photo-upload-actions">
              <button 
                className="upload-btn" 
                onClick={handlePhotoUpload}
                disabled={uploadingPhoto}
              >
                {uploadingPhoto ? '⏳ Uploading...' : '✅ Upload Photo'}
              </button>
              <button 
                className="cancel-upload-btn" 
                onClick={handlePhotoCancel}
                disabled={uploadingPhoto}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          👤 Personal Info
        </button>
        <button 
          className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          🎯 Skills
        </button>
        <button 
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          📊 Projects
        </button>
        <button 
          className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          🏆 Achievements
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'personal' && (
          <div className="personal-info liquid-glass">
            <h3>Personal Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                  />
                ) : (
                  <span>{userProfile.name}</span>
                )}
              </div>
              <div className="info-item">
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                  />
                ) : (
                  <span>{userProfile.email}</span>
                )}
              </div>
              <div className="info-item">
                <label>Role</label>
                {isEditing ? (
                  <select
                    value={editedProfile.role}
                    onChange={(e) => setEditedProfile({...editedProfile, role: e.target.value})}
                  >
                    <option value="Student">Student</option>
                    <option value="Developer">Developer</option>
                    <option value="Team Lead">Team Lead</option>
                    <option value="Mentor">Mentor</option>
                  </select>
                ) : (
                  <span>{userProfile.role}</span>
                )}
              </div>
              <div className="info-item">
                <label>Join Date</label>
                <span>{new Date(userProfile.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <label>Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.location || 'Not specified'}
                    onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
                  />
                ) : (
                  <span>{userProfile.location || 'Not specified'}</span>
                )}
              </div>
              <div className="info-item">
                <label>Bio</label>
                {isEditing ? (
                  <textarea
                    value={editedProfile.bio || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <span>{userProfile.bio || 'No bio available'}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="skills-section">
            <div className="skills-header">
              <h3>Technical Skills</h3>
              <button className="add-skill-btn">+ Add Skill</button>
            </div>
            <div className="skills-grid">
              {skills.map((skill, index) => (
                <div key={index} className="skill-card liquid-glass">
                  <div className="skill-header">
                    <div className="skill-name">{skill.name}</div>
                    <div className="skill-category">{skill.category}</div>
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
                    <span className="skill-percentage">{skill.level}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="projects-section">
            <div className="projects-header">
              <h3>My Projects</h3>
              <button className="add-project-btn">+ New Project</button>
            </div>
            <div className="projects-list">
              {projects.map(project => (
                <div key={project.id} className="project-card liquid-glass">
                  <div className="project-header">
                    <div className="project-info">
                      <h4>{project.name}</h4>
                      <p>{project.description}</p>
                    </div>
                    <div className="project-status">
                      <span 
                        className="status-badge"
                        style={{ 
                          backgroundColor: getStatusColor(project.status) + '20',
                          color: getStatusColor(project.status)
                        }}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="project-progress">
                    <div className="progress-header">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${project.progress}%`,
                          backgroundColor: getStatusColor(project.status)
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="project-technologies">
                    {project.technologies.map(tech => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>

                  <div className="project-footer">
                    <div className="project-dates">
                      <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                      <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="project-role">{project.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="achievements-section">
            <div className="achievements-header">
              <h3>Achievements & Badges</h3>
              <div className="achievement-stats">
                <span>{achievements.length} Total</span>
                <span>{achievements.filter(a => a.rarity === 'legendary').length} Legendary</span>
              </div>
            </div>
            <div className="achievements-grid">
              {achievements.map(achievement => (
                <div key={achievement.id} className="achievement-card liquid-glass">
                  <div className="achievement-icon" style={{ color: getRarityColor(achievement.rarity) }}>
                    {achievement.icon}
                  </div>
                  <div className="achievement-content">
                    <h4>{achievement.title}</h4>
                    <p>{achievement.description}</p>
                    <div className="achievement-footer">
                      <span 
                        className="rarity-badge"
                        style={{ 
                          backgroundColor: getRarityColor(achievement.rarity) + '20',
                          color: getRarityColor(achievement.rarity)
                        }}
                      >
                        {achievement.rarity}
                      </span>
                      <span className="achievement-date">
                        {new Date(achievement.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .profile-section {
          padding: 0;
        }

        .profile-header {
          position: relative;
          margin-bottom: 32px;
          overflow: hidden;
        }

        .profile-banner {
          height: 120px;
          position: relative;
          overflow: hidden;
        }

        .banner-gradient {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          position: relative;
        }

        .banner-gradient::before {
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
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .profile-info {
          padding: 0 32px 32px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: -40px;
          position: relative;
          z-index: 2;
        }

        .profile-avatar-section {
          display: flex;
          align-items: flex-end;
          gap: 24px;
        }

        .profile-avatar {
          position: relative;
          width: 120px;
          height: 120px;
        }

        .profile-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid rgba(15, 15, 15, 0.8);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .avatar-ring {
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          border: 2px solid transparent;
          border-top-color: #667eea;
          border-right-color: #764ba2;
          border-radius: 50%;
          animation: spin 4s linear infinite;
        }

        .avatar-edit-btn {
          position: absolute;
          bottom: 8px;
          right: 8px;
          width: 32px;
          height: 32px;
          background: rgba(102, 126, 234, 0.9);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .avatar-edit-btn:hover {
          background: #667eea;
          transform: scale(1.1);
        }

        .profile-details h1 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 700;
          color: #ffffff;
        }

        .profile-role {
          margin: 0 0 4px 0;
          font-size: 16px;
          color: #667eea;
          font-weight: 600;
        }

        .profile-email {
          margin: 0 0 16px 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
        }

        .profile-stats {
          display: flex;
          gap: 24px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .profile-actions {
          display: flex;
          gap: 12px;
        }

        .edit-btn,
        .save-btn,
        .cancel-btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .edit-btn {
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          border: 1px solid rgba(102, 126, 234, 0.3);
        }

        .edit-btn:hover {
          background: rgba(102, 126, 234, 0.3);
          transform: translateY(-2px);
        }

        .save-btn {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .save-btn:hover {
          background: rgba(16, 185, 129, 0.3);
        }

        .cancel-btn {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .cancel-btn:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        .edit-actions {
          display: flex;
          gap: 8px;
        }

        .profile-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 32px;
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

        .tab-content {
          min-height: 400px;
        }

        .personal-info h3,
        .skills-header h3,
        .projects-header h3,
        .achievements-header h3 {
          margin: 0 0 24px 0;
          font-size: 20px;
          font-weight: 600;
          color: #ffffff;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .info-item label {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
        }

        .info-item span {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .info-item input,
        .info-item select,
        .info-item textarea {
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #ffffff;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .info-item input:focus,
        .info-item select:focus,
        .info-item textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .info-item textarea {
          min-height: 80px;
          resize: vertical;
        }

        .skills-header,
        .projects-header,
        .achievements-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .add-skill-btn,
        .add-project-btn {
          padding: 8px 16px;
          background: rgba(102, 126, 234, 0.2);
          border: 1px solid rgba(102, 126, 234, 0.3);
          border-radius: 6px;
          color: #667eea;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .add-skill-btn:hover,
        .add-project-btn:hover {
          background: rgba(102, 126, 234, 0.3);
          transform: scale(1.05);
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .skill-card {
          padding: 20px;
        }

        .skill-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .skill-name {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
        }

        .skill-category {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.1);
          padding: 4px 8px;
          border-radius: 12px;
        }

        .skill-progress {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .skill-bar {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .skill-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .skill-percentage {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          min-width: 40px;
          text-align: right;
        }

        .projects-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .project-card {
          padding: 24px;
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .project-info h4 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
        }

        .project-info p {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .project-progress {
          margin-bottom: 16px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }

        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .project-technologies {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
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

        .project-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 16px;
        }

        .project-dates {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .project-role {
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
        }

        .achievement-stats {
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .achievement-card {
          padding: 24px;
          text-align: center;
        }

        .achievement-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .achievement-content h4 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
        }

        .achievement-content p {
          margin: 0 0 16px 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .achievement-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .rarity-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .achievement-date {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        /* Save Message Styles */
        .save-message {
          padding: 16px 24px;
          margin: 16px 0;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
          animation: slideIn 0.3s ease-out;
        }

        .save-message.success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10b981;
        }

        .save-message.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Button Disabled State */
        .save-btn:disabled,
        .cancel-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        /* Photo Upload Modal Styles */
        .photo-upload-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }

        .photo-upload-content {
          background: rgba(15, 15, 15, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 32px;
          max-width: 400px;
          width: 90%;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.3s ease-out;
        }

        .photo-upload-content h3 {
          margin: 0 0 24px 0;
          font-size: 24px;
          font-weight: 600;
          color: #ffffff;
        }

        .photo-preview {
          margin: 24px 0;
          display: flex;
          justify-content: center;
        }

        .photo-preview img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .photo-upload-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 24px;
        }

        .upload-btn,
        .cancel-upload-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 120px;
        }

        .upload-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .upload-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }

        .cancel-upload-btn {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }

        .cancel-upload-btn:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.2);
          transform: translateY(-2px);
        }

        .upload-btn:disabled,
        .cancel-upload-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .profile-info {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 20px;
          }

          .profile-avatar-section {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .profile-stats {
            justify-content: center;
          }

          .profile-tabs {
            flex-direction: column;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .skills-grid {
            grid-template-columns: 1fr;
          }

          .achievements-grid {
            grid-template-columns: 1fr;
          }

          .project-header {
            flex-direction: column;
            gap: 12px;
          }

          .project-footer {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}