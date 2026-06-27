# Features

## Frontend

### Pages (multi-page app via React Router, not a single view)
- **Todo List** (`/`) — main landing page
- **Todo Details** (`/details?id=<id>`) — reads the todo id from a query parameter
- **404 Not Found** (any unmatched route)

### Todo List page
- Create a todo (title, priority, category, due date)
- Toggle complete/incomplete
- Delete a todo (with confirmation dialog)
- Search todos by title/description
- Filter by All / Active / Completed
- Sort by newest, oldest, title (A-Z/Z-A), or priority
- Pagination (5 todos per page)
- Empty state when there are no todos or no results match the current filters
- Loading spinner while fetching
- Inline error banner on request failure
- Toast notifications on add/update/delete

### Todo Details page
- Reads `id` from the `?id=` query parameter
- Displays and allows editing: title, description, completed status, priority, category, due date
- Displays metadata: created date, updated date, todo id
- Save changes via PUT request
- Delete with confirmation dialog, then redirects to the list page
- Loading spinner and error banner

### UI/UX
- Responsive layout (mobile-friendly navbar, stacked forms on small screens)
- Responsive collapsible navbar with hamburger toggle on mobile
- Dark mode toggle (persisted to `localStorage`)
- Toast notifications (react-toastify) for success/error feedback
- Confirmation dialogs before destructive actions (delete)
- Reusable components: `Navbar`, `Spinner`, `ConfirmDialog`, `TodoCard`, `Pagination`, `EmptyState`
- Reusable hooks: `useTodos` (list state), `useTodo` (single-todo state)
- Centralized constants (`constants/index.js`) for priorities, categories, filters, sort options, page size
- Centralized API client (`api/client.js` + `api/todos.api.js`) using Axios with a shared response/error interceptor

## Backend

### REST API
- `GET /api/todos` — list all todos
- `GET /api/todos/:id` — get one todo
- `POST /api/todos` — create a todo
- `PUT /api/todos/:id` — update a todo (partial updates supported)
- `DELETE /api/todos/:id` — delete a todo
- `GET /api/health` — health check

### Data & validation
- File-based JSON persistence (`backend/data/todos.json`), survives server restarts
- Request validation middleware (`middleware/validateTodo.js`) for create/update
- Proper HTTP status codes (200/201/400/404/500)
- Consistent error response shape across all endpoints

### Architecture
- Clean separation: `routes/` → `controllers/` → `models/`
- Centralized error handler and 404 handler middleware
- `asyncHandler` utility to avoid repetitive try/catch in controllers
- `AppError` class for operational errors with HTTP status codes
- Environment variables via `dotenv` (`PORT`, `NODE_ENV`, `CORS_ORIGIN`)
- Request logging via `morgan` (verbose in development, combined format in production)

## Documentation
- `README.md` — project overview, setup, architecture
- `API.md` — full endpoint reference
- `FEATURES.md` — this file
- `PROJECT_STRUCTURE.md` — folder-by-folder breakdown
