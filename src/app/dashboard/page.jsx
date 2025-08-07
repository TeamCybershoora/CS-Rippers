"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { requireAuth, clearAuthData } from "../../lib/auth";
import Sidebar from "../components/dashboard/Sidebar";
import OverviewSection from "../components/dashboard/OverviewSection";
import ProfileSection from "../components/dashboard/ProfileSection";
import HackathonsSection from "../components/dashboard/HackathonsSection";
import TasksSection from "../components/dashboard/TasksSection";
import AchievementsSection from "../components/dashboard/AchievementsSection";
import AnalyticsSection from "../components/dashboard/AnalyticsSection";



export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Loading...',
    email: 'Loading...',
    role: 'Loading...',
    joinDate: '2024-01-15',
    avatar: '/images/CSR Logo.png',
    level: 'Advanced',
    points: 2450,
    rank: '#12',
    completedTasks: 45,
    totalTasks: 60
  });
  const [loading, setLoading] = useState(true);

  const [hackathonHistory, setHackathonHistory] = useState([
    {
      id: 1,
      name: 'AI Innovation Challenge 2024',
      date: '2024-03-15',
      position: '2nd Place',
      team: 'Code Warriors',
      prize: '$5,000',
      status: 'completed',
      technologies: ['React', 'Python', 'TensorFlow']
    },
    {
      id: 2,
      name: 'Web3 Hackathon',
      date: '2024-02-20',
      position: '1st Place',
      team: 'Blockchain Builders',
      prize: '$10,000',
      status: 'completed',
      technologies: ['Solidity', 'React', 'Node.js']
    },
    {
      id: 3,
      name: 'Mobile App Challenge',
      date: '2024-04-10',
      position: 'Participant',
      team: 'Mobile Masters',
      prize: 'Certificate',
      status: 'ongoing',
      technologies: ['React Native', 'Firebase']
    }
  ]);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Complete React Advanced Course',
      description: 'Finish all modules of the advanced React course',
      dueDate: '2024-04-15',
      status: 'in-progress',
      priority: 'high',
      progress: 75
    },
    {
      id: 2,
      title: 'Submit Portfolio Project',
      description: 'Create and submit a full-stack portfolio project',
      dueDate: '2024-04-20',
      status: 'pending',
      priority: 'medium',
      progress: 30
    },
    {
      id: 3,
      title: 'Peer Code Review',
      description: 'Review and provide feedback on 3 peer projects',
      dueDate: '2024-04-12',
      status: 'completed',
      priority: 'low',
      progress: 100
    }
  ]);

  const [achievements, setAchievements] = useState([
    { id: 1, title: 'First Hackathon Win', icon: '🏆', date: '2024-02-20', description: 'Won first place in Web3 Hackathon' },
    { id: 2, title: 'Code Master', icon: '💻', date: '2024-03-01', description: 'Completed 50+ coding challenges' },
    { id: 3, title: 'Team Player', icon: '🤝', date: '2024-03-10', description: 'Successfully collaborated on 10 team projects' },
    { id: 4, title: 'Innovation Award', icon: '💡', date: '2024-03-15', description: 'Most innovative solution in AI Challenge' }
  ]);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      // Check authentication and redirect if not authenticated
      if (!requireAuth(router)) {
        return;
      }
      
      // If authenticated, fetch user data
      await fetchUserData();
    };
    
    checkAuthAndFetchData();
  }, [router]);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        // Clear auth data and redirect
        clearAuthData();
        router.replace("/login");
        return;
      }

      // Fetch enhanced profile data
      const response = await fetch(`/api/user/profile?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        const user = data.user;
        setUserProfile({
          name: user.name || user.fullName || 'User',
          email: user.email || 'No email',
          role: user.role || 'Student',
          joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2024-01-15',
          avatar: user.photo || user.profilePicture || '/images/CSR Logo.png',
          level: 'Advanced',
          points: 2450,
          rank: '#12',
          completedTasks: user.stats?.totalSubmissions || 0,
          totalTasks: user.stats?.totalEvents || 0,
          mobile: user.mobile || 'Not provided',
          userType: user.userType || 'student',
          bio: user.bio || '',
          location: user.location || '',
          skills: user.skills || [],
          eventsParticipated: user.eventsParticipated || [],
          submissions: user.submissions || [],
          stats: user.stats || {}
        });

        // Update hackathon history with real data
        if (user.eventsParticipated && user.eventsParticipated.length > 0) {
          const transformedHistory = user.eventsParticipated.map(event => ({
            id: event.eventId,
            name: event.eventDetails?.title || event.eventTitle,
            date: event.eventDetails?.startDate || event.registeredAt,
            position: event.position || 'Participant',
            team: event.team || 'Individual',
            prize: event.prize || 'Certificate',
            status: getEventStatus(event.eventDetails),
            technologies: event.eventDetails?.technologies || [],
            category: event.eventDetails?.category || 'General',
            difficulty: event.eventDetails?.difficulty || 'Intermediate'
          }));
          setHackathonHistory(transformedHistory);
        }
      } else {
        console.error('Failed to fetch user data:', data.error);
        // If user not found, clear auth and redirect to login
        if (data.error === 'User not found') {
          clearAuthData();
          router.replace("/login");
          return;
        }
        // Keep default loading state if other errors occur
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Don't redirect on network errors, just show loading state
    } finally {
      setLoading(false);
    }
  };

  const getEventStatus = (eventDetails) => {
    if (!eventDetails) return 'completed';
    
    const now = new Date();
    const startDate = new Date(eventDetails.startDate);
    const endDate = new Date(eventDetails.endDate);
    
    if (now < startDate) return 'upcoming';
    if (now >= startDate && now <= endDate) return 'ongoing';
    return 'completed';
  };

  const handleLogout = () => {
    clearAuthData();
    router.replace("/");
  };

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  const handleProfileUpdate = (updatedUser) => {
    setUserProfile(prev => ({
      ...prev,
      ...updatedUser,
      name: updatedUser.name || updatedUser.fullName || prev.name,
      email: updatedUser.email || prev.email,
      role: updatedUser.role || prev.role,
      mobile: updatedUser.mobile || prev.mobile,
      location: updatedUser.location || prev.location,
      bio: updatedUser.bio || prev.bio,
      avatar: updatedUser.photo || updatedUser.profilePicture || prev.avatar
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'in-progress': return '#F59E0B';
      case 'pending': return '#EF4444';
      case 'ongoing': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div className="mobile-overlay" onClick={() => setSidebarCollapsed(true)}></div>
      )}
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        userProfile={userProfile}
        onSidebarToggle={handleSidebarToggle}
      />

      {/* Main Content */}
      <div className="main-content" style={{ marginLeft: sidebarCollapsed ? '80px' : '280px' }}>
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <button 
              className="mobile-menu-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              ☰
            </button>
            <div className="header-content">
              <h1>Welcome back, {userProfile.name}!</h1>
              <p>Here's what's happening with your progress today.</p>
            </div>
          </div>
          <div className="header-right">
            <div className="user-avatar">
              <img src={userProfile.avatar} alt="User Avatar" />
              <div className="online-indicator"></div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {activeTab === 'overview' && <OverviewSection userProfile={userProfile} />}

          {activeTab === 'profile' && <ProfileSection userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />}

          {activeTab === 'hackathons' && <HackathonsSection userProfile={userProfile} hackathonHistory={hackathonHistory} />}

          {activeTab === 'tasks' && <TasksSection />}

          {activeTab === 'achievements' && <AchievementsSection />}

          {activeTab === 'analytics' && <AnalyticsSection />}
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #0f0f0f 50%, #1e1e1e 75%, #0a0a0a 100%);
          background-attachment: fixed;
          color: #ffffff;
          display: flex;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Helvetica, Arial, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .dashboard-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 99;
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-overlay {
            display: block;
          }
        }

        .loading-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #0f0f0f 50%, #1e1e1e 75%, #0a0a0a 100%);
          position: relative;
          z-index: 1;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(102, 126, 234, 0.2);
          border-top: 4px solid #667eea;
          border-right: 4px solid #764ba2;
          border-radius: 50%;
          animation: spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          margin-bottom: 24px;
          filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.3));
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-screen p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 16px;
          margin: 0;
        }

        /* Sidebar Styles */
        .sidebar {
          width: 280px;
          background: rgba(15, 15, 15, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 100;
        }

        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .logo-section h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sidebar-nav {
          flex: 1;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.9);
          transform: translateX(4px);
        }

        .nav-item.active {
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          border: 1px solid rgba(102, 126, 234, 0.3);
        }

        .nav-icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
        }

        .sidebar-footer {
          padding: 24px 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          transform: translateY(-2px);
        }

        /* Main Content Styles */
        .main-content {
          flex: 1;
          margin-left: ${sidebarCollapsed ? '80px' : '280px'};
          background: transparent;
          position: relative;
          z-index: 1;
          transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0 !important;
            padding-left: 20px;
            padding-right: 20px;
          }
          
          .dashboard-header {
            padding: 20px;
            flex-direction: row;
            gap: 16px;
          }
          
          .mobile-menu-btn {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .header-left {
            flex: 1;
          }
          
          .header-content h1 {
            font-size: 24px;
          }
          
          .header-content p {
            font-size: 14px;
          }
          
          .user-avatar {
            width: 40px;
            height: 40px;
          }
        }

        @media (max-width: 480px) {
          .main-content {
            padding-left: 16px;
            padding-right: 16px;
          }
          
          .dashboard-header {
            padding: 16px;
          }
          
          .header-left h1 {
            font-size: 20px;
          }
          
          .content-area {
            padding: 16px 0;
          }
        }

        .dashboard-header {
          padding: 32px 40px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(10, 10, 10, 0.6);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border-radius: 0 0 24px 0;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .mobile-menu-btn {
          display: none;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 18px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mobile-menu-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 1);
        }

        .header-content {
          display: flex;
          flex-direction: column;
        }
          position: relative;
          overflow: hidden;
        }

        .dashboard-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(102, 126, 234, 0.05) 0%,
            rgba(118, 75, 162, 0.05) 50%,
            rgba(16, 185, 129, 0.03) 100%
          );
          pointer-events: none;
        }

        .header-left h1 {
          margin: 0 0 8px 0;
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          z-index: 1;
          letter-spacing: -0.5px;
        }

        .header-left p {
          margin: 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: 16px;
          font-weight: 500;
          position: relative;
          z-index: 1;
        }

        .user-avatar {
          position: relative;
          width: 56px;
          height: 56px;
          z-index: 1;
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(102, 126, 234, 0.4);
          box-shadow: 
            0 0 20px rgba(102, 126, 234, 0.3),
            inset 0 0 20px rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .user-avatar:hover img {
          transform: scale(1.05);
          border-color: rgba(102, 126, 234, 0.6);
          box-shadow: 
            0 0 30px rgba(102, 126, 234, 0.5),
            inset 0 0 20px rgba(255, 255, 255, 0.15);
        }

        .online-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: #10b981;
          border-radius: 50%;
          border: 2px solid #000;
        }

        .content-area {
          padding: 40px;
          background: rgba(5, 5, 5, 0.3);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-radius: 24px 0 0 0;
          margin: 0;
          min-height: calc(100vh - 140px);
          position: relative;
          overflow: hidden;
        }

        .content-area::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(102, 126, 234, 0.02) 0%,
            rgba(118, 75, 162, 0.02) 50%,
            rgba(16, 185, 129, 0.01) 100%
          );
          pointer-events: none;
        }
          min-height: calc(100vh - 120px);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
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
        }

        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(102, 126, 234, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .stat-info h3 {
          margin: 0 0 4px 0;
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
        }

        .stat-info p {
          margin: 0;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
        }

        /* Activity Section */
        .activity-section {
          background: rgba(15, 15, 15, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 32px;
        }

        .activity-section h2 {
          margin: 0 0 24px 0;
          font-size: 20px;
          font-weight: 600;
          color: #ffffff;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.2s ease;
        }

        .activity-item:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(102, 126, 234, 0.2);
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .activity-content h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
        }

        .activity-content p {
          margin: 0 0 8px 0;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
        }

        .activity-time {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
        }

        /* Profile Content */
        .profile-content {
          max-width: 800px;
        }

        .profile-header {
          display: flex;
          gap: 32px;
          margin-bottom: 40px;
          background: rgba(15, 15, 15, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 32px;
        }

        .profile-avatar-large {
          position: relative;
          width: 120px;
          height: 120px;
          flex-shrink: 0;
        }

        .profile-avatar-large img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(102, 126, 234, 0.3);
        }

        .edit-avatar-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 36px;
          height: 36px;
          background: #667eea;
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s ease;
        }

        .edit-avatar-btn:hover {
          transform: scale(1.1);
          background: #5a67d8;
        }

        .profile-info h2 {
          margin: 0 0 8px 0;
          font-size: 32px;
          font-weight: 700;
          color: #ffffff;
        }

        .profile-role {
          margin: 0 0 4px 0;
          color: #667eea;
          font-size: 16px;
          font-weight: 500;
        }

        .profile-email {
          margin: 0 0 24px 0;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
        }

        .profile-stats {
          display: flex;
          gap: 24px;
        }

        .profile-stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
        }

        .profile-details {
          background: rgba(15, 15, 15, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 32px;
        }

        .detail-section h3 {
          margin: 0 0 24px 0;
          font-size: 20px;
          font-weight: 600;
          color: #ffffff;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .detail-item label {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
        }

        .detail-item input {
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #ffffff;
          font-size: 14px;
        }

        .detail-item input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        /* Section Header */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .section-header h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
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
          transition: all 0.2s ease;
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
        }

        /* Hackathon Cards */
        .hackathon-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .hackathon-card {
          background: rgba(15, 15, 15, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .hackathon-card:hover {
          transform: translateY(-4px);
          border-color: rgba(102, 126, 234, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .hackathon-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .hackathon-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .status-badge.completed {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .status-badge.ongoing {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .hackathon-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .detail-row {
          display: flex;
          gap: 8px;
        }

        .detail-label {
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
          min-width: 80px;
        }

        .position {
          color: #f59e0b;
          font-weight: 600;
        }

        .prize {
          color: #10b981;
          font-weight: 600;
        }

        .hackathon-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tech-tag {
          padding: 4px 12px;
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid rgba(102, 126, 234, 0.3);
        }

        /* Task Filters */
        .task-filters {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .filter-btn {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-btn:hover,
        .filter-btn.active {
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          border-color: rgba(102, 126, 234, 0.3);
        }

        /* Task Cards */
        .task-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .task-card {
          background: rgba(15, 15, 15, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
        }

        .task-card:hover {
          transform: translateY(-2px);
          border-color: rgba(102, 126, 234, 0.3);
        }

        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .task-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
        }

        .task-meta {
          display: flex;
          gap: 8px;
        }

        .priority-badge {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .priority-badge.high {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .priority-badge.medium {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .priority-badge.low {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .status-badge.in-progress {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .status-badge.pending {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .task-description {
          margin: 0 0 16px 0;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          line-height: 1.5;
        }

        .task-progress {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
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
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 12px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          min-width: 35px;
        }

        .task-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .due-date {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        .task-actions {
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
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
        }

        /* Achievements Grid */
        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .achievement-card {
          background: rgba(15, 15, 15, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .achievement-card:hover {
          transform: translateY(-4px);
          border-color: rgba(102, 126, 234, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .achievement-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          margin: 0 auto 16px;
        }

        .achievement-card h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
        }

        .achievement-card p {
          margin: 0 0 12px 0;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          line-height: 1.5;
        }

        .achievement-date {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
        }

        /* Analytics Grid */
        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
        }

        .analytics-card {
          background: rgba(15, 15, 15, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
        }

        .analytics-card h3 {
          margin: 0 0 20px 0;
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
        }

        .chart-placeholder {
          display: flex;
          align-items: end;
          gap: 12px;
          height: 120px;
          padding: 16px 0;
        }

        .chart-bar {
          flex: 1;
          background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px 4px 0 0;
          display: flex;
          align-items: end;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: 500;
          padding-bottom: 8px;
          transition: all 0.3s ease;
        }

        .chart-bar:hover {
          transform: scale(1.05);
          filter: brightness(1.2);
        }

        .skill-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .skill-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .skill-item span {
          min-width: 80px;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
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
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .performance-metrics {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .metric {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .metric:last-child {
          border-bottom: none;
        }

        .metric-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
        }

        .metric-value {
          font-size: 16px;
          font-weight: 600;
          color: #667eea;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .sidebar {
            width: 240px;
          }
          
          .main-content {
            margin-left: 240px;
          }
          
          .content-area {
            padding: 24px;
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          
          .main-content {
            margin-left: 0;
          }
          
          .dashboard-header {
            padding: 20px 24px;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .hackathon-details {
            grid-template-columns: 1fr;
          }
          
          .profile-header {
            flex-direction: column;
            text-align: center;
          }
          
          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
} 