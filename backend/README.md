# Startup Idea Validator Backend

This is the backend for the Startup Idea Validator Dashboard, built with Node.js, Express, and MongoDB.

## Features

- **Full Authentication**: Register, Login, Logout using JWT and bcrypt.
- **Idea CRUD**: Create, read, update, and delete ideas.
- **Ownership**: Users can only edit or delete their own ideas.
- **Visibility Control**: Toggle between "active" and "hidden" status.
- **Trending System**: Ranking based on `(marketPotential * 2) + difficultyScore + upvotes`.
- **Auto-Archiving**: Background cron job to archive expired ideas.
- **View Tracking**: Increments view count on idea retrieval.

## API Endpoints

### Auth
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login and get JWT
- `POST /api/auth/logout`: Logout (client-side token removal)

### Ideas
- `POST /api/ideas`: Create a new idea (Protected)
- `GET /api/ideas`: Get all active ideas
- `GET /api/ideas/:id`: Get a single idea (increments views)
- `PUT /api/ideas/:id`: Update an idea (Owner only)
- `DELETE /api/ideas/:id`: Delete an idea (Owner only)
- `PATCH /api/ideas/:id/visibility`: Toggle visibility (Owner only)
- `POST /api/ideas/:id/upvote`: Upvote an idea (Protected)
- `GET /api/ideas/trending`: Get ideas ranked by score
- `GET /api/ideas/archived`: Get all archived ideas

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file in the `backend` directory (see `.env.example`):
   ```
   PORT=5001
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

3. **Run the Server**:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## Tech Stack

- **Node.js & Express**: Web framework
- **MongoDB & Mongoose**: Database & ODM
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **node-cron**: Background tasks
