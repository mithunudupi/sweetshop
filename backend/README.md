# Sweet Shop Backend (Node.js + TypeScript + TypeORM + SQLite)

## Quick start

1. Install dependencies:
   ```
   cd backend
   npm install
   ```

2. Start server in development:
   ```
   npm run dev
   ```

3. Build and run:
   ```
   npm run build
   npm start
   ```

The API will run at `http://localhost:4000`.

## Environment variables

You can set:
- `PORT` (default 4000)
- `JWT_SECRET` (default in code)
- `SQLITE_FILE` (default `data/sqlite.db`)

## Notes
- Database uses SQLite file, stored at `backend/data/sqlite.db` by default.
- This project includes JWT auth, sweets CRUD, search, purchase and restock endpoints.
