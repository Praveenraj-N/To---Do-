const express = require("express");
const cors = require("cors");
const { readDb, writeDb } = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const VALID_PRIORITIES = ["low", "medium", "high"];

function validateTodoInput(body, { partial = false } = {}) {
  const errors = [];
  if (!partial || body.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim() === "") {
      errors.push("title is required and must be a non-empty string");
    }
  }
  if (body.priority !== undefined && !VALID_PRIORITIES.includes(body.priority)) {
    errors.push(`priority must be one of: ${VALID_PRIORITIES.join(", ")}`);
  }
  if (body.completed !== undefined && typeof body.completed !== "boolean") {
    errors.push("completed must be a boolean");
  }
  if (body.dueDate !== undefined && body.dueDate !== null && isNaN(Date.parse(body.dueDate))) {
    errors.push("dueDate must be a valid date string");
  }
  return errors;
}

// GET /api/todos - list all todos
app.get("/api/todos", (req, res) => {
  const db = readDb();
  res.json(db.todos);
});

// GET /api/todos/:id - get a single todo
app.get("/api/todos/:id", (req, res) => {
  const db = readDb();
  const todo = db.todos.find((t) => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ error: "Todo not found" });
  res.json(todo);
});

// POST /api/todos - create a todo
app.post("/api/todos", (req, res) => {
  const errors = validateTodoInput(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const db = readDb();
  const now = new Date().toISOString();
  const todo = {
    id: db.nextId,
    title: req.body.title.trim(),
    description: req.body.description ? String(req.body.description) : "",
    completed: Boolean(req.body.completed) || false,
    priority: req.body.priority || "medium",
    dueDate: req.body.dueDate || null,
    createdAt: now,
    updatedAt: now,
  };
  db.todos.push(todo);
  db.nextId += 1;
  writeDb(db);
  res.status(201).json(todo);
});

// PUT /api/todos/:id - update a todo (full or partial)
app.put("/api/todos/:id", (req, res) => {
  const db = readDb();
  const todo = db.todos.find((t) => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ error: "Todo not found" });

  const errors = validateTodoInput(req.body, { partial: true });
  if (errors.length) return res.status(400).json({ errors });

  if (req.body.title !== undefined) todo.title = req.body.title.trim();
  if (req.body.description !== undefined) todo.description = String(req.body.description);
  if (req.body.completed !== undefined) todo.completed = Boolean(req.body.completed);
  if (req.body.priority !== undefined) todo.priority = req.body.priority;
  if (req.body.dueDate !== undefined) todo.dueDate = req.body.dueDate;
  todo.updatedAt = new Date().toISOString();

  writeDb(db);
  res.json(todo);
});

// DELETE /api/todos/:id - delete a todo
app.delete("/api/todos/:id", (req, res) => {
  const db = readDb();
  const index = db.todos.findIndex((t) => t.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Todo not found" });

  const [deleted] = db.todos.splice(index, 1);
  writeDb(db);
  res.json(deleted);
});

app.listen(PORT, () => {
  console.log(`Todo backend listening on http://localhost:${PORT}`);
});
