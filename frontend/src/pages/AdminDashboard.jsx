import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { getErrorMessage } from '../utils/errorHandler';
import '../styles/admin.css';

/**
 * Admin Dashboard Component
 * Comprehensive admin panel for managing quizzes and users
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    publishedQuizzes: 0,
    totalUsers: 0,
    totalAttempts: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch quizzes
      const quizzesRes = await quizService.getAllQuizzes();
      const quizzesData = quizzesRes.data.data || [];
      setQuizzes(quizzesData);

      // Calculate stats
      setStats({
        totalQuizzes: quizzesData.length,
        publishedQuizzes: quizzesData.filter(q => q.isPublished).length,
        totalUsers: 2, // Demo data
        totalAttempts: quizzesData.reduce((sum, q) => sum + (q.attempts || 0), 0)
      });
    } catch (err) {
      setError(getErrorMessage(err));
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishQuiz = async (quizId) => {
    try {
      // Update quiz publish status
      setQuizzes(quizzes.map(q =>
        q._id === quizId ? { ...q, isPublished: !q.isPublished } : q
      ));
      setSuccess(`Quiz ${!quizzes.find(q => q._id === quizId)?.isPublished ? 'published' : 'unpublished'} successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        // Delete quiz logic here
        setQuizzes(quizzes.filter(q => q._id !== quizId));
        setSuccess('Quiz deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <LoadingSpinner text="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Admin Header */}
      <div className="admin-header">
        <div className="header-content">
          <h1>👨‍💼 Admin Dashboard</h1>
          <p className="subtitle">Manage quizzes, users, and system configuration</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-back"
        >
          ← Back to User Dashboard
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess(null)} />
      )}

      <div className="admin-content">
        {/* Sidebar Navigation */}
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <button
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="icon">📊</span>
              <span>Overview</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'quizzes' ? 'active' : ''}`}
              onClick={() => setActiveTab('quizzes')}
            >
              <span className="icon">📝</span>
              <span>Quizzes</span>
              <span className="badge">{quizzes.length}</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <span className="icon">👥</span>
              <span>Users</span>
              <span className="badge">{stats.totalUsers}</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span className="icon">⚙️</span>
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="admin-main">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-content">
              <h2>Dashboard Overview</h2>

              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-box">
                  <div className="stat-icon">📚</div>
                  <div className="stat-info">
                    <h3>{stats.totalQuizzes}</h3>
                    <p>Total Quizzes</p>
                  </div>
                </div>

                <div className="stat-box">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <h3>{stats.publishedQuizzes}</h3>
                    <p>Published</p>
                  </div>
                </div>

                <div className="stat-box">
                  <div className="stat-icon">👤</div>
                  <div className="stat-info">
                    <h3>{stats.totalUsers}</h3>
                    <p>Total Users</p>
                  </div>
                </div>

                <div className="stat-box">
                  <div className="stat-icon">🎯</div>
                  <div className="stat-info">
                    <h3>{stats.totalAttempts}</h3>
                    <p>Quiz Attempts</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                  <button className="action-btn primary">
                    <span className="icon">➕</span>
                    <span>Create New Quiz</span>
                  </button>
                  <button className="action-btn secondary">
                    <span className="icon">📊</span>
                    <span>View Reports</span>
                  </button>
                  <button className="action-btn secondary">
                    <span className="icon">⚙️</span>
                    <span>System Settings</span>
                  </button>
                  <button className="action-btn secondary">
                    <span className="icon">📧</span>
                    <span>Send Notification</span>
                  </button>
                </div>
              </div>

              {/* Recent Quizzes */}
              <div className="recent-section">
                <h3>Recent Quizzes</h3>
                <div className="quiz-list">
                  {quizzes.slice(0, 3).map((quiz) => (
                    <div key={quiz._id} className="quiz-item">
                      <div className="quiz-info">
                        <h4>{quiz.title}</h4>
                        <p>{quiz.description}</p>
                      </div>
                      <div className="quiz-meta">
                        <span className="meta-item">
                          <span className="label">Questions:</span>
                          <span className="value">{quiz.totalQuestions}</span>
                        </span>
                        <span className="meta-item">
                          <span className="label">Status:</span>
                          <span className={`status ${quiz.isPublished ? 'published' : 'draft'}`}>
                            {quiz.isPublished ? '📤 Published' : '📋 Draft'}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quizzes Tab */}
          {activeTab === 'quizzes' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Quiz Management</h2>
                <button className="btn-primary">➕ Create New Quiz</button>
              </div>

              <div className="quiz-management">
                <div className="filter-bar">
                  <input
                    type="text"
                    placeholder="Search quizzes..."
                    className="search-input"
                  />
                  <select className="filter-select">
                    <option>All Status</option>
                    <option>Published</option>
                    <option>Draft</option>
                  </select>
                </div>

                <div className="quizzes-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Quiz Title</th>
                        <th>Questions</th>
                        <th>Marks</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizzes.map((quiz) => (
                        <tr key={quiz._id}>
                          <td>
                            <strong>{quiz.title}</strong>
                          </td>
                          <td>{quiz.totalQuestions}</td>
                          <td>{quiz.totalMarks}</td>
                          <td>
                            <span className={`status-badge ${quiz.isPublished ? 'published' : 'draft'}`}>
                              {quiz.isPublished ? '✓ Published' : '✐ Draft'}
                            </span>
                          </td>
                          <td>{new Date(quiz.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn-sm btn-edit"
                                title="Edit"
                              >
                                ✎
                              </button>
                              <button
                                className="btn-sm btn-toggle"
                                onClick={() => handlePublishQuiz(quiz._id)}
                                title={quiz.isPublished ? 'Unpublish' : 'Publish'}
                              >
                                {quiz.isPublished ? '📤' : '📋'}
                              </button>
                              <button
                                className="btn-sm btn-delete"
                                onClick={() => handleDeleteQuiz(quiz._id)}
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>User Management</h2>
              </div>

              <div className="users-management">
                <div className="filter-bar">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="search-input"
                  />
                  <select className="filter-select">
                    <option>All Users</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>

                <div className="users-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Attempts</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>admin@test.com</td>
                        <td>
                          <span className="role-badge admin">Admin</span>
                        </td>
                        <td>
                          <span className="status-badge active">🟢 Active</span>
                        </td>
                        <td>-</td>
                        <td>Jan 18, 2026</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-sm btn-view">👁️</button>
                            <button className="btn-sm btn-edit">✎</button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>user@test.com</td>
                        <td>
                          <span className="role-badge user">User</span>
                        </td>
                        <td>
                          <span className="status-badge active">🟢 Active</span>
                        </td>
                        <td>12</td>
                        <td>Jan 18, 2026</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-sm btn-view">👁️</button>
                            <button className="btn-sm btn-edit">✎</button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="tab-content">
              <h2>System Settings</h2>

              <div className="settings-section">
                <h3>General Settings</h3>
                <div className="setting-item">
                  <label>Application Name</label>
                  <input type="text" value="QuizHub" className="setting-input" />
                </div>
                <div className="setting-item">
                  <label>Quiz Timeout (minutes)</label>
                  <input type="number" value="10" className="setting-input" />
                </div>
                <div className="setting-item">
                  <label>Passing Score (%)</label>
                  <input type="number" value="60" className="setting-input" />
                </div>
              </div>

              <div className="settings-section">
                <h3>Features</h3>
                <div className="setting-checkbox">
                  <input type="checkbox" id="feature1" defaultChecked />
                  <label htmlFor="feature1">Allow User Registration</label>
                </div>
                <div className="setting-checkbox">
                  <input type="checkbox" id="feature2" defaultChecked />
                  <label htmlFor="feature2">Show Results Immediately</label>
                </div>
                <div className="setting-checkbox">
                  <input type="checkbox" id="feature3" defaultChecked />
                  <label htmlFor="feature3">Enable Detailed Feedback</label>
                </div>
              </div>

              <div className="settings-actions">
                <button className="btn-primary">💾 Save Settings</button>
                <button className="btn-secondary">↻ Reset to Defaults</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
