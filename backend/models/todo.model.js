const { readDb, writeDb } = require("./db");

function findAll() {
  return readDb().todos;
}

function findById(id) {
  return readDb().todos.find((t) => t.id === Number(id));
}

function create({ title, description, completed, priority, category, dueDate }) {
  const db = readDb();
  const now = new Date().toISOString();
  const todo = {
    id: db.nextId,
    title: title.trim(),
    description: description ? String(description) : "",
    completed: Boolean(completed) || false,
    priority: priority || "medium",
    category: category || "general",
    dueDate: dueDate || null,
    createdAt: now,
    updatedAt: now,
  };
  db.todos.push(todo);
  db.nextId += 1;
  writeDb(db);
  return todo;
}

function update(id, updates) {
  const db = readDb();
  const todo = db.todos.find((t) => t.id === Number(id));
  if (!todo) return null;

  if (updates.title !== undefined) todo.title = updates.title.trim();
  if (updates.description !== undefined) todo.description = String(updates.description);
  if (updates.completed !== undefined) todo.completed = Boolean(updates.completed);
  if (updates.priority !== undefined) todo.priority = updates.priority;
  if (updates.category !== undefined) todo.category = updates.category;
  if (updates.dueDate !== undefined) todo.dueDate = updates.dueDate;
  todo.updatedAt = new Date().toISOString();

  writeDb(db);
  return todo;
}

function remove(id) {
  const db = readDb();
  const index = db.todos.findIndex((t) => t.id === Number(id));
  if (index === -1) return null;
  const [deleted] = db.todos.splice(index, 1);
  writeDb(db);
  return deleted;
}

module.exports = { findAll, findById, create, update, remove };
