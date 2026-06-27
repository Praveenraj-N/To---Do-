# Project Structure

```
.
├── backend/
│   ├── config/
│   │   └── env.js               # Loads and exports environment variables (PORT, NODE_ENV, CORS_ORIGIN)
│   ├── controllers/
│   │   └── todos.controller.js  # Request handlers for each todo route (thin, delegate to the model)
│   ├── data/
│   │   └── todos.json           # JSON file used as the data store (gitignored, created on first run)
│   ├── middleware/
│   │   ├── errorHandler.js      # Centralized error handler + 404 handler
│   │   └── validateTodo.js      # Request body validation for create/update
│   ├── models/
│   │   ├── db.js                # Low-level JSON file read/write helpers
│   │   └── todo.model.js        # Todo data-access layer (findAll, findById, create, update, remove)
│   ├── routes/
│   │   └── todos.routes.js      # Maps HTTP verbs + paths to controller functions
│   ├── utils/
│   │   ├── AppError.js          # Operational error class carrying an HTTP status code
│   │   └── asyncHandler.js      # Wraps async route handlers so thrown errors reach the error handler
│   ├── .env / .env.example      # Environment configuration
│   ├── .gitignore
│   ├── package.json
│   └── server.js                # App entry point: middleware setup, route mounting, listen()
│
└── frontend/
    ├── public/                  # Static assets served as-is (favicon, icons)
    ├── src/
    │   ├── api/
    │   │   ├── client.js        # Axios instance + response/error interceptor
    │   │   └── todos.api.js     # Todo-specific API calls (getTodos, getTodo, createTodo, ...)
    │   ├── components/          # Reusable, presentation-focused UI pieces
    │   │   ├── Navbar.jsx       # Responsive top navigation + dark mode toggle
    │   │   ├── Spinner.jsx      # Loading indicator
    │   │   ├── ConfirmDialog.jsx# Confirmation modal used before destructive actions
    │   │   ├── TodoCard.jsx     # Single todo row in the list page
    │   │   ├── Pagination.jsx   # Prev/next page controls
    │   │   └── EmptyState.jsx   # "No todos" placeholder
    │   ├── constants/
    │   │   └── index.js         # Priorities, categories, filters, sort options, page size, API base URL
    │   ├── context/
    │   │   └── ThemeContext.jsx # Light/dark theme state, persisted to localStorage
    │   ├── hooks/
    │   │   ├── useTodos.js      # List-level data fetching + CRUD actions + loading/error state
    │   │   └── useTodo.js       # Single-todo data fetching + update/delete + loading/error state
    │   ├── pages/                # Route-level components (one per page)
    │   │   ├── TodosListPage.jsx # Home page: list, search, filter, sort, pagination
    │   │   ├── TodoDetailPage.jsx# Details page: reads ?id=, view/edit/delete
    │   │   └── NotFoundPage.jsx  # 404 page for unmatched routes
    │   ├── utils/
    │   │   └── date.js           # Date formatting helpers
    │   ├── App.jsx                # Route definitions, providers (Theme), Navbar, ToastContainer
    │   ├── App.css                # App-wide styles (uses CSS variables for theming)
    │   ├── index.css              # CSS variable definitions for light/dark themes, base reset
    │   └── main.jsx                # React root, wraps App in BrowserRouter
    ├── .env / .env.example         # VITE_API_BASE_URL
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Why this layout

**Backend** follows a conventional layered structure (`routes` → `controllers` → `models`) so that:
- Routes only describe *what* maps to *what* — no logic.
- Controllers only orchestrate request/response — no direct file I/O.
- Models own all data access, so swapping the JSON file for a real database later only touches `models/`.
- Cross-cutting concerns (validation, error formatting, env loading) live in their own folders instead of being scattered through route handlers.

**Frontend** separates *data* (`api/`, `hooks/`) from *presentation* (`components/`, `pages/`):
- `pages/` are the only components React Router renders directly — each corresponds to a URL.
- `components/` are dumb, reusable, and used across multiple pages.
- `hooks/` hide all `axios` calls and loading/error bookkeeping behind a small interface (`{ todos, loading, error, addTodo, ... }`), so pages stay focused on rendering and user interaction.
- `constants/` and `utils/` prevent magic strings/values (priority lists, page size, date formatting) from being duplicated across pages.
