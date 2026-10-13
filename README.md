# MERN Authentication

A full-stack authentication system built with the MERN stack. It has a React front end and an Express + MongoDB REST API that handles user accounts with JWT-based sessions stored in cookies.

<!-- [CONFIRM] Add 1-2 screenshots or a short screen recording of the login/register flow here. -->

## Features

<!-- [CONFIRM] Keep only what the code actually does. Delete the rest. -->

- User registration and login
- Passwords hashed with bcrypt
- JWT authentication, sent via HTTP cookies
- Protected routes on the client and protected endpoints on the server
- Email sending with Nodemailer (e.g. verification or password reset) [CONFIRM what it is used for]
- Toast notifications for success and error feedback

## Tech stack

| Layer    | Tools |
| -------- | ----- |
| Client   | React 19, Vite, React Router, Tailwind CSS 4, Axios, React Toastify |
| Server   | Node.js (ES modules), Express 5, Mongoose, jsonwebtoken, bcryptjs, cookie-parser, cors, dotenv, Nodemailer |
| Database | MongoDB |

## Project structure

```
mern-authentication/
├── client/   # React app (Vite)
└── server/   # Express API
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- A MongoDB database (local, or a free MongoDB Atlas cluster)
- An SMTP account for sending email [CONFIRM if needed]

### 1. Clone the repo

```bash
git clone https://github.com/Faisal77666/mern-authentication.git
cd mern-authentication
```

### 2. Set up the server

```bash
cd server
npm install
```

Create a `server/.env` file:

```env
# [CONFIRM] Match these names to the ones used in your server code.
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_string
NODE_ENV=development
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SENDER_EMAIL=you@example.com
```

Start the server:

```bash
npm start
```

### 3. Set up the client

```bash
cd client
npm install
```

If the client reads the API URL from an env variable, create `client/.env`:

```env
# [CONFIRM] Name and port must match your code.
VITE_BACKEND_URL=http://localhost:4000
```

Start the client:

```bash
npm run dev
```

Vite prints the local URL (usually `http://localhost:5173`).

## API endpoints

<!-- [CONFIRM] Replace with the real routes from server/routes. Example shape: -->

| Method | Endpoint | Description | Auth |
| ------ | -------- | ----------- | ---- |
| POST | `/api/auth/register` | Create a new account | No |
| POST | `/api/auth/login` | Log in and set the auth cookie | No |
| POST | `/api/auth/logout` | Clear the auth cookie | Yes |

## How authentication works

1. On register, the password is hashed with bcrypt before it is saved to MongoDB.
2. On login, the server checks the password and signs a JWT.
3. The JWT is sent in an HTTP cookie, so the client does not store it in JavaScript-accessible storage.
4. Protected endpoints read the cookie, verify the token, and reject the request if it is missing or invalid.

<!-- [CONFIRM] Adjust these steps if your flow differs (token expiry, OTP verification, etc). -->

## Scripts

| Location | Command | What it does |
| -------- | ------- | ------------ |
| `server` | `npm start` | Runs the API with Node |
| `client` | `npm run dev` | Starts the Vite dev server |
| `client` | `npm run build` | Builds the client for production |
| `client` | `npm run lint` | Runs ESLint |

## Author

Faisal. [GitHub](https://github.com/Faisal77666) · [Portfolio](https://faisaldev.me)
