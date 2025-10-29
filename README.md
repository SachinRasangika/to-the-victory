# MERN Auth Project

## Structure
- backend/
  - server.js (Express app, mounts /api/auth, serves static in prod)
  - config/db.js (Mongoose connection via MONGO_URI)
  - routes/auth.js (POST /api/auth/register, POST /api/auth/login, GET /api/auth/me)
  - models/User.js (User schema, passwordHash)
- frontend/
  - index.html (Vite entry)
  - vite.config.js (proxy /api → http://localhost:3005)
  - src/
    - main.jsx, App.jsx (React Router)
    - pages/Signup.jsx, Signin.jsx, Profile.jsx
    - services/api.js (fetch wrapper, JWT in localStorage)
    - styles.css (UI styles)

## Run locally
- Env: set MONGO_URI and JWT_SECRET for backend.
- Start: frontend on 3006 and backend on 3005.
  - Backend: node backend/server.js
  - Frontend: cd frontend && npm install && npm run dev

## API
- POST /api/auth/register { name, email, password } → { user, token }
- POST /api/auth/login { email, password } → { user, token }
- GET /api/auth/me (Authorization: Bearer <token>) → { user }

## Notes
- Frontend uses React Router (/signup, /signin, /profile). Vite proxies /api.
- Update this README whenever structure or behavior changes.
