# AGENTS.md

Task-management app: Express 5 backend + vanilla JS frontend. UI text, code comments, and console logs are in **Spanish** — match that style.

## Run the app

- **The backend serves the frontend statically** (`backend/src/app.js:16`). The only supported way to run the app is:
  ```bash
  cd backend
  npm run dev   # nodemon, auto-reload
  # or: npm start
  ```
  then open `http://localhost:3000`. The frontend fetches `/api/tasks` (relative), so the frontend `npm start` (http-server on port 8080) breaks all API calls — don't use it.

- Requires local MySQL: database `adminTasks` and a `tasks` table must exist manually. **There is no migration/schema SQL in the repo.** Table shape implied by queries in `backend/src/models/taskModel.js`: `id, title, description, due_date, status (pending|completed|rejected), created_at, updated_at`.

- Copy `backend/.ejemplo.env` to `backend/.env` before running. `dotenv.config()` in `backend/config/db.js` reads `.env` from the current working directory, so run commands from `backend/`. `config/db.js` has hardcoded fallback DB credentials — a missing `.env` silently connects with those instead of failing.

- Quick DB sanity check: `curl http://localhost:3000/test-db`.

- No tests and no lint in this repo (`npm test` is a stub). Don't invent test/lint commands.

## Structure & gotchas

- `backend/` is ESM (`"type": "module"`); all imports must include the `.js` extension. The TypeScript devDeps and `build: tsc` script are vestigial — no tsconfig, code is plain JS.
- Layered backend: `routes/` → `controllers/` → `services/` → `models/` (raw `mysql2/promise` pool queries). Endpoints: `GET/POST /api/tasks`, `PUT /api/tasks/:id/status`, `PUT /api/tasks/:id` (description only).
- `frontend/` is a single page (`index.html` + `js/app.js` + `css/style.css`), no build step, Bootstrap 5 from CDN. Views are toggled via `.view-container.active` and `switchView()`.
- Home view shows completed/rejected tasks **only for the current week** (`getCurrentWeekRange`, week starts Sunday); the Completadas/Rechazadas views show all, paginated (`ITEMS_PER_PAGE = 12`) and filterable by title.
- Heavy `console.log` debugging statements are intentional leftovers throughout the backend and `frontend/js/app.js` — leave them in place unless asked to remove them.
- `README.md` is partly stale (frontend `html/` folder no longer exists).
- `Microsoft/Windows/PowerShell/ModuleAnalysisCache` is junk that got committed; ignore it and don't touch it.

## Workflow

- History uses feature branches with `fix/`, `feature/`, `improve/`, `refactor/` prefixes merged via PRs, short commit messages.
