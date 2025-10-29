require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'feedback.db');

app.use(cors());
app.use(express.json());

// Initialize SQLite DB
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to connect to DB:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite at', DB_PATH);
});

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS Feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentName TEXT NOT NULL,
  courseCode TEXT NOT NULL,
  comments TEXT,
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
  if (err) console.error('Table creation error:', err);
});

// POST /feedback
app.post('/feedback', (req, res) => {
  const { studentName, courseCode, comments, rating } = req.body;
  if (!studentName || !courseCode || !rating) {
    return res.status(400).json({ error: 'studentName, courseCode, and rating are required.' });
  }
  const sql = `INSERT INTO Feedback (studentName, courseCode, comments, rating) VALUES (?,?,?,?)`;
  db.run(sql, [studentName, courseCode, comments||'', rating], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to add feedback.' });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// GET /feedback
app.get('/feedback', (req, res) => {
  const sql = `SELECT * FROM Feedback ORDER BY created_at DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to retrieve feedback.' });
    }
    res.json(rows);
  });
});

// DELETE /feedback/:id  (bonus)
app.delete('/feedback/:id', (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM Feedback WHERE id = ?`;
  db.run(sql, [id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete.' });
    }
    if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ deleted: true });
  });
});

// Basic health
app.get('/', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
