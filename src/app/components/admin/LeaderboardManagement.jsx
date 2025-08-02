'use client';

import { useState } from 'react';

export default function LeaderboardManagement({ data, onRefresh, loading }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAchievementModal, setShowAchievementModal] = useState(false);

  const { leaderboard = [], analytics = {} } = data;

  // Filter leaderboard
  const filteredLeaderboard = leaderboard.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || user.userType === filterType;
    
    return matchesSearch && matchesType;
  });

  const ScoreModal = ({ user, onClose }) => {
    const [action, setAction] = useState('updateScore');
    const [scoreValue, setScoreValue] = useState(user?.score || 0);
    const [reason, setReason] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);

      const token = localStorage.getItem('adminToken');

      try {
        const response = await fetch('/api/admin/leaderboard', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: user._id,
            userType: user.userType,
            action,
            value: parseFloat(scoreValue),
            reason
          })
        });

        const result = await response.json();
        
        if (result.success) {
          onRefresh();
          onClose();
        } else {
          alert('Error: ' + result.error);
        }
      } catch (error) {
        alert('Network error: ' + error.message);
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-semibold">Update Score</h3>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-medium">{user?.name || 'Unknown'}</h4>
              <p className="text-white/70 text-sm">{user?.email}</p>
              <p className="text-white/50 text-xs">
                Current Score: {user?.score || 0} points
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Action</label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="updateScore">Set Score</option>
                  <option value="addScore">Add Points</option>
                  <option value="resetScore">Reset Score</option>
                </select>
              </div>

              {action !== 'resetScore' && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    {action === 'addScore' ? 'Points to Add' : 'New Score'}
                  </label>
                  <input
                    type="number"
                    value={scoreValue}
                    onChange={(e) => setScoreValue(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                    placeholder="Enter score"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none"
                  rows="3"
                  placeholder="Enter reason for score update..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  {saving ? 'Updating...' : 'Update Score'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const AchievementModal = ({ user, onClose }) => {
    const [achievementData, setAchievementData] = useState({
      id: '',
      title: '',
      description: '',
      icon: '🏆',
      color: 'gold'
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);

      const token = localStorage.getItem('adminToken');

      try {
        const response = await fetch('/api/admin/leaderboard', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: user._id,
            userType: user.userType,
            action: 'addAchievement',
            value: {
              ...achievementData,
              id: Date.now().toString()
            }
          })
        });

        const result = await response.json();
        
        if (result.success) {
          onRefresh();
          onClose();
        } else {
          alert('Error: ' + result.error);
        }
      } catch (error) {
        alert('Network error: ' + error.message);
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-semibold">Add Achievement</h3>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-medium">{user?.name || 'Unknown'}</h4>
              <p className="text-white/70 text-sm">{user?.email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Achievement Title</label>
                <input
                  type="text"
                  value={achievementData.title}
                  onChange={(e) => setAchievementData({...achievementData, title: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  placeholder="Enter achievement title"
                  required
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
                <textarea
                  value={achievementData.description}
                  onChange={(e) => setAchievementData({...achievementData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none"
                  rows="3"
                  placeholder="Enter achievement description"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Icon</label>
                  <select
                    value={achievementData.icon}
                    onChange={(e) => setAchievementData({...achievementData, icon: e.target.value})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="🏆">🏆 Trophy</option>
                    <option value="🥇">🥇 Gold Medal</option>
                    <option value="🥈">🥈 Silver Medal</option>
                    <option value="🥉">🥉 Bronze Medal</option>
                    <option value="⭐">⭐ Star</option>
                    <option value="🎯">🎯 Target</option>
                    <option value="🚀">🚀 Rocket</option>
                    <option value="💎">💎 Diamond</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Color</label>
                  <select
                    value={achievementData.color}
                    onChange={(e) => setAchievementData({...achievementData, color: e.target.value})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                    <option value="bronze">Bronze</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                    <option value="red">Red</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  {saving ? 'Adding...' : 'Add Achievement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const handleBulkAction = async (action) => {
    if (!confirm(`Are you sure you want to ${action}? This action cannot be undone.`)) {
      return;
    }

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch('/api/admin/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });

      const result = await response.json();
      
      if (result.success) {
        onRefresh();
        alert(`${action} completed successfully!`);
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Network error: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold">Leaderboard Management</h1>
          <p className="text-white/70 mt-1">Monitor and manage user rankings and achievements</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
          <button
            onClick={() => handleBulkAction('recalculateRanks')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Recalculate Ranks</span>
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Participants</p>
              <p className="text-white text-2xl font-bold">{analytics.totalParticipants || 0}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Average Score</p>
              <p className="text-white text-2xl font-bold">{Math.round(analytics.averageScore || 0)}</p>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Highest Score</p>
              <p className="text-white text-2xl font-bold">{analytics.highestScore || 0}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Active Users</p>
              <p className="text-white text-2xl font-bold">{analytics.activeParticipants || 0}</p>
            </div>
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Search Users</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
              placeholder="Search by name or email..."
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">User Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="all">All Types</option>
              <option value="student">Students</option>
              <option value="member">Members</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => handleBulkAction('resetAllScores')}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200"
            >
              Reset All Scores
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-white text-lg font-semibold">
            Leaderboard ({filteredLeaderboard.length} participants)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-white/80 text-sm font-medium">Rank</th>
                <th className="px-6 py-3 text-left text-white/80 text-sm font-medium">User</th>
                <th className="px-6 py-3 text-left text-white/80 text-sm font-medium">Score</th>
                <th className="px-6 py-3 text-left text-white/80 text-sm font-medium">Achievements</th>
                <th className="px-6 py-3 text-left text-white/80 text-sm font-medium">Last Active</th>
                <th className="px-6 py-3 text-left text-white/80 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      <span className="ml-2 text-white">Loading leaderboard...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredLeaderboard.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-white/50">
                    No participants found
                  </td>
                </tr>
              ) : (
                filteredLeaderboard.map((user, index) => (
                  <tr key={user._id} className="hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          user.rank === 1 ? 'bg-yellow-500' : 
                          user.rank === 2 ? 'bg-gray-400' : 
                          user.rank === 3 ? 'bg-orange-500' : 'bg-blue-500'
                        }`}>
                          {user.rank}
                        </div>
                        {user.rankChange !== 0 && (
                          <div className={`ml-2 text-xs ${user.rankChange > 0 ? 'text-red-400' : 'text-green-400'}`}>
                            {user.rankChange > 0 ? '↓' : '↑'}{Math.abs(user.rankChange)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-medium">{user.name || 'Unknown'}</div>
                        <div className="text-white/70 text-sm">{user.email}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.userType === 'student' 
                            ? 'bg-blue-500/20 text-blue-300' 
                            : 'bg-purple-500/20 text-purple-300'
                        }`}>
                          {user.userType}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white text-lg font-bold">{user.score}</div>
                      <div className="text-white/50 text-xs">points</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-1">
                        {(user.achievements || []).slice(0, 3).map((achievement, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center text-xs"
                            title={achievement.title}
                          >
                            {achievement.icon}
                          </div>
                        ))}
                        {(user.achievements || []).length > 3 && (
                          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs text-white">
                            +{(user.achievements || []).length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/70 text-sm">
                      {new Date(user.lastActive).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowScoreModal(true);
                          }}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                        >
                          Score
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowAchievementModal(true);
                          }}
                          className="text-green-400 hover:text-green-300 text-sm font-medium"
                        >
                          Award
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showScoreModal && selectedUser && (
        <ScoreModal
          user={selectedUser}
          onClose={() => {
            setShowScoreModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      {showAchievementModal && selectedUser && (
        <AchievementModal
          user={selectedUser}
          onClose={() => {
            setShowAchievementModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}