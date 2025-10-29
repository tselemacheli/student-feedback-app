import React from 'react';

export default function Dashboard({ feedback }) {
  const total = feedback.length;
  const avg =
    total === 0 ? 0 : (feedback.reduce((s, f) => s + Number(f.rating), 0) / total).toFixed(2);

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h2>Welcome to the Student Feedback System</h2>

        <p className="overview-text">
          This web application allows students to submit feedback for their courses, including
          ratings and comments. Administrators and lecturers can view all submitted feedback
          through a centralized dashboard.
        </p>

        {/* ✅ Cards placed below overview and kept side-by-side */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{total}</h3>
            <p>Total Feedback Entries</p>
          </div>
          <div className="stat-card">
            <h3>{avg}</h3>
            <p>Average Rating</p>
          </div>
        </div>
      </div>

      {total === 0 && (
        <p style={{ textAlign: 'center', color: 'gray', marginTop: '20px' }}>
          No feedback has been submitted yet. Click below to get started!
        </p>
      )}
    </div>
  );
}
