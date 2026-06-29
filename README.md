https://github.com/user-attachments/assets/9c5e9308-147c-4745-9ed6-dac4ebcf4530

# Todo App

A full-stack todo application: a multi-page React frontend and a REST API backend built with Express, using file-based JSON persistence.

## Project Overview

This project implements a complete todo management system:

- A **Todo List** page for creating, searching, filtering, sorting, and paginating todos.
- A **Todo Details** page (`/details?id=<todoId>`) for viewing and editing a single todo, including metadata like priority, category, and timestamps.
- A REST API with full CRUD support, request validation, centralized error handling, and logging.

See [FEATURES.md](FEATURES.md) for the full feature list, [API.md](API.md) for endpoint documentation, and [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for a tour of the codebase.

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router (multi-page navigation)
- Axios (HTTP client)
- React Toastify (toast notifications)
- Plain CSS with CSS variables (light/dark theme)

**Backend**
- Node.js + Express
- File-based JSON storage (`backend/data/todos.json`)
- Morgan (request logging)
- dotenv (environment configuration)

## Installation

### Prerequisites
- Node.js 18+
- npm

### Backend

```bash
cd backend
npm install
cp .env.example .env   # adjust values if needed
npm start               # http://localhost:4000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # adjust values if needed
npm run dev             # http://localhost:5173
```

Open `http://localhost:5173` in your browser. The frontend talks to the backend at the URL configured in `frontend/.env` (`VITE_API_BASE_URL`).

## Folder Structure

```
.
├── backend/     # Express REST API (see PROJECT_STRUCTURE.md)
└── frontend/    # React app (see PROJECT_STRUCTURE.md)
```

Full breakdown in [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md).

## Features

Highlights (full list in [FEATURES.md](FEATURES.md)):

- Multi-page React app (Todo List, Todo Details, 404) via React Router
- Full CRUD for todos
- Search, filter (all/active/completed), sort, and pagination
- Todo Details page reads `?id=` query param and supports inline editing
- Dark mode toggle, responsive navbar, toast notifications, delete confirmation dialogs
- REST API with status codes, request validation, and centralized error handling
- Request logging (morgan) and environment-based configuration

## API Endpoints

| Method | Endpoint          | Description           |
|--------|-------------------|------------------------|
| GET    | `/api/todos`      | List all todos         |
| GET    | `/api/todos/:id`  | Get a single todo      |
| POST   | `/api/todos`      | Create a todo          |
| PUT    | `/api/todos/:id`  | Update a todo          |
| DELETE | `/api/todos/:id`  | Delete a todo          |

Full request/response documentation in [API.md](API.md).

## Frontend Architecture

- `pages/` — route-level components (`TodosListPage`, `TodoDetailPage`, `NotFoundPage`)
- `components/` — reusable UI pieces (Navbar, Spinner, ConfirmDialog, TodoCard, Pagination, EmptyState)
- `hooks/` — data-fetching hooks (`useTodos`, `useTodo`) that encapsulate loading/error state and API calls
- `api/` — Axios client and todo API functions
- `context/` — `ThemeContext` for light/dark mode
- `constants/`, `utils/` — shared constants and helper functions

## Backend Architecture

- `routes/` — Express routers mapping HTTP verbs/paths to controllers
- `controllers/` — request handlers, wrapped in `asyncHandler` for centralized error propagation
- `models/` — data-access layer (`todo.model.js` + the underlying JSON file reader/writer)
- `middleware/` — request validation, 404 handler, centralized error handler
- `utils/` — `AppError` (operational error class), `asyncHandler`
- `config/` — environment variable loading

## Screenshots

> _Add screenshots here once available._

| Todo List | Todo Details | Dark Mode |
|-----------|--------------|-----------|
| _placeholder_ | _placeholder_ | _placeholder_ |

## Future Improvements

- Swap file-based storage for MongoDB or SQLite for concurrent-write safety
- Add authentication and per-user todo lists
- Add automated test suite (unit + integration) and CI
- Add drag-and-drop reordering and bulk actions
- Add due-date reminders/notifications

## Contributing

1. Fork the repository and create a feature branch.
2. Keep changes scoped and commits logically organized.
3. Run both the frontend and backend locally and verify your change before opening a PR.
4. Open a pull request describing the change and any trade-offs.

