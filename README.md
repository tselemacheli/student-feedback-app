# Student Feedback App (React + Node + SQLite)

This project contains:
- `backend/` - Node.js + Express server using SQLite (feedback.db)
- `frontend/` - React app (create-react-app style)

## How to run
1. Start backend:
   - `cd backend`
   - `npm install`
   - copy `.env.example` to `.env` and adjust if needed
   - `npm start`

2. Start frontend:
   - `cd frontend`
   - `npm install`
   - copy `.env.example` to `.env` and adjust REACT_APP_API_BASE if backend is remote
   - `npm start`

The frontend expects the backend at http://localhost:4000 by default.

## Notes
- Database is SQLite (file: backend/feedback.db). The server will create it automatically.
- Bonus features implemented: DELETE endpoint, basic form validation, environment variables.
