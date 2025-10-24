import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import config from "../../config/config";
import "../styles/PollResponse.css";

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

interface Poll {
  id: number;
  title: string;
  pollCode: string;
  requiredDemographics: string[];
  questions: Question[];
  allowViewResults: boolean; // Added this field
}

const PollResponse: React.FC = () => {
  const { pollCode } = useParams<{ pollCode: string }>();
  const navigate = useNavigate();
  
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [demographics, setDemographics] = useState({
    name: "",
    age: "",
    gender: "",
  });

  useEffect(() => {
    fetchPoll();
  }, [pollCode]);

  const fetchPoll = async () => {
    try {
      const response = await fetch(`${config.getPollByCodeUrl}/${pollCode}`);
      if (!response.ok) {
        throw new Error("Poll not found");
      }
      const data = await response.json();
      setPoll(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load poll. Please check the poll code.");
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerId,
    });
  };

  const handleDemographicChange = (field: string, value: string) => {
    setDemographics({
      ...demographics,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    // Validate all questions are answered
    if (poll && Object.keys(selectedAnswers).length !== poll.questions.length) {
      showPopup("Please answer all questions", "error");
      return;
    }

    // Validate demographics if required
    if (poll?.requiredDemographics) {
      for (const field of poll.requiredDemographics) {
        if (!demographics[field as keyof typeof demographics]) {
          showPopup(`Please provide your ${field}`, "error");
          return;
        }
      }
    }

    // Prepare the request payload
    const payload = {
      pollCode: pollCode,
      respondentName: demographics.name || null,
      respondentGender: demographics.gender || null,
      respondentAge: demographics.age ? parseInt(demographics.age) : null,
      answers: Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
        questionId: parseInt(questionId),
        answerId: answerId,
      })),
    };

    try {
      const response = await fetch(config.submitResponseUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit response');
      }

      showPopup("Thank you for participating! Your response has been submitted.", "success");
      
      // NEW: Check if poll allows viewing results
      if (poll?.allowViewResults) {
        // Redirect to live results after 1.5 seconds
        setTimeout(() => {
          navigate(`/admin/poll/live/${pollCode}`);
        }, 1500);
      } else {
        // Redirect to home page after 2 seconds
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit response. Please try again.";
      showPopup(errorMessage, "error");
    }
  };

  const [popup, setPopup] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showPopup = (message: string, type: "success" | "error") => {
    setPopup({ message, type });
    setTimeout(() => setPopup(null), 3000);
  };

  if (loading) {
    return (
      <div className="poll-response-page">
        <nav className="poll-response-navbar">
          <img
            src="/evercare-white-logo.png"
            alt="Evercare Logo"
            className="poll-response-logo"
          />
        </nav>
        <main className="poll-response-main">
          <p className="poll-loading-text">Loading poll...</p>
        </main>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="poll-response-page">
        <nav className="poll-response-navbar">
          <img
            src="/evercare-white-logo.png"
            alt="Evercare Logo"
            className="poll-response-logo"
          />
        </nav>
        <main className="poll-response-main">
          <p className="poll-error-text">{error || "Poll not found"}</p>
          <button className="poll-back-error-btn" onClick={() => navigate("/")}>
            Go Back
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="poll-response-page">
      {/* Popup Notification */}
      {popup && (
        <div className={`poll-notification-popup ${popup.type}`}>
          <div className="poll-notification-content">
            <span className="poll-notification-icon">
              {popup.type === "success" ? "✓" : "✕"}
            </span>
            <p className="poll-notification-message">{popup.message}</p>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="poll-response-navbar">
        <img
          src="/evercare-white-logo.png"
          alt="Evercare Logo"
          className="poll-response-logo"
        />
      </nav>

      {/* Main Content */}
      <main className="poll-response-main">
        <div className="poll-response-wrapper">
          {/* Back Button */}
          <button className="poll-back-button" onClick={() => navigate("/")}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </button>

          <div className="poll-form-card">
            <h1 className="poll-form-title">{poll.title}</h1>

            {/* Questions */}
            {poll.questions.map((question, index) => (
              <div key={question.id} className="poll-question-block">
                <h2 className="poll-question-text">
                  <span className="poll-question-number">Q{index + 1}.</span> {question.text}
                </h2>
                <div className="poll-answers-list">
                  {question.answers
                    .sort((a, b) => a.answerOrder - b.answerOrder)
                    .map((answer) => (
                      <label
                        key={answer.id}
                        className={`poll-answer-option ${
                          selectedAnswers[question.id] === answer.id
                            ? "poll-answer-selected"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={answer.id}
                          checked={selectedAnswers[question.id] === answer.id}
                          onChange={() =>
                            handleAnswerSelect(question.id, answer.id)
                          }
                        />
                        <span className="poll-answer-text">{answer.text}</span>
                      </label>
                    ))}
                </div>
              </div>
            ))}

            {/* Demographics */}
            {poll.requiredDemographics && poll.requiredDemographics.length > 0 && (
              <div className="poll-demographics-section">
                <h2 className="poll-demographics-title">Your Information</h2>

                {poll.requiredDemographics.includes("name") && (
                  <div className="poll-form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      className="poll-demographic-input"
                      placeholder="Enter your name"
                      value={demographics.name}
                      onChange={(e) =>
                        handleDemographicChange("name", e.target.value)
                      }
                    />
                  </div>
                )}

                {poll.requiredDemographics.includes("age") && (
                  <div className="poll-form-group">
                    <label htmlFor="age">Age</label>
                    <input
                      type="number"
                      id="age"
                      className="poll-demographic-input"
                      placeholder="Enter your age"
                      value={demographics.age}
                      onChange={(e) =>
                        handleDemographicChange("age", e.target.value)
                      }
                    />
                  </div>
                )}

                {poll.requiredDemographics.includes("gender") && (
                  <div className="poll-form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      className="poll-demographic-input"
                      value={demographics.gender}
                      onChange={(e) =>
                        handleDemographicChange("gender", e.target.value)
                      }
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button className="poll-submit-button" onClick={handleSubmit}>
              Submit Response
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="poll-response-footer">
        <p>© 2025 All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default PollResponse;