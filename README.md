# Skill-Based Team Formation Platform

A full-stack **MERN** application that allows users to register, log in, create teams, join teams, and get **skill-based compatibility scores** to find the best-fit teams.

Built with **MongoDB**, **Express.js**, **React.js**, and **Node.js**, using **JWT Authentication**, **bcrypt.js**, and an **MVC architecture** on the backend.

---

## Features

- User registration & login with hashed passwords (bcrypt)
- JWT-based authentication & protected routes
- Create and view teams
- Send, accept, and reject join requests
- Skill-based compatibility score: matches user skills against a team's required skills
- Responsive React frontend with dashboard, team listing, and profile pages
- Clean MVC project structure on the backend
- MongoDB Atlas for cloud database storage

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT, bcrypt.js |
| Architecture | MVC (Model-View-Controller) |
| API Testing | Postman |

---

## Project Structure

```
skill-team-formation/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Login, Register, Dashboard, Teams, Profile
│       ├── context/        # Auth context / state management
│       ├── services/       # Axios API calls
│       └── App.js
│
├── server/                  # Node.js + Express backend
│   ├── config/             # Database connection & environment configs
│   ├── controllers/        # Business logic for users, teams, requests
│   ├── middleware/          # JWT auth middleware
│   ├── models/             # Mongoose schemas (User, Team, JoinRequest)
│   ├── routes/             # API route definitions
│   ├── app.js              # App entry point
│   └── .env.example        # Sample environment variables
│
└── README.md
```

---

## Database Models

### User
- `name`
- `email`
- `password` (hashed)
- `skills` (array)
- `role`

### Team
- `teamName`
- `description`
- `requiredSkills` (array)
- `createdBy` (User reference)
- `members` (array of User references)

### JoinRequest
- `userId`
- `teamId`
- `status` (pending / accepted / rejected)

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas account

### Installation

```bash
git clone https://github.com/<your-username>/skill-team-formation.git
cd skill-team-formation
```

**Backend setup:**
```bash
cd server
npm install
```

**Frontend setup:**
```bash
cd client
npm install
```

### Environment Variables

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

If the frontend needs to know the API URL, create a `.env` file inside `client/`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Run the App

**Backend:**
```bash
cd server
npm start
```
For development with auto-reload:
```bash
npm run dev
```

**Frontend:**
```bash
cd client
npm start
```

The React app will run on `http://localhost:3000` and the API on `http://localhost:5000`.

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login and get JWT token | Public |

### Teams
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/teams` | Create a new team | Private |
| GET | `/api/teams` | View all teams | Private |
| GET | `/api/teams/:id` | View team details | Private |
| POST | `/api/teams/:id/join` | Send a join request | Private |
| PUT | `/api/teams/:id/requests/:requestId` | Accept/Reject a join request | Private (Team creator) |

### Compatibility
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/teams/:id/compatibility` | Get user's skill match % with a team | Private |

> All private routes require a `Bearer <token>` in the `Authorization` header.

---

## Compatibility Scoring Logic

The compatibility score is calculated as:

```
(Number of matching skills / Total required skills) * 100
```

This gives users a quick way to see how well their skill set aligns with a team's requirements before sending a join request.

---

## Roadmap

- [x] Project setup with MVC structure
- [x] User authentication (Register/Login, JWT, bcrypt)
- [x] Team creation & management APIs
- [x] Join request system
- [x] Skill compatibility scoring
- [ ] React frontend integration
- [ ] Deployment (Render/Vercel/Netlify)

---

## Testing

All APIs are tested using **Postman**. A Postman collection can be added at `/docs/postman_collection.json` for easy import.

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

## Author

Developed as a mini project to demonstrate full-stack development skills using the MERN stack (MongoDB, Express, React, Node.js) with JWT-based authentication and skill-matching logic.
