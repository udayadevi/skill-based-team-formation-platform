# 🚀 Skill-Based Team Formation Platform

A full-stack production-ready platform that enables developers and creators to find projects, form teams, match skills, and collaborate effectively with automated compatibility scoring and execution tracking.

Built with **MongoDB Atlas**, **Express.js**, **React 19 (Vite)**, and **Node.js**.

---

## 🌟 Key Features

- **Multi-Factor Compatibility Engine**: Real-time compatibility calculation factoring in skill coverage, proficiency alignment, commitment level, historical task completion reliability, and collaboration reputation.
- **Projects & Teams Hub**: Browse, create, and filter projects and teams across multiple tech domains (Web, AI, Mobile, Cyber Security, etc.).
- **Interactive Kanban Task Board**: Manage and assign tasks within teams with priority and skill tags.
- **Collaboration Timeline**: Audit trail of team formation, accepted members, completed tasks, and milestones.
- **User Execution Analytics & Skill Graph**: Interactive visual skill breakdown and contribution analytics.
- **JWT Authentication & Security**: Secure bcrypt password hashing, token interceptors, and protected API endpoints.
- **Production-Ready**: Configured for seamless deployment on **Vercel** (Frontend) and **Render** (Backend) with zero hardcoded credentials.

---

## 🏗️ Architecture & Project Structure

```
skill-based-team-formation/
├── backend/                       # Node.js + Express REST API
│   ├── config/                    # Database connection (MongoDB Atlas)
│   ├── controllers/               # Business logic controllers
│   ├── middleware/                # JWT auth verification middleware
│   ├── models/                    # Mongoose Schemas (User, Team, Project, Task, etc.)
│   ├── routes/                    # API Route endpoints
│   ├── services/                  # Compatibility & Reputation computation engine
│   ├── utils/                     # Email & notification helpers
│   ├── app.js                     # Express app setup & CORS configuration
│   ├── render.yaml                # Render Web Service Blueprint
│   └── package.json
│
├── frontend/                      # React 19 + Vite SPA
│   ├── src/
│   │   ├── components/            # UI components (TaskBoard, Timeline, SkillGraph, etc.)
│   │   ├── pages/                 # Full-page views (Dashboard, Projects, FindTeam, etc.)
│   │   ├── routes/                # Client-side protected route guards
│   │   ├── services/              # Axios API client
│   │   ├── styles/                # Component & page stylesheets
│   │   ├── App.jsx                # Main route definitions
│   │   └── main.jsx               # React entry point
│   ├── vercel.json                # Vercel SPA routing configuration
│   ├── vite.config.js             # Vite build setup
│   └── package.json
│
├── render.yaml                    # Root Render configuration
├── vercel.json                    # Root Vercel deployment configuration
├── package.json                   # Root monorepo orchestration scripts
└── README.md
```

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB Atlas** database cluster

### 2. Installation
Install all dependencies for both backend and frontend from the root:
```bash
npm run install:all
```
*(Or install manually in each folder: `cd backend && npm install`, `cd frontend && npm install`)*

### 3. Environment Variables Configuration

#### Backend (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.v9wrfvj.mongodb.net/skillbasedteam?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=skillbasedteam
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
```

#### Frontend (`frontend/.env.local`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Running Locally
Run backend:
```bash
npm run dev:backend
# API will run on http://localhost:5000
```

In a second terminal, run frontend:
```bash
npm run dev:frontend
# App will run on http://localhost:5173
```

---

## 🚀 Deployment Guide

### Deploying Backend to Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New > Web Service**.
2. Connect this GitHub repository.
3. Configure the service:
   - **Name**: `skill-team-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node app.js`
4. Add **Environment Variables** in Render:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster0.v9wrfvj.mongodb.net/skillbasedteam?retryWrites=true&w=majority&appName=Cluster0`
   - `DB_NAME`: `skillbasedteam`
   - `JWT_SECRET`: *(Generate a secure random string)*
   - `FRONTEND_URL`: `https://your-frontend-app.vercel.app` *(update once frontend is deployed)*

*(Alternatively, apply the included `render.yaml` blueprint for automatic setup).*

---

### Deploying Frontend to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New > Project**.
2. Import this GitHub repository.
3. In project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variables** in Vercel:
   - `VITE_API_URL`: `https://skill-team-backend.onrender.com/api` *(Your Render backend URL with /api)*
5. Click **Deploy**. Vercel will automatically build the React app and configure SPA rewrites.

---

## 📡 API Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/` | API Health Check | No |
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/login` | Login user & issue JWT | No |
| `GET` | `/api/users/me` | Get logged-in user profile | Yes |
| `PUT` | `/api/users/update-profile`| Update user profile & skills | Yes |
| `GET` | `/api/users/me/analytics` | Execution analytics & score | Yes |
| `GET` | `/api/users/me/skill-graph`| Skill breakdown graph data | Yes |
| `GET` | `/api/projects` | Get all projects | No |
| `POST` | `/api/projects` | Create a new project | Yes |
| `GET` | `/api/projects/recommended`| Recommended projects with compatibility | Yes |
| `GET` | `/api/teams` | List all teams | Yes |
| `POST` | `/api/teams` | Create a new team | Yes |
| `GET` | `/api/teams/:id/compatibility` | Compute skill compatibility for team | Yes |
| `POST` | `/api/joinrequests` | Send team join request | Yes |
| `GET` | `/api/joinrequests` | List join requests | Yes |
| `PUT` | `/api/joinrequests/:id/accept` | Accept applicant into team | Yes |
| `GET` | `/api/tasks/team/:teamId` | Get team task board | Yes |
| `POST` | `/api/tasks` | Create/assign team task | Yes |
| `PUT` | `/api/tasks/:id/status` | Update task status & reputation | Yes |
| `GET` | `/api/timeline/team/:teamId` | Team collaboration timeline | Yes |

---

## 📄 License
This project is licensed under the MIT License.
