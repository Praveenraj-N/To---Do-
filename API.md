# API Documentation

Base URL: `http://localhost:4000/api` (configurable via `backend/.env` → `PORT`, and `frontend/.env` → `VITE_API_BASE_URL`).

All request/response bodies are JSON. All endpoints are prefixed with `/api`.

## Todo object shape

```json
{
  "id": 1,
  "title": "Buy milk",
  "description": "",
  "completed": false,
  "priority": "medium",
  "category": "general",
  "dueDate": null,
  "createdAt": "2026-06-27T13:05:41.269Z",
  "updatedAt": "2026-06-27T13:05:41.269Z"
}
```

| Field         | Type                          | Notes                                      |
|---------------|-------------------------------|---------------------------------------------|
| `id`          | number                        | Auto-incrementing, assigned by the server   |
| `title`       | string                        | Required, non-empty                         |
| `description` | string                        | Optional, defaults to `""`                  |
| `completed`   | boolean                       | Defaults to `false`                         |
| `priority`    | `"low" \| "medium" \| "high"` | Defaults to `"medium"`                      |
| `category`    | string                        | Defaults to `"general"`                     |
| `dueDate`     | ISO date string or `null`     | Optional                                    |
| `createdAt`   | ISO datetime string           | Set on creation, never changes              |
| `updatedAt`   | ISO datetime string           | Updated on every successful write           |

## Health check

### `GET /api/health`

Returns `{ "status": "ok" }` with status `200`. Used to verify the server is up.

## Endpoints

### `GET /api/todos`

List all todos.

- **Response:** `200 OK`, array of todo objects.

```bash
curl http://localhost:4000/api/todos
```

### `GET /api/todos/:id`

Get a single todo by id.

- **Response:** `200 OK` with the todo object.
- **Errors:** `404 Not Found` — `{ "error": "Todo not found" }` if no todo with that id exists.

```bash
curl http://localhost:4000/api/todos/1
```

### `POST /api/todos`

Create a new todo.

- **Body:** `{ "title": "string (required)", "description"?, "priority"?, "category"?, "dueDate"?, "completed"? }`
- **Response:** `201 Created` with the created todo object.
- **Errors:** `400 Bad Request` with `{ "error": "Validation failed", "errors": ["..."] }` when validation fails (e.g. missing title, invalid priority).

```bash
curl -X POST http://localhost:4000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk","priority":"high","category":"shopping"}'
```

### `PUT /api/todos/:id`

Update an existing todo. Supports partial updates — only send the fields you want to change.

- **Body:** any subset of `{ title, description, completed, priority, category, dueDate }`
- **Response:** `200 OK` with the updated todo object.
- **Errors:**
  - `404 Not Found` if the todo doesn't exist.
  - `400 Bad Request` if a provided field fails validation.

```bash
curl -X PUT http://localhost:4000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

### `DELETE /api/todos/:id`

Delete a todo.

- **Response:** `200 OK` with the deleted todo object.
- **Errors:** `404 Not Found` if the todo doesn't exist.

```bash
curl -X DELETE http://localhost:4000/api/todos/1
```

## Validation rules

Enforced by `backend/middleware/validateTodo.js`:

- `title` — required (on create), must be a non-empty string.
- `description` — must be a string if provided.
- `priority` — must be one of `low`, `medium`, `high`.
- `category` — must be a string if provided.
- `completed` — must be a boolean if provided.
- `dueDate` — must be a parseable date string, or `null`.

Validation failures return `400` with an `errors` array listing every failed rule.

## Error response format

All errors follow a consistent shape, produced by the centralized error handler (`backend/middleware/errorHandler.js`):

```json
{ "error": "Todo not found" }
```

or, for validation errors:

```json
{ "error": "Validation failed", "errors": ["title is required and must be a non-empty string"] }
```

Unmatched routes return `404` with `{ "error": "Route not found: GET /api/unknown" }`. Unexpected server errors return `500` with `{ "error": "Internal server error" }` (the stack trace is included only when `NODE_ENV=development`).

## Status codes used

| Code | Meaning                                  |
|------|--------------------------------------------|
| 200  | Success (GET, PUT, DELETE)                |
| 201  | Resource created (POST)                   |
| 400  | Validation failed                         |
| 404  | Resource or route not found               |
| 500  | Unexpected server error                   |
