import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/admin/Login';
import Dashboard from './components/admin/Dashboard';
import PollForm from './components/admin/PollForm';
import PollResult from './components/admin/PollResult';
import LivePollResult from './components/admin/LivePollResult';
import PollLanding from './components/Public/PollLanding';
import PollResponse from './components/Public/PollResponse';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route - redirect to poll landing */}
        <Route path="/" element={<PollLanding />} />

        {/* Admin login route */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin dashboard route */}
        <Route path="/admin/dashboard" element={<Dashboard />} />

        {/* Poll creation route */}
        <Route path="/admin/poll/create" element={<PollForm />} />

        {/* Poll results/details route */}
        <Route path="/admin/poll/results/:pollCode" element={<PollResult />} />

        {/* Live poll results route (NOW PUBLIC - accessible by both admin and users) */}
        <Route path="/admin/poll/live/:pollCode" element={<LivePollResult />} />
        
        {/* Alternative public route for live results (optional) */}
        <Route path="/poll/:pollCode/results" element={<LivePollResult />} />

        {/* Poll voting route */}
        <Route path="/poll/:pollCode" element={<PollResponse />} />

        {/* 404 Not Found */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;