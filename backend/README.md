# Backend - Student Feedback App

## Setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and edit if needed
4. `npm run start` (or `npm run dev` with nodemon)

## API
- `GET /feedback` - returns JSON list of feedback
- `POST /feedback` - add new feedback (body: studentName, courseCode, comments, rating)
- `DELETE /feedback/:id` - delete feedback by id (bonus)
