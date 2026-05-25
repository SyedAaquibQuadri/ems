<div align="center">

# EMS — Employee Management System

A full-stack Employee Management System built with the MERN stack. Admins can create and assign tasks to employees, while employees can track and update their task status in real time.

[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=flat&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-5.0-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-22.0-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

![EMS Preview](https://via.placeholder.com/900x500/1c1c1c/emerald?text=EMS+Dashboard+Preview)

</div>

---

## Features

### Admin
- Secure login with email/password or Google OAuth
- Create and assign tasks to employees with priority and deadline
- Real-time team overview — task counts per employee
- Full task lifecycle management (edit, delete)
- View all registered users

### Employee
- Register with email/password or Google OAuth
- Personal dashboard with task summary (new, active, completed, failed)
- Accept, complete, or fail assigned tasks
- Task cards with priority indicators and deadlines

### General
- JWT authentication via httpOnly cookies
- Role-based access control (admin vs employee)
- Fully responsive — mobile, tablet, desktop
- Dark modern UI

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS 4 |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Auth | JWT, Passport.js, Google OAuth 2.0 |
| Testing | Vitest, React Testing Library, Jest, Supertest |
| Dev Tools | Nodemon, Concurrently, ESLint |

---

## Project Structure

```
ems/
├── src/                          # React frontend
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Dashboard/
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── EmployeeDashboard.jsx
│   │   ├── TaskList/
│   │   │   ├── TaskList.jsx
│   │   │   ├── NewTask.jsx
│   │   │   ├── AcceptTask.jsx
│   │   │   ├── CompleteTask.jsx
│   │   │   └── FaliedTask.jsx
│   │   └── other/
│   │       ├── Header.jsx
│   │       ├── CreateTask.jsx
│   │       ├── AllTask.jsx
│   │       └── TaskListNumbers.jsx
│   ├── context/
│   │   └── AuthProvider.jsx
│   ├── utils/
│   │   └── api.js
│   └── test/
│       ├── setup.js
│       ├── App.test.jsx
│       ├── Login.test.jsx
│       ├── Header.test.jsx
│       └── TaskListNumbers.test.jsx
├── server/                       # Express backend
│   └── src/
│       ├── config/
│       │   ├── db.js
│       │   ├── passport.js
│       │   └── testDb.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── taskController.js
│       │   └── userController.js
│       ├── middleware/
│       │   └── authMiddleware.js
│       ├── models/
│       │   ├── User.js
│       │   └── Task.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── taskRoutes.js
│       │   └── userRoutes.js
│       ├── utils/
│       │   └── generateToken.js
│       ├── __tests__/
│       │   ├── auth.test.js
│       │   └── tasks.test.js
│       ├── app.js
│       ├── index.js
│       └── seed.js
├── index.html
├── vite.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- MongoDB Atlas account (free tier)
- Google Cloud Console project (for OAuth)

### 1. Clone the repository

```bash
git clone https://github.com/SyedAaquibQuadri/ems.git
cd ems
```

### 2. Install dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### 3. Configure environment variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/ems
TEST_MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/ems_test
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLIENT_URL=http://localhost:5173
```

### 4. Seed the database

```bash
cd server && npm run seed && cd ..
```

This creates:
| Role | Email | Password |
|---|---|---|
| Admin | admin@ems.com | admin123 |
| Employee | alice@ems.com | emp123 |
| Employee | bob@ems.com | emp123 |
| Employee | carol@ems.com | emp123 |

### 5. Run the app

```bash
npm run dev:all
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health check: http://localhost:5000/api/health

---

## API Reference

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login with email/password |
| GET | `/api/auth/me` | Protected | Get current user |
| POST | `/api/auth/logout` | Protected | Logout |
| GET | `/api/auth/google` | Public | Google OAuth login |
| GET | `/api/auth/google/callback` | Public | Google OAuth callback |

### Tasks

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/tasks` | Admin | Create a task |
| GET | `/api/tasks` | Admin | Get all tasks |
| GET | `/api/tasks/my` | Employee | Get my tasks + summary |
| PATCH | `/api/tasks/:id/status` | Employee | Update task status |
| PUT | `/api/tasks/:id` | Admin | Edit a task |
| DELETE | `/api/tasks/:id` | Admin | Delete a task |

### Users

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users` | Admin | Get all users |
| GET | `/api/users/employees` | Admin | Get all employees |
| PATCH | `/api/users/:id/role` | Admin | Update user role |
| DELETE | `/api/users/:id` | Admin | Delete a user |

---

## Testing

### Backend tests (Jest + Supertest)

```bash
cd server
npm test
```

Covers: auth routes, task CRUD, role-based access, JWT middleware — 17 tests.

### Frontend tests (Vitest + React Testing Library)

```bash
# from root
npm test
```

Covers: Login form, Header, App routing, TaskListNumbers — 17 tests.

---

## Task Lifecycle

```
new ──► active ──► completed
                └──► failed
```

| Status | Who can set it | Description |
|---|---|---|
| `new` | System (on create) | Task just assigned |
| `active` | Employee | Employee accepted the task |
| `completed` | Employee | Task finished successfully |
| `failed` | Employee | Task could not be completed |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev:all` | Run frontend + backend concurrently |
| `npm run dev` | Run frontend only (Vite) |
| `npm run dev:server` | Run backend only (Nodemon) |
| `npm run build` | Build frontend for production |
| `npm test` | Run frontend tests |
| `cd server && npm test` | Run backend tests |
| `cd server && npm run seed` | Seed database with sample data |

---

## Roadmap

- [x] Email/password authentication
- [x] Google OAuth
- [x] Admin dashboard
- [x] Employee dashboard
- [x] Task lifecycle management
- [x] Role-based access control
- [x] Mobile responsive UI
- [x] Backend + frontend testing
- [ ] Deployment (Render + Vercel)
- [ ] Email notifications
- [ ] Task comments
- [ ] File attachments
- [ ] Analytics dashboard

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the ISC License.

---

<div align="center">
  Built with ❤️ by <a href="https://github.com/SyedAaquibQuadri">Syed Aaquib Quadri</a>
</div>