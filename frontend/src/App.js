import React, { useEffect, useState } from 'react';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import Dashboard from './components/Dashboard';
import './App.css';

// Use environment variable from Vercel or fallback to localhost for local dev
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function App() {
  const [feedback, setFeedback] = useState([]);
  const [view, setView] = useState('dashboard'); // "dashboard" | "feedback"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch feedback from backend
  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/feedback`);
      if (!res.ok) throw new Error(`Failed to fetch feedback: ${res.status}`);
      const data = await res.json();
      setFeedback(data);
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError('Unable to load feedback. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleAdd = (item) => setFeedback((prev) => [item, ...prev]);
  const handleDelete = (id) => setFeedback((prev) => prev.filter((f) => f.id !== id));

  return (
    <div className="container">
      <header>
        <h1>Student Feedback System</h1>
      </header>

      <main>
        {view === 'dashboard' ? (
          <div className="card dashboard-page">
            <div className="dashboard-content">
              <div className="dashboard-left">
                {loading ? (
                  <p>Loading dashboard...</p>
                ) : error ? (
                  <p style={{ color: 'red' }}>{error}</p>
                ) : (
                  <Dashboard feedback={feedback} />
                )}
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <button onClick={() => setView('feedback')}>Go to Feedback Page</button>
            </div>
          </div>
        ) : (
          <div className="feedback-page">
            <div className="left">
              <FeedbackForm apiBase={API_BASE} onAdded={handleAdd} />
            </div>
            <div className="right">
              {loading ? (
                <p>Loading feedback...</p>
              ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
              ) : (
                <FeedbackList feedback={feedback} apiBase={API_BASE} onDeleted={handleDelete} />
              )}
            </div>
          </div>
        )}
      </main>

      {view !== 'dashboard' && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button onClick={() => setView('dashboard')}>Back to Dashboard</button>
        </div>
      )}

      <footer>
        <p>© {new Date().getFullYear()} Student Feedback System — Created by Ts'ele P Macheli</p>
      </footer>
    </div>
  );
}
