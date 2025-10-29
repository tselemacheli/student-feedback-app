import React, { useState } from 'react';

export default function FeedbackForm({ apiBase, onAdded }) {
  const [studentName, setStudentName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [comments, setComments] = useState('');
  const [rating, setRating] = useState(5);
  const [error, setError] = useState('');

  // Validate name: only alphabets, max 3 words
  const handleNameChange = (e) => {
    const input = e.target.value;
    const cleaned = input.replace(/[^a-zA-Z\s]/g, ''); // only letters + spaces
    const words = cleaned.trim().split(/\s+/);
    if (words.length <= 3) {
      setStudentName(cleaned);
      setError('');
    } else {
      setError('Name can only contain up to 3 words.');
    }
  };

  // Validate course code: only letters and numbers
  const handleCourseChange = (e) => {
    const input = e.target.value;
    const cleaned = input.replace(/[^a-zA-Z0-9]/g, ''); // only letters + digits
    if (input !== cleaned) {
      setError('Course code can only contain letters and numbers.');
    } else {
      setError('');
    }
    setCourseCode(cleaned);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!studentName.trim() || !courseCode.trim() || !rating) {
      setError('Please complete all required fields.');
      return;
    }

    const nameWords = studentName.trim().split(/\s+/);
    if (nameWords.length > 3) {
      setError('Name can only have up to 3 words.');
      return;
    }

    const payload = { studentName, courseCode, comments, rating: Number(rating) };

    try {
      const res = await fetch(`${apiBase}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit');
      }

      const listRes = await fetch(`${apiBase}/feedback`);
      const list = await listRes.json();
      onAdded(list[0]);

      setStudentName('');
      setCourseCode('');
      setComments('');
      setRating(5);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Submission failed');
    }
  };

  return (
    <div className="card">
      <h2>Submit Feedback</h2>
      {error && <div style={{ color: 'red', marginBottom: '8px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Student Name</label><br />
          <input
            value={studentName}
            onChange={handleNameChange}
            placeholder="e.g. Ts'ele Peter Macheli"
            required
          />
        </div>

        <div>
          <label>Course Code</label><br />
          <input
            value={courseCode}
            onChange={handleCourseChange}
            placeholder="e.g. BIWA2110"
            required
          />
        </div>

        <div>
          <label>Comments</label><br />
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={3}
            placeholder="Write your feedback here..."
          />
        </div>

        <div>
          <label>Rating (1-5)</label><br />
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>

        <div style={{ marginTop: 10 }}>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}
