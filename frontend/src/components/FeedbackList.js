import React from 'react';

export default function FeedbackList({ feedback, apiBase, onDeleted }) {
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      const res = await fetch(`${apiBase}/feedback/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      onDeleted(id);
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  return (
    <div className="card">
      <h2>Feedbacks</h2>
      {feedback.length === 0 && <div>No feedback yet.</div>}
      <ul style={{listStyle:'none', padding:0}}>
        {feedback.map(f => (
          <li key={f.id} style={{borderBottom:'1px solid #eee', padding:'8px 0'}}>
            <strong>{f.studentName}</strong> — <em>{f.courseCode}</em>
            <div>Rating: {f.rating} / 5</div>
            <div style={{marginTop:6}}>{f.comments}</div>
            <div style={{marginTop:6}}>
              <button onClick={()=>handleDelete(f.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
