# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project: Movie Booking System (Node.js, Express, MongoDB)

Common commands
- Install deps: npm install
- Environment: copy .env.example to .env and set MONGO_URI and PORT
- Start (prod-like): npm run start
- Start (dev with reload): npm run dev
- Lint: (no linter configured). If adding ESLint, prefer eslint . --ext .js
- Tests: (no test framework configured). If adding Jest, typical: npm test and to run a single test: npm test -- path/to/file.test.js

Runtime notes
- Requires a running MongoDB instance reachable via MONGO_URI
- Server listens on process.env.PORT (see src/config/listenPort.js)
- Cron job runs every minute to update show statuses (src/cron/showStatus.cron.js)

High-level architecture
- Entry point: src/server.js
  - Loads env vars with dotenv
  - Creates Express app with body-parser, cookie-parser, cors, express.json
  - Connects to MongoDB via src/config/db.js (uses process.env.MONGO_URI)
  - Registers route groups:
    - /auth -> src/routes/auth.routes.js
    - /theater -> src/routes/theater.routes.js
    - /screen -> src/routes/screen.routes.js
    - /movie -> src/routes/movie.routes.js
    - /show -> src/routes/show.routes.js
  - Starts cron worker for show lifecycle updates: src/cron/showStatus.cron.js
  - Binds HTTP server via src/config/listenPort.js

- Configuration
  - src/config/db.js: async connect using mongoose.connect(MONGO_URI)
  - src/config/listenPort.js: app.listen(PORT) with basic error handling

- Routing & Controllers
  - Routes live in src/routes/*.routes.js and delegate to controllers in src/controllers/**
  - Example: src/routes/auth.routes.js wires POST /auth/register and /auth/login to matching controllers in src/controllers/auth/

- Middlewares
  - src/middlewares/auth.js: JWT authentication
    - Accepts token via Authorization: Bearer <token> or cookie token
    - Verifies using JWT_SECRET and attaches req.user (password omitted)
  - src/middlewares/isAdmin.js (present in tree): likely role gate for admin-only routes

- Data models (Mongoose)
  - Users: src/models/auth/user.model.js
    - Fields: name, email (unique, required), password (required), role (user|admin)
    - Method: verifyPassword(password) -> bcrypt.compare
  - Movies: src/models/movie/movie.models.js
    - Rich metadata (title unique, media URLs, duration, genres, language, format, certification, releaseDate, rating, flags)
  - Theaters: src/models/theater/theater.model.js
    - name, city (indexed), address; compound index on {name, city}
  - Screens: src/models/screen/screen.model.js (present in tree)
  - Seats: src/models/seat/seat.model.js (present in tree)
  - Shows: src/models/show/show.model.js
    - References Screen, Theater, Movie by id; denormalized names/titles
    - Movie duration, startTime, endTime
    - Status enum: SCHEDULED | ACTIVE | ENDED | CANCELLED (indexed)
    - Capacity and pricing; timeSlot metadata
    - Index for conflict checking: { theaterId, screenId, startTime, endTime }

- Utilities
  - src/utils/generateToken.js: likely JWT creation used in auth controllers
  - src/utils/cookieOptions.js: central cookie flags (httpOnly, secure, sameSite)
  - src/utils/generateSeats.js: helper to populate seat maps per screen
  - src/helpers/helpers.js: cross-cutting helpers

- Background jobs
  - src/cron/showStatus.cron.js
    - Every minute:
      - SCHEDULED -> ACTIVE when startTime <= now
      - ACTIVE -> ENDED when endTime <= now

Local development workflow
- Set environment
  - Create .env with at least:
    - MONGO_URI=mongodb://localhost:27017/movie_booking (example)
    - PORT=3000
    - JWT_SECRET=<your-secret>
- Run dev server: npm run dev
- API base URL: http://localhost:$PORT
- Example auth flow (assuming controllers issue JWT cookie or bearer token):
  - POST /auth/register { name, email, password }
  - POST /auth/login { email, password }
  - Use Authorization: Bearer {{JWT}} for protected routes or rely on cookie

Troubleshooting
- Mongo connection failures
  - Ensure MONGO_URI is set and MongoDB is reachable
- 401 Unauthorized on protected routes
  - Provide token via Authorization header or cookie named token
- Cron not running
  - src/cron/showStatus.cron.js is required from server.js; ensure process stays alive

Repository notes
- No README.md, CLAUDE.md, Cursor, or Copilot rule files detected
- .gitignore excludes node_modules and .env

