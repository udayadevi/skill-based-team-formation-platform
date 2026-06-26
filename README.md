<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======
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
>>>>>>> 15e1c049dae02713488298dabc57e5b0756bd0b6
