Project Report:https://drive.google.com/drive/folders/1LqFOt3HFWXpc6HQ5OPBPyadU6Re11U8M
 # Online-Complaint-Management-System

A full-stack complaint management application with a Node.js/Express backend and a React/Vite frontend.

## Project Structure

- `backend/` — Express API server
  - `server.js` — application entrypoint
  - `config/db.js` — MongoDB connection
  - `controllers/` — request handlers
  - `middleware/` — auth and error handling
  - `models/` — Mongoose models
  - `routes/` — API route definitions
  - `utils/` — helper utilities
  - `validators/` — request validation rules
- `frontend/` — React client application built with Vite
  - `src/` — React components, pages, and context

## Features

- User authentication and authorization
- Complaint submission, tracking, and details
- Feedback and messaging features
- Admin dashboard access for management
- File uploads served from `backend/uploads`

## Requirements

- Node.js 18+ (or compatible)
- npm or yarn
- MongoDB instance

## Environment Variables

Create a `.env` file inside `backend/` with the following values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/complaint-system
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM="Support <support@example.com>"
```

> If `MONGO_URI` is not provided, it defaults to `mongodb://127.0.0.1:27017/complaint-system`.

## Backend Setup

1. Open a terminal in `backend/`
2. Install dependencies:

```bash
npm install
```

3. Start the server in development mode:

```bash
npm run dev
```

4. Or start the server for production:

```bash
npm start
```

5. Seed the default admin user:

```bash
npm run seed
```

The backend API will run on `http://localhost:5000` by default.

## Frontend Setup

1. Open a terminal in `frontend/`
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the app in your browser at the URL shown in the terminal (usually `http://localhost:5173`).

## Usage

- Register or log in from the frontend
- Submit and view complaints
- Access complaint details and feedback
- Use the admin area for administrative actions

## API Overview

The backend exposes several routes under `/api`:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/complaints`
- `POST /api/complaints`
- `GET /api/complaints/:id`
- `POST /api/feedback`
- `POST /api/messages`
- `GET /api/admin/*`

## Notes

- The frontend uses `axios`, `react-router-dom`, `react-toastify`, and `recharts`.
- The backend uses `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, and security middleware.
- Uploaded files are served from `backend/uploads`.

## License

This repository does not include a license file. Add one if you want to publish or share the project publicly.
