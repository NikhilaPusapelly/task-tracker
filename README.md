# Task Tracker

A full-stack Task Management Web Application that allows users to create, manage, track, filter, and analyze their tasks.

The application provides user authentication with JWT, task CRUD operations, filtering and search, and a dashboard with basic task analytics.

## Live Application

**Frontend:**  
https://task-tracker-frontend-puv1.onrender.com

**Backend API:**  
https://task-tracker-backend-i26w.onrender.com

**GitHub Repository:**  
https://github.com/NikhilaPusapelly/task-tracker

---

# Features

## 1. Authentication

- User Signup
- User Login
- JWT-based authentication
- Password hashing using bcrypt
- Protected routes
- Persistent login using browser local storage
- Basic email and password validation

## 2. Task Management

Authenticated users can:

- Create a task
- View their tasks
- Update a task
- Delete a task
- Change task status
- Mark tasks as completed

Each task supports:

- Title
- Description
- Status
- Priority
- Due Date

### Task Status

- Todo
- In Progress
- Done

### Task Priority

- Low
- Medium
- High

## 3. Filtering and Search

Users can:
- Filter tasks by status
- Filter tasks by priority
- Search tasks by title
- Sort tasks based on selected criteria

## 4. Analytics

The dashboard provides basic task insights including:

- Total number of tasks
- Number of completed tasks
- Number of pending tasks
- Task completion progress

## 5. User Interface

- Clean and simple UI
- Login page
- Signup page
- Dashboard
- Task creation/update form
- Loading states
- Error states
- Responsive layout
- Light and dark mode

---

# Tech Stack

## Frontend

- React.js
- React Router
- Axios
- CSS
- Vite

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- dotenv
- CORS

## Database

- MongoDB Atlas

## Deployment

- Render Static Site - Frontend
- Render Web Service - Backend
- MongoDB Atlas - Database

---

# Project Structure

```text
task-tracker/
│
├── backend/
│   ├── controllers/
│   │   └── authController.js
│   │
│   ├── models/
│   │   └── User.js
│   │
│   ├── routes/
│   │   └── authRoutes.js
│   │
│   ├── middleware/
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── index.html
│
└── README.md
```

---

# Setup Instructions

## Prerequisites

- Node.js
- npm
- MongoDB Atlas
- Git

## 1. Clone the Repository

```bash
git clone https://github.com/NikhilaPusapelly/task-tracker.git
cd task-tracker
```

## 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm start
```

Backend will run on:

```text
http://localhost:5000
```

## 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

# API Endpoints

## Authentication

### Signup

```http
POST /api/auth/signup
```

Creates a new user account.

### Login

```http
POST /api/auth/login
```

Authenticates an existing user and returns a JWT token.

### Example Request

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

## Task Management

Authenticated users can perform task CRUD operations through the task API.

```http
POST   /api/tasks
GET    /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

Protected task requests use:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# Authentication Flow

1. User signs up with name, email, and password.
2. Password is hashed using bcrypt.
3. User logs in with their credentials.
4. Backend validates the credentials.
5. Backend generates a JWT token.
6. Frontend stores the token in local storage.
7. The token is used to access protected APIs.
8. Users can access and manage their own tasks.

---

# Design Decisions

## JWT Authentication

JWT was used for authentication so that protected API requests can verify the user's identity.

## Password Hashing

Passwords are hashed using bcrypt before being stored in MongoDB.

## MongoDB

MongoDB was selected to store users and tasks. Mongoose is used to define schemas and interact with the database.

## REST API

The backend follows REST-style API design for authentication and task management operations.

## Axios

Axios is used on the frontend for communication with the backend API through a centralized API client.

## Environment Variables

Sensitive values such as the MongoDB connection string and JWT secret are stored in environment variables instead of being hardcoded.

## Separation of Concerns

The application separates frontend pages, components, API services, backend routes, controllers, models, and middleware to keep the code organized and maintainable.

---

# Deployment

The application is deployed using Render.

## Frontend

https://task-tracker-frontend-puv1.onrender.com

## Backend

https://task-tracker-backend-i26w.onrender.com

## Database

MongoDB Atlas is used as the production database.

---

# Future Enhancements

- Pagination for task lists
- Advanced analytics and charts
- Role-based access control
- Automated testing
- Task notifications and reminders

---

# Author

**Nikhila Pusapelly**

GitHub:

https://github.com/NikhilaPusapelly/task-tracker
