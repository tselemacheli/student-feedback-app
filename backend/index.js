// Load environment variables
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

// Use Render’s dynamic port or fallback to 4000 for local development
const PORT = process.env.PORT || 4000;

// SQLite database file path (default: feedback.db in backend directory)
const DB_PATH = process.env.DB_PATH || path.resolve(__dirname, 'feedback.db');

// Middleware setup
app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Failed to connect to database:', err.message);
    process.exit(1);
  }
  console.log(`✅ Connected to SQLite database at: ${DB_PATH}`);
});

// Ensure Feedback table exists
db.run(
  `CREATE TABLE IF NOT EXISTS Feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentName TEXT NOT NULL,
    courseCode TEXT NOT NULL,
    comments TEXT,
    rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  (err) => {
    if (err) console.error('⚠️ Table creation error:', err.message);
    else console.log('📋 Feedback table ready.');
  }
);

// --- API Routes ---

// POST /feedback — Add new feedback entry
app.post('/feedback', (req, res) => {
  const { studentName, courseCode, comments, rating } = req.body;

  if (!studentName || !courseCode || !rating) {
    return res
      .status(400)
      .json({ error: 'studentName, courseCode, and rating are required.' });
  }

  const sql = `INSERT INTO Feedback (studentName, courseCode, comments, rating) VALUES (?,?,?,?)`;
  db.run(sql, [studentName, courseCode, comments || '', rating], function (err) {
    if (err) {
      console.error('❌ Insert error:', err.message);
      return res.status(500).json({ error: 'Failed to add feedback.' });
    }
    console.log(`📝 Feedback added (ID: ${this.lastID})`);
    res.status(201).json({ id: this.lastID });
  });
});

// GET /feedback — Retrieve all feedback
app.get('/feedback', (req, res) => {
  const sql = `SELECT * FROM Feedback ORDER BY created_at DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('❌ Select error:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve feedback.' });
    }
    res.json(rows);
  });
});

// DELETE /feedback/:id — Remove a feedback entry
app.delete('/feedback/:id', (req, res) => {
  const sql = `DELETE FROM Feedback WHERE id = ?`;
  db.run(sql, [req.params.id], function (err) {
    if (err) {
      console.error('❌ Delete error:', err.message);
      return res.status(500).json({ error: 'Failed to delete feedback.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Feedback not found.' });
    }
    console.log(`🗑️ Feedback deleted (ID: ${req.params.id})`);
    res.json({ deleted: true });
  });
});

// Health check route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    database: path.basename(DB_PATH),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
