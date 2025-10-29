import React, { useEffect, useState } from 'react';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import Dashboard from './components/Dashboard';
import './App.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

export default function App() {
  const [feedback, setFeedback] = useState([]);
  const [view, setView] = useState('dashboard'); // dashboard | feedback

  const fetchFeedback = async () => {
    try {
      const res = await fetch(`${API_BASE}/feedback`);
      const data = await res.json();
      setFeedback(data);
    } catch (err) {
      console.error('Fetch error', err);
    }
  };

  useEffect(() => { fetchFeedback(); }, []);

  const handleAdd = (item) => setFeedback(prev => [item, ...prev]);
  const handleDelete = (id) => setFeedback(prev => prev.filter(f => f.id !== id));

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
                <Dashboard feedback={feedback} />
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button onClick={() => setView('feedback')}>
                Go to Feedback Page
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="left">
              <FeedbackForm apiBase={API_BASE} onAdded={handleAdd} />
            </div>
            <div className="right">
              <FeedbackList feedback={feedback} apiBase={API_BASE} onDeleted={handleDelete} />
            </div>
          </>
        )}
      </main>

      {view !== 'dashboard' && (
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button onClick={() => setView('dashboard')}>Back to Dashboard</button>
        </div>
      )}

      <footer><p>© {new Date().getFullYear()} Student Feedback System — Create by Ts'ele P Macheli</p></footer>
    </div>
  );
}
