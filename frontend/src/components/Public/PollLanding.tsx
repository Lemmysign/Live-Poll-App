import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PollLanding.css";

const PollLanding: React.FC = () => {
  const [pollCode, setPollCode] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "error" | "success" | "info";
  } | null>(null);
  const navigate = useNavigate();

  const showNotification = (message: string, type: "error" | "success" | "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleJoin = () => {
    const trimmedCode = pollCode.trim();
    
    if (!trimmedCode) {
      showNotification("Please enter a poll code.", "error");
      return;
    }

    // Check if poll code starts with "poll"
    if (!trimmedCode.toLowerCase().startsWith("poll")) {
      showNotification("Invalid poll code. Poll codes must start with 'poll'.", "error");
      return;
    }

    // Check if user has already voted in this poll
    const votedPolls = JSON.parse(localStorage.getItem("votedPolls") || "[]");
    if (votedPolls.includes(trimmedCode)) {
      showNotification("You have already voted in this poll.", "info");
      return;
    }

    // Save poll code to localStorage
    votedPolls.push(trimmedCode);
    localStorage.setItem("votedPolls", JSON.stringify(votedPolls));

    // Navigate to poll page
    navigate(`/poll/${trimmedCode}`);
  };

  return (
    <div className="poll-landing">
      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          <span>{notification.message}</span>
          <button 
            className="notification-close"
            onClick={() => setNotification(null)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

      {/* Navbar */}
      <nav className="navbar">
        <img
          src="/public/evercare-white-logo.png"
          alt="Evercare Logo"
          className="navbar-logo"
        />
      </nav>

      {/* Main Content */}
      <main className="main-section" role="main">
        <h1 className="join-title">Join Poll Now</h1>

        <input
          type="text"
          className="poll-input"
          placeholder="Enter poll code to join live poll"
          value={pollCode}
          onChange={(e) => setPollCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          aria-label="Enter poll code"
        />

        <button
          className="join-btn"
          onClick={handleJoin}
          aria-label="Join Poll"
        >
          Join Poll
        </button>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default PollLanding;