const API_BASE = "http://localhost:4000/api";

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.errors ? data.errors.join(", ") : data.error || "Request failed");
  }
  return data;
}

export const getTodos = () => request("/todos");

export const getTodo = (id) => request(`/todos/${id}`);

export const createTodo = (todo) =>
  request("/todos", { method: "POST", body: JSON.stringify(todo) });

export const updateTodo = (id, updates) =>
  request(`/todos/${id}`, { method: "PUT", body: JSON.stringify(updates) });

export const deleteTodo = (id) => request(`/todos/${id}`, { method: "DELETE" });
