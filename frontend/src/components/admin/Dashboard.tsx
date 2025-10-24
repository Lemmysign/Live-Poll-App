import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

interface Answer {
  id: number;
  text: string;
  answerOrder: number;
  responseCount: number;
}

interface Question {
  id: number;
  text: string;
  questionOrder: number;
  answers: Answer[];
}

interface PollStatus {
  id: number;
  name: 'ACTIVE' | 'STOPPED' | 'COMPLETED';
  description: string;
}

interface ChartType {
  id: number;
  name: string;
  description: string;
}

interface Poll {
  id: number;
  title: string;
  pollCode: string;
  shareLink: string;
  qrCode: string;
  pollStatus: PollStatus;
  chartType: ChartType;
  allowViewResults: boolean;
  requiredDemographics: string[];
  questions: Question[];
  totalResponses: number;
}

interface AdminData {
  id: number;
  username: string;
}

interface ShareModalProps {
  isOpen: boolean;
  poll: Poll | null;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, poll, onClose }) => {
  if (!isOpen || !poll) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Share Poll</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-body">
          <div className="share-section">
            <label className="share-label">Poll Code:</label>
            <div className="share-item">
              <input 
                type="text" 
                value={poll.pollCode} 
                readOnly 
                className="share-input"
              />
              <button 
                className="copy-button"
                onClick={() => navigator.clipboard.writeText(poll.pollCode)}
              >
                Copy
              </button>
            </div>
          </div>

          <div className="share-section">
            <label className="share-label">Share Link:</label>
            <div className="share-item">
              <input 
                type="text" 
                value={poll.shareLink} 
                readOnly 
                className="share-input"
              />
              <button 
                className="copy-button"
                onClick={() => navigator.clipboard.writeText(poll.shareLink)}
              >
                Copy
              </button>
            </div>
          </div>

          <div className="share-section">
            <label className="share-label">QR Code:</label>
            <div className="qr-code-container">
              <img 
                src={`/qrcodes/${poll.qrCode}`} 
                alt="Poll QR Code" 
                className="qr-code-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23f0f0f0" width="150" height="150"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3EQR Code%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-button-close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [updatingPollId, setUpdatingPollId] = useState<number | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9092/pollapi';
  const getAdminDetailsUrl = (adminId: number | string) => `${API_BASE_URL}/admin/details/${adminId}`;
  const getAdminDashboardUrl = (adminId: number | string) => `${API_BASE_URL}/polls/dashboard/${adminId}`;
  const adminLogoutUrl = `${API_BASE_URL}/admin/logout`;
  const updatePollStatusUrl = (pollId: number | string, statusId: number) => `${API_BASE_URL}/polls/${pollId}/status/${statusId}`;

  const POLL_STATUS = {
    ACTIVE: 1,
    STOPPED: 2,
    COMPLETED: 3,
  };

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        const storedAdminId = localStorage.getItem('adminId');
        
        if (!storedAdminId) {
          navigate('/admin/login');
          return;
        }

        // Fetch admin details
        const adminResponse = await axios.get(getAdminDetailsUrl(storedAdminId), {
          withCredentials: true
        });

        if (!isMounted) return;

        if (adminResponse.data.success && adminResponse.data.data) {
          setAdminData(adminResponse.data.data);
        } else {
          navigate('/admin/login');
          return;
        }

        // Fetch polls dashboard
        const pollsResponse = await axios.get(getAdminDashboardUrl(storedAdminId), {
          withCredentials: true
        });

        if (!isMounted) return;

        console.log('Polls API Response:', pollsResponse.data);

        if (Array.isArray(pollsResponse.data.recentPolls)) {
          setPolls(pollsResponse.data.recentPolls);
        } else {
          console.warn('Unexpected polls response format:', pollsResponse.data);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching dashboard data:', error);
        navigate('/admin/login');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        adminLogoutUrl,
        {},
        { withCredentials: true }
      );
      
      localStorage.removeItem('admin');
      localStorage.removeItem('adminId');
      localStorage.removeItem('adminUsername');
      
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.clear();
      navigate('/admin/login');
    }
  };

  const handleCreatePoll = () => {
    navigate('/admin/poll/create');
  };

  const handleViewDetails = (poll: Poll) => {
    navigate(`/admin/poll/results/${poll.pollCode}`);
  };

  const handleSharePoll = (poll: Poll) => {
    setSelectedPoll(poll);
    setShareModalOpen(true);
  };

  const handleStopPoll = async (poll: Poll) => {
    try {
      setUpdatingPollId(poll.id);
      
      // Toggle between STOPPED and ACTIVE
      const newStatusId = poll.pollStatus.name === 'ACTIVE' ? POLL_STATUS.STOPPED : POLL_STATUS.ACTIVE;
      const newStatusName: 'ACTIVE' | 'STOPPED' = newStatusId === POLL_STATUS.ACTIVE ? 'ACTIVE' : 'STOPPED';
      
      // Update UI optimistically BEFORE API call
      setPolls(prevPolls => prevPolls.map(p => 
        p.id === poll.id 
          ? {
              ...p,
              pollStatus: {
                ...p.pollStatus,
                id: newStatusId,
                name: newStatusName
              }
            }
          : p
      ));

      // Make API call
      await axios.put(
        updatePollStatusUrl(poll.id, newStatusId),
        {},
        { withCredentials: true }
      );

      console.log('Poll status updated successfully');
    } catch (error) {
      console.error('Error updating poll status:', error);
      
      // Revert the optimistic update on error
      setPolls(prevPolls => prevPolls.map(p => 
        p.id === poll.id 
          ? {
              ...p,
              pollStatus: {
                ...p.pollStatus,
                id: poll.pollStatus.id,
                name: poll.pollStatus.name
              }
            }
          : p
      ));
      
      alert('Failed to update poll status. Please try again.');
    } finally {
      setUpdatingPollId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'status-active';
      case 'STOPPED':
        return 'status-inactive';
      case 'COMPLETED':
        return 'status-completed';
      default:
        return 'status-inactive';
    }
  };

  const getTotalVotes = (poll: Poll) => {
    return poll.questions.reduce((total, question) => {
      return total + question.answers.reduce((sum, answer) => sum + answer.responseCount, 0);
    }, 0);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <nav className="dashboard-nav">
          <div className="nav-logo">
            <img src="/evercare-white-logo.png" alt="Logo" className="logo-img" />
          </div>
        </nav>
        <main className="dashboard-main">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-logo">
          <img src="/evercare-white-logo.png" alt="Logo" className="logo-img" />
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="16 17 21 12 16 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="21" y1="12" x2="9" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Logout
        </button>
      </nav>

      <main className="dashboard-main">
        <section className="welcome-section">
          <h1>Welcome back, {adminData?.username || 'Admin'}</h1>
          <p>Here's what's happening with your polls</p>
        </section>

        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e0e7ff' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
              </svg>
            </div>
            <div className="stat-info">
              <h3>Total Polls</h3>
              <span className="stat-value">{polls.length}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef3c7' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
            </div>
            <div className="stat-info">
              <h3>Total Votes</h3>
              <span className="stat-value">{polls.reduce((sum, poll) => sum + getTotalVotes(poll), 0)}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fee2e2' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <div className="stat-info">
              <h3>Active Polls</h3>
              <span className="stat-value">{polls.filter(p => p.pollStatus.name === 'ACTIVE').length}</span>
            </div>
          </div>
        </section>

        <section className="polls-header">
          <h2>Your Polls</h2>
          <button className="create-poll-btn" onClick={handleCreatePoll}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2" strokeLinecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Create New Poll
          </button>
        </section>

        <section className="polls-grid">
          {polls.length > 0 ? (
            polls.map((poll) => (
              <div key={poll.id} className="poll-card">
                <div className="poll-card-content">
                  <div className="poll-info">
                    <div className="poll-code-row">
                      <span className="poll-label">Poll Code:</span>
                      <span className="poll-code">{poll.pollCode}</span>
                      <span className={`poll-status ${getStatusColor(poll.pollStatus.name)}`}>
                        {poll.pollStatus.name}
                      </span>
                    </div>
                    <h3 className="poll-title">{poll.title}</h3>
                    <div className="poll-stats">
                      <div className="poll-stat-item">
                        <span className="stat-label">Total Questions:</span>
                        <span className="stat-value">{poll.questions.length}</span>
                      </div>
                      <div className="poll-stat-item">
                        <span className="stat-label">Total Votes:</span>
                        <span className="stat-value">{getTotalVotes(poll)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="poll-actions">
                    <button 
                      className="action-button action-button-view"
                      onClick={() => handleViewDetails(poll)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="button-icon">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      View Details
                    </button>
                    <button 
                      className="action-button action-button-share"
                      onClick={() => handleSharePoll(poll)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="button-icon">
                        <circle cx="18" cy="5" r="3"/>
                        <circle cx="6" cy="12" r="3"/>
                        <circle cx="18" cy="19" r="3"/>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                      </svg>
                      Share Poll
                    </button>
                    <button 
                      className={`action-button ${poll.pollStatus.name === 'ACTIVE' ? 'action-button-stop' : 'action-button-restart'}`}
                      onClick={() => handleStopPoll(poll)}
                      disabled={updatingPollId === poll.id}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="button-icon">
                        <circle cx="12" cy="12" r="10"/>
                        <rect x="9" y="9" width="6" height="6"/>
                      </svg>
                      {updatingPollId === poll.id ? 'Updating...' : poll.pollStatus.name === 'ACTIVE' ? 'Stop Poll' : 'Restart Poll'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', gridColumn: '1 / -1' }}>
              <p>No polls found. Create one to get started!</p>
            </div>
          )}
        </section>
      </main>

      <ShareModal 
        isOpen={shareModalOpen} 
        poll={selectedPoll} 
        onClose={() => setShareModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;