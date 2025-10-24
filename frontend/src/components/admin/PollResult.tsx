import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AnswerResult {
  answerId: number;
  answerText: string;
  responseCount: number;
  percentage: number;
}

interface QuestionResult {
  questionId: number;
  questionText: string;
  answerResults: AnswerResult[];
}

interface PollResultData {
  pollId: number;
  title: string;
  chartType: string;
  totalResponses: number;
  questionResults: QuestionResult[];
}

interface Poll {
  id: number;
  pollCode: string;
  pollStatus: {
    id: number;
    name: string;
  };
}

interface ShareModalProps {
  isOpen: boolean;
  pollCode: string;
  shareLink: string;
  qrCode: string;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  pollCode,
  shareLink,
  qrCode,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    alert(`${type} copied to clipboard!`);
  };

  return (
    <div className="share-modal-backdrop" onClick={onClose}>
      <div className="share-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <div>
            <h2 className="share-modal-title">Share Poll</h2>
            <p className="share-modal-subtitle">Distribute your poll with ease</p>
          </div>
          <button className="share-modal-close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="share-modal-body">
          <div className="share-input-group">
            <label className="share-input-label">Poll Access Code</label>
            <div className="share-input-wrapper">
              <input
                type="text"
                value={pollCode}
                readOnly
                className="share-input-field"
              />
              <button
                className="share-copy-btn"
                onClick={() => handleCopy(pollCode, 'Poll code')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy
              </button>
            </div>
          </div>

          <div className="share-input-group">
            <label className="share-input-label">Direct Link</label>
            <div className="share-input-wrapper">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="share-input-field"
              />
              <button
                className="share-copy-btn"
                onClick={() => handleCopy(shareLink, 'Link')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy
              </button>
            </div>
          </div>

          <div className="share-qr-section">
            <label className="share-input-label">QR Code</label>
            <div className="share-qr-wrapper">
              <img
                src={`/qrcodes/${qrCode}`}
                alt="Poll QR Code"
                className="share-qr-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f4f4f5" width="200" height="200" rx="8"/%3E%3Ctext x="50%" y="50%" font-family="system-ui" font-size="16" fill="%23a1a1aa" text-anchor="middle" dominant-baseline="middle"%3EQR Code%3C/text%3E%3C/svg%3E';
                }}
              />
              <p className="share-qr-description">Scan to access poll instantly</p>
            </div>
          </div>
        </div>

        <div className="share-modal-footer">
          <button className="share-modal-done-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

const PollResult: React.FC = () => {
  const { pollCode } = useParams<{ pollCode: string }>();
  const navigate = useNavigate();
  const [pollData, setPollData] = useState<PollResultData | null>(null);
  const [pollDetails, setPollDetails] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:9092/pollapi';

  useEffect(() => {
    if (pollCode) {
      fetchPollResults();
      fetchPollDetails();
    }
  }, [pollCode]);

  const fetchPollResults = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/polls/${pollCode}/results`,
        { withCredentials: true }
      );
      setPollData(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching poll results:', err);
      setError('Failed to load poll results');
    } finally {
      setLoading(false);
    }
  };

  const fetchPollDetails = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/polls/code/${pollCode}`,
        { withCredentials: true }
      );
      setPollDetails(response.data);
    } catch (err) {
      console.error('Error fetching poll details:', err);
    }
  };

  const handleTogglePollStatus = async () => {
    if (!pollDetails) return;

    try {
      setUpdatingStatus(true);
      const newStatusId = pollDetails.pollStatus.name === 'ACTIVE' ? 2 : 1;

      await axios.put(
        `${API_BASE_URL}/polls/${pollDetails.id}/status/${newStatusId}`,
        {},
        { withCredentials: true }
      );

      await fetchPollDetails();
      alert('Poll status updated successfully!');
    } catch (err) {
      console.error('Error updating poll status:', err);
      alert('Failed to update poll status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeletePoll = async () => {
    if (!pollDetails) return;

    if (
      window.confirm(
        'Are you sure you want to delete this poll? This action cannot be undone.'
      )
    ) {
      try {
        await axios.delete(`${API_BASE_URL}/polls/${pollDetails.id}`, {
          withCredentials: true,
        });
        alert('Poll deleted successfully!');
        navigate('/admin/dashboard');
      } catch (err) {
        console.error('Error deleting poll:', err);
        alert('Failed to delete poll');
      }
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return { class: 'status-badge-active' };
      case 'STOPPED':
        return { class: 'status-badge-paused' };
      case 'COMPLETED':
        return { class: 'status-badge-completed' };
      default:
        return { class: 'status-badge-inactive' };
    }
  };

  const generateChartData = (question: QuestionResult) => {
    const labels = question.answerResults.map((a) => a.answerText);
    const data = question.answerResults.map((a) => a.responseCount);
    const gradientColors = [
      '#6366f1',
      '#8b5cf6',
      '#ec4899',
      '#f59e0b',
      '#10b981',
      '#06b6d4',
      '#f97316',
      '#84cc16',
    ];

    return {
      labels,
      datasets: [
        {
          label: 'Responses',
          data,
          backgroundColor: gradientColors.slice(0, data.length),
          borderColor: '#ffffff',
          borderWidth: 3,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 14,
            family: 'system-ui, -apple-system, sans-serif',
          },
          color: '#52525b',
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#18181b',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.parsed || context.parsed.y || 0;
            return `${label}: ${value} responses`;
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="analytics-dashboard">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !pollData) {
    return (
      <div className="analytics-dashboard">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">{error || 'Poll not found'}</h2>
          <p className="error-description">Unable to load poll data. Please try again.</p>
          <button className="error-back-btn" onClick={() => navigate('/admin/dashboard')}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = pollDetails ? getStatusConfig(pollDetails.pollStatus.name) : null;

  return (
    <div className="analytics-dashboard">
      {/* Top Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-content">
          <button className="nav-back-btn" onClick={() => navigate('/admin/dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          {/* Desktop Actions */}
          <div className="nav-actions desktop-only">
            <button
              className={`nav-action-btn ${
                pollDetails?.pollStatus.name === 'ACTIVE' ? 'nav-btn-pause' : 'nav-btn-play'
              }`}
              onClick={handleTogglePollStatus}
              disabled={updatingStatus}
            >
              {updatingStatus ? (
                <>
                  <div className="btn-spinner"></div>
                  Updating...
                </>
              ) : pollDetails?.pollStatus.name === 'ACTIVE' ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                  Pause Poll
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Resume Poll
                </>
              )}
            </button>

            <button className="nav-action-btn nav-btn-share" onClick={() => setShareModalOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
              </svg>
              Share
            </button>

            <button className="nav-action-btn nav-btn-delete" onClick={handleDeletePoll}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
              Delete
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn mobile-only" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <button
              className={`mobile-menu-item ${
                pollDetails?.pollStatus.name === 'ACTIVE' ? 'menu-pause' : 'menu-play'
              }`}
              onClick={() => {
                handleTogglePollStatus();
                setMobileMenuOpen(false);
              }}
              disabled={updatingStatus}
            >
              {updatingStatus ? (
                <>
                  <div className="btn-spinner"></div>
                  <span>Updating...</span>
                </>
              ) : pollDetails?.pollStatus.name === 'ACTIVE' ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                  <span>Pause Poll</span>
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>Resume Poll</span>
                </>
              )}
            </button>

            <button 
              className="mobile-menu-item menu-share"
              onClick={() => {
                setShareModalOpen(true);
                setMobileMenuOpen(false);
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
              </svg>
              <span>Share</span>
            </button>

            <button 
              className="mobile-menu-item menu-delete"
              onClick={() => {
                handleDeletePoll();
                setMobileMenuOpen(false);
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
              <span>Delete</span>
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="dashboard-container">
        {/* Header Section */}
        <header className="dashboard-header">
          <div className="header-meta-row">
            <span className="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Code: <span className="meta-code">{pollCode}</span>
            </span>
            {statusConfig && pollDetails && (
              <span className={`status-badge ${statusConfig.class}`}>
                {pollDetails.pollStatus.name}
              </span>
            )}
          </div>
          <h1 className="dashboard-title">{pollData.title}</h1>
          <div className="total-responses-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            <div className="responses-info">
              <span className="responses-label">Total Responses</span>
              <span className="responses-count">{pollData.totalResponses.toLocaleString()}</span>
            </div>
          </div>
        </header>

        {/* Questions Analytics */}
        <div className="questions-container">
          {pollData.questionResults.map((question, index) => (
            <div key={question.questionId} className="question-analytics-card">
              <div className="question-header">
                <h2 className="question-header-content">
                  <span className="question-number">Q{index + 1}</span>
                  <span className="question-text">{question.questionText}</span>
                </h2>
              </div>

              <div className="analytics-content">
                {/* Results List */}
                <div className="results-section">
                  <h3 className="section-title">Response Breakdown</h3>
                  <div className="results-list">
                    {question.answerResults.map((answer, idx) => (
                      <div key={answer.answerId} className="result-item">
                        <div className="result-rank">{idx + 1}</div>
                        <div className="result-content">
                          <div className="result-header">
                            <span className="result-label">{answer.answerText}</span>
                            <span className="result-percentage">{answer.percentage.toFixed(1)}%</span>
                          </div>
                          <div className="result-bar-track">
                            <div
                              className="result-bar-fill"
                              style={{ width: `${answer.percentage}%` }}
                            ></div>
                          </div>
                          <span className="result-count">
                            {answer.responseCount.toLocaleString()} {answer.responseCount === 1 ? 'response' : 'responses'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart Visualization */}
                <div className="chart-section">
                  <h3 className="section-title">Visual Distribution</h3>
                  <div className="chart-canvas">
                    {pollData.chartType === 'PIE' ? (
                      <Pie data={generateChartData(question)} options={chartOptions} />
                    ) : (
                      <Bar data={generateChartData(question)} options={chartOptions} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {pollDetails && (
        <ShareModal
          isOpen={shareModalOpen}
          pollCode={pollCode || ''}
          shareLink={`http://localhost:3000/poll/${pollCode}`}
          qrCode={`qr_${pollCode}.png`}
          onClose={() => setShareModalOpen(false)}
        />
      )}

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .analytics-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        /* Loading & Error States */
        .loading-state,
        .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 2rem;
        }

        .loading-spinner {
          width: 56px;
          height: 56px;
          border: 4px solid #e2e8f0;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text {
          margin-top: 1.5rem;
          font-size: 1.125rem;
          color: #64748b;
          font-weight: 500;
        }

        .error-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .error-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #dc2626;
          margin-bottom: 0.5rem;
        }

        .error-description {
          font-size: 1rem;
          color: #64748b;
          margin-bottom: 2rem;
        }

        .error-back-btn {
          padding: 0.875rem 2rem;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .error-back-btn:hover {
          background: #4f46e5;
          transform: translateY(-2px);
        }

        /* Navigation */
        .dashboard-nav {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
        }

        .nav-content {
          max-width: 1800px;
          margin: 0 auto;
          padding: 1.25rem 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          color: #475569;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-back-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .nav-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .desktop-only {
          display: flex;
        }

        .mobile-only {
          display: none;
        }

        .mobile-menu-btn {
          width: 40px;
          height: 40px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          color: #475569;
        }

        .mobile-menu-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .mobile-menu {
          position: absolute;
          top: 100%;
          right: 2.5rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          min-width: 200px;
          z-index: 50;
          margin-top: 0.5rem;
          animation: slideDown 0.2s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mobile-menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          background: white;
          border: none;
          border-bottom: 1px solid #f1f5f9;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9375rem;
          font-weight: 600;
          text-align: left;
        }

        .mobile-menu-item:last-child {
          border-bottom: none;
        }

        .mobile-menu-item:hover {
          background: #f8fafc;
        }

        .mobile-menu-item:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .menu-play {
          color: #10b981;
        }

        .menu-pause {
          color: #f59e0b;
        }

        .menu-share {
          color: #6366f1;
        }

        .menu-delete {
          color: #ef4444;
        }

        .mobile-menu-item svg {
          flex-shrink: 0;
        }

        .nav-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 10px;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .nav-btn-play {
          background: #10b981;
          color: white;
        }

        .nav-btn-play:hover {
          background: #059669;
          transform: translateY(-2px);
        }

        .nav-btn-pause {
          background: #f59e0b;
          color: white;
        }

        .nav-btn-pause:hover {
          background: #d97706;
          transform: translateY(-2px);
        }

        .nav-btn-share {
          background: #6366f1;
          color: white;
        }

        .nav-btn-share:hover {
          background: #4f46e5;
          transform: translateY(-2px);
        }

        .nav-btn-delete {
          background: #ef4444;
          color: white;
        }

        .nav-btn-delete:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }

        .nav-action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        /* Dashboard Container */
        .dashboard-container {
          max-width: 1800px;
          margin: 0 auto;
          padding: 2.5rem;
        }

        /* Header */
        .dashboard-header {
          margin-bottom: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }

        .header-meta-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .dashboard-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.025em;
          line-height: 1.2;
          margin: 0;
        }

        .total-responses-badge {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 16px;
          padding: 1.5rem 2rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          box-shadow: 0 10px 40px rgba(99, 102, 241, 0.3);
          transition: all 0.3s ease;
          width: 100%;
        }

        .total-responses-badge:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 50px rgba(99, 102, 241, 0.4);
        }

        .total-responses-badge svg {
          color: white;
          flex-shrink: 0;
        }

        .responses-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .responses-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .responses-count {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          letter-spacing: -0.025em;
          line-height: 1;
        }

        .header-meta-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .dashboard-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.025em;
          line-height: 1.2;
          margin: 0;
        }

        .meta-item {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9375rem;
          color: #64748b;
          font-weight: 500;
        }

        .meta-item svg {
          color: #94a3b8;
        }

        .meta-code {
          font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
          background: #f1f5f9;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-weight: 700;
          color: #334155;
          font-size: 0.875rem;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.8125rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-badge-active {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge-paused {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge-completed {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-badge-inactive {
          background: #f1f5f9;
          color: #475569;
        }

        /* Questions Container */
        .questions-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .question-analytics-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .question-analytics-card:hover {
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
        }

        .question-header {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 2rem 2.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .question-header-content {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin: 0;
        }

        .question-number {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 800;
          flex-shrink: 0;
        }

        .question-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.4;
          letter-spacing: -0.015em;
        }

        .analytics-content {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          padding: 2.5rem;
        }

        /* Results Section */
        .results-section {
          display: flex;
          flex-direction: column;
        }

        .section-title {
          font-size: 1rem;
          font-weight: 700;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1.5rem;
        }

        .results-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .result-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .result-rank {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: #475569;
          font-size: 0.875rem;
          flex-shrink: 0;
        }

        .result-content {
          flex: 1;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .result-label {
          font-weight: 600;
          color: #0f172a;
          font-size: 1rem;
          line-height: 1.4;
        }

        .result-percentage {
          font-weight: 800;
          font-size: 1.5rem;
          color: #6366f1;
          letter-spacing: -0.025em;
        }

        .result-bar-track {
          height: 12px;
          background: #f1f5f9;
          border-radius: 9999px;
          overflow: hidden;
          margin-bottom: 0.625rem;
        }

        .result-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 9999px;
          transition: width 1s ease-out;
        }

        .result-count {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }

        /* Chart Section */
        .chart-section {
          display: flex;
          flex-direction: column;
        }

        .chart-canvas {
          background: #f8fafc;
          border-radius: 16px;
          padding: 2.5rem;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 700px;
          margin: 0 auto;
          width: 100%;
        }

        /* Share Modal */
        .share-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1.5rem;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .share-modal-container {
          background: white;
          border-radius: 20px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .share-modal-header {
          padding: 2rem 2.5rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .share-modal-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .share-modal-subtitle {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }

        .share-modal-close-btn {
          width: 36px;
          height: 36px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          color: #64748b;
          flex-shrink: 0;
        }

        .share-modal-close-btn:hover {
          background: #f1f5f9;
          color: #334155;
        }

        .share-modal-body {
          padding: 2rem 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .share-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .share-input-label {
          font-size: 0.875rem;
          font-weight: 700;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .share-input-wrapper {
          display: flex;
          gap: 0.75rem;
        }

        .share-input-field {
          flex: 1;
          padding: 0.875rem 1.25rem;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.9375rem;
          font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
          color: #0f172a;
          background: #f8fafc;
          transition: all 0.2s;
        }

        .share-input-field:focus {
          outline: none;
          border-color: #6366f1;
          background: white;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .share-copy-btn {
          padding: 0.875rem 1.5rem;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
        }

        .share-copy-btn:hover {
          background: #4f46e5;
          transform: translateY(-2px);
        }

        .share-copy-btn:active {
          transform: translateY(0);
        }

        .share-qr-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .share-qr-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 2rem;
          background: #f8fafc;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
        }

        .share-qr-image {
          width: 200px;
          height: 200px;
          border-radius: 12px;
          border: 4px solid white;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .share-qr-description {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }

        .share-modal-footer {
          padding: 1.5rem 2.5rem;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
        }

        .share-modal-done-btn {
          padding: 0.875rem 2rem;
          background: #0f172a;
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.9375rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .share-modal-done-btn:hover {
          background: #1e293b;
          transform: translateY(-2px);
        }

        /* Responsive Design for TV Displays (650+ inches) */
        @media (min-width: 2560px) {
          .dashboard-container {
            max-width: 95%;
            padding: 4rem;
          }

          .dashboard-title {
            font-size: 4rem;
          }

          .question-text {
            font-size: 2.5rem;
          }

          .total-responses-badge {
            padding: 2.5rem 3rem;
          }

          .responses-count {
            font-size: 3.5rem;
          }

          .responses-label {
            font-size: 1rem;
          }

          .total-responses-badge svg {
            width: 48px;
            height: 48px;
          }

          .result-percentage {
            font-size: 2.5rem;
          }

          .result-label {
            font-size: 1.5rem;
          }

          .result-bar-track {
            height: 20px;
          }

          .analytics-content {
            padding: 4rem;
            gap: 4rem;
          }

          .question-number {
            width: 80px;
            height: 80px;
            font-size: 1.75rem;
          }

          .nav-content {
            padding: 2rem 4rem;
          }

          .nav-action-btn {
            padding: 1.25rem 2.5rem;
            font-size: 1.25rem;
          }
        }

        /* Tablet Responsive */
        @media (max-width: 1024px) {
          .dashboard-title {
            font-size: 2rem;
          }

          .question-text {
            font-size: 1.25rem;
          }

          .header-content {
            flex-direction: column;
          }

          .header-right {
            width: 100%;
          }

          .total-responses-badge {
            justify-content: center;
          }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 1.5rem;
          }

          .nav-content {
            padding: 1rem 1.5rem;
          }

          .desktop-only {
            display: none !important;
          }

          .mobile-only {
            display: flex;
          }

          .mobile-menu {
            right: 1.5rem;
          }

          .dashboard-title {
            font-size: 1.75rem;
          }

          .header-meta-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .total-responses-badge {
            width: 100%;
          }

          .responses-count {
            font-size: 1.75rem;
          }

          .stat-icon-wrapper {
            width: 56px;
            height: 56px;
          }

          .stat-value {
            font-size: 1.875rem;
          }

          .question-header {
            padding: 1.5rem;
          }

          .question-header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .question-text {
            font-size: 1.125rem;
          }

          .analytics-content {
            padding: 1.5rem;
            gap: 2rem;
          }

          .result-rank {
            width: 32px;
            height: 32px;
            font-size: 0.75rem;
          }

          .result-percentage {
            font-size: 1.25rem;
          }

          .chart-canvas {
            padding: 1.5rem;
          }

          .share-modal-container {
            margin: 1rem;
          }

          .share-modal-header,
          .share-modal-body,
          .share-modal-footer {
            padding: 1.5rem;
          }

          .share-modal-title {
            font-size: 1.25rem;
          }

          .share-input-wrapper {
            flex-direction: column;
          }

          .share-copy-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default PollResult;