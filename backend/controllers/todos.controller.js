const Todo = require("../models/todo.model");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const getAllTodos = asyncHandler(async (req, res) => {
  res.json(Todo.findAll());
});

const getTodoById = asyncHandler(async (req, res) => {
  const todo = Todo.findById(req.params.id);
  if (!todo) throw new AppError("Todo not found", 404);
  res.json(todo);
});

const createTodo = asyncHandler(async (req, res) => {
  const todo = Todo.create(req.body);
  res.status(201).json(todo);
});

const updateTodo = asyncHandler(async (req, res) => {
  const todo = Todo.update(req.params.id, req.body);
  if (!todo) throw new AppError("Todo not found", 404);
  res.json(todo);
});

const deleteTodo = asyncHandler(async (req, res) => {
  const todo = Todo.remove(req.params.id);
  if (!todo) throw new AppError("Todo not found", 404);
  res.json(todo);
});

module.exports = { getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo };
