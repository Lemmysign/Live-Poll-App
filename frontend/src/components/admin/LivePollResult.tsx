import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/LivePollResult.css';

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

interface WebSocketMessage {
  type: string;
  pollCode: string;
  data: PollResultData;
}

// Declare SockJS and Stomp types
declare global {
  interface Window {
    SockJS: any;
    Stomp: any;
  }
}

const LivePollResult: React.FC = () => {
  const { pollCode } = useParams<{ pollCode: string }>();
  const [pollData, setPollData] = useState<PollResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const stompClientRef = useRef<any>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9092/pollapi';

  // Initial data fetch
  useEffect(() => {
    if (pollCode) {
      fetchPollResults();
    }
  }, [pollCode]);

  // WebSocket connection
  useEffect(() => {
    if (!pollCode) return;

    // Check if SockJS and Stomp are loaded
    if (typeof window.SockJS === 'undefined' || typeof window.Stomp === 'undefined') {
      console.error('SockJS or Stomp not loaded. Make sure scripts are included in index.html');
      return;
    }

    let isSubscribed = false;

    try {
      // Force WebSocket transport only (no XHR fallbacks)
      const socket = new window.SockJS(`${API_BASE_URL}/ws/poll`, null, {
        transports: ['websocket'],
        timeout: 5000
      });
      
      const stompClient = window.Stomp.over(socket);

      // Disable debug logs
      stompClient.debug = () => {};

      // Add heartbeat to keep connection alive
      stompClient.heartbeat.outgoing = 20000;
      stompClient.heartbeat.incoming = 20000;

      stompClient.connect(
        {},
        () => {
          console.log('✅ WebSocket connected (pure WebSocket mode)');
          setIsConnected(true);
          isSubscribed = true;

          // Subscribe to poll updates
          stompClient.subscribe(`/topic/poll/${pollCode}`, (message: any) => {
            try {
              const wsMessage: WebSocketMessage = JSON.parse(message.body);
              
              if (wsMessage.type === 'POLL_UPDATED' && wsMessage.data) {
                console.log('📊 Live update received');
                setPollData(wsMessage.data);
                setError('');
              }
            } catch (err) {
              console.error('Error parsing WebSocket message:', err);
            }
          });
        },
        (error: any) => {
          console.error('❌ WebSocket connection error:', error);
          setIsConnected(false);
          isSubscribed = false;
        }
      );

      stompClientRef.current = stompClient;
    } catch (err) {
      console.error('Error initializing WebSocket:', err);
    }

    // Cleanup on unmount
    return () => {
      if (stompClientRef.current && isSubscribed) {
        try {
          if (stompClientRef.current.connected) {
            stompClientRef.current.disconnect(() => {
              console.log('🔌 WebSocket disconnected cleanly');
              setIsConnected(false);
            });
          }
        } catch (err) {
          console.error('Error disconnecting WebSocket:', err);
        }
      }
    };
  }, [pollCode, API_BASE_URL]);

  const fetchPollResults = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/responses/${pollCode}/results`,
        { withCredentials: true }
      );
      setPollData(response.data);
      setError('');
      setLoading(false);
    } catch (err) {
      console.error('Error fetching poll results:', err);
      setError('Failed to load poll results');
      setLoading(false);
    }
  };

  const getTopAnswers = (answers: AnswerResult[]) => {
    return [...answers].sort((a, b) => b.responseCount - a.responseCount);
  };

  if (loading) {
    return (
      <div className="live-poll-container">
        <div className="live-loading">
          <div className="live-spinner"></div>
          <p>Loading live results...</p>
        </div>
      </div>
    );
  }

  if (error || !pollData) {
    return (
      <div className="live-poll-container">
        <div className="live-error">
          <div className="error-icon">⚠️</div>
          <h2>{error || 'Poll not found'}</h2>
          <p>Unable to load poll data</p>
        </div>
      </div>
    );
  }

  const currentQuestion = pollData.questionResults[currentQuestionIndex];
  const sortedAnswers = getTopAnswers(currentQuestion.answerResults);
  const maxVotes = Math.max(...sortedAnswers.map(a => a.responseCount), 1);

  return (
    <div className="live-poll-container">
      {/* Header */}
      <header className="live-header">
        <div className="live-header-content">
          <h1 className="live-poll-title">{pollData.title}</h1>
          <div className="live-stats">
            <div className="live-stat-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
              <span>{pollData.totalResponses}</span>
            </div>
            <div className={`live-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
              <span className="live-dot"></span>
              {isConnected ? 'LIVE' : 'OFFLINE'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="live-main">
        <div className="live-question-container">
          {/* Question Navigation */}
          {pollData.questionResults.length > 1 && (
            <div className="question-nav">
              {pollData.questionResults.map((_, index) => (
                <button
                  key={index}
                  className={`question-nav-dot ${index === currentQuestionIndex ? 'active' : ''}`}
                  onClick={() => setCurrentQuestionIndex(index)}
                  aria-label={`Question ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Question */}
          <div className="live-question">
            <div className="question-number">Question {currentQuestionIndex + 1} of {pollData.questionResults.length}</div>
            <h2 className="question-text">{currentQuestion.questionText}</h2>
          </div>

          {/* Results */}
          <div className="live-results">
            {sortedAnswers.map((answer, index) => (
              <div key={answer.answerId} className="result-bar-container">
                <div className="result-bar-wrapper">
                  <div 
                    className="result-bar"
                    style={{
                      width: `${(answer.responseCount / maxVotes) * 100}%`,
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <div className="result-bar-content">
                      <span className="result-text">{answer.answerText}</span>
                      <div className="result-stats">
                        <span className="result-percentage">{answer.percentage.toFixed(1)}%</span>
                        <span className="result-votes">{answer.responseCount} {answer.responseCount === 1 ? 'vote' : 'votes'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {pollData.questionResults.length > 1 && (
            <div className="question-arrows">
              <button
                className="arrow-btn"
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                aria-label="Previous question"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                className="arrow-btn"
                onClick={() => setCurrentQuestionIndex(prev => Math.min(pollData.questionResults.length - 1, prev + 1))}
                disabled={currentQuestionIndex === pollData.questionResults.length - 1}
                aria-label="Next question"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LivePollResult;