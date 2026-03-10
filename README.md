# StenoPro — Stenography Practice Web Application

A full-stack MERN application for stenography practice with role-based access, audio dictation, WPM/accuracy scoring, and dashboards.

## Tech Stack

- **Frontend**: React 18 + Vite, Tailwind CSS, Redux Toolkit, React Router v6, Recharts
- **Backend**: Node.js, Express.js, MongoDB + Mongoose, JWT, Multer, Cloudinary
- **Theme**: Professional blue (#1e3a8a / #3b82f6) with dark mode support

## Roles

| Role | Capabilities |
|------|-------------|
| Student | Practice dictations, view history, leaderboard, daily challenge |
| Teacher | Upload audio/YouTube, manage content, view student reports, export Excel |
| Admin | Manage all users, moderate content, view platform analytics |

## Project Structure

```
steno/
├── backend/          # Express + MongoDB API
│   ├── server.js
│   ├── .env
│   └── src/
│       ├── config/   db.js, cloudinary.js, constants.js
│       ├── models/   User.js, Dictation.js, Practice.js
│       ├── controllers/
│       ├── routes/
│       ├── middleware/
│       └── utils/
└── frontend/         # React + Vite SPA
    ├── .env
    └── src/
        ├── app/      Redux store
        ├── features/ Redux slices
        ├── components/
        └── pages/
```

## Setup Instructions

### 1. Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Cloudinary credentials
npm install
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
# .env already set to http://localhost:5000/api for local dev
npm install
npm run dev
# App runs on http://localhost:5173
```

### 4. Create Admin User

After registering, change a user's role to `admin` directly in MongoDB Atlas:

```js
// In MongoDB Atlas Data Explorer:
db.users.updateOne({ email: "youremail@example.com" }, { $set: { role: "admin" } })
```

## API Endpoints

| Method | Path | Access |
|--------|------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Any auth |
| GET | `/api/dictations` | Any auth |
| POST | `/api/dictations` | Teacher/Admin |
| POST | `/api/practice/submit` | Student |
| GET | `/api/practice/history` | Student |
| GET | `/api/practice/leaderboard` | Any auth |
| GET | `/api/teacher/students` | Teacher/Admin |
| GET | `/api/teacher/export/excel` | Teacher/Admin |
| GET | `/api/admin/users` | Admin |
| GET | `/api/admin/analytics` | Admin |

## Deployment

### MongoDB Atlas
1. Create free M0 cluster
2. Create database user
3. Whitelist `0.0.0.0/0`
4. Copy connection string to `MONGO_URI`

### Backend → Render
1. Connect GitHub repo
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add all env vars from `.env`

### Frontend → Vercel
1. Connect GitHub repo
2. Root directory: `frontend`
3. Framework: Vite
4. Set `VITE_API_BASE_URL` to your Render URL + `/api`

## Features

- JWT authentication with 7-day tokens
- Role-based access control (student / teacher / admin)
- Audio upload to Cloudinary (MP3, WAV, OGG, M4A — max 50 MB)
- YouTube embed support
- WPM calculator (stenography standard: 1 word = 5 characters)
- Word-level accuracy calculation
- Character-level diff highlighting (green = correct, red = wrong)
- Real-time countdown timer with SVG ring animation
- Progress charts (Recharts line chart)
- Leaderboard with top 20 students
- Daily challenge (deterministic — no DB writes)
- Excel export for teacher reports
- Rate limiting (15 req/15min on auth, 200 req/15min global)
- Dark mode with localStorage persistence
- Responsive mobile-first layout
