const AppError = require("../utils/AppError");

const VALID_PRIORITIES = ["low", "medium", "high"];

function validate(body, { partial = false } = {}) {
  const errors = [];

  if (!partial || body.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim() === "") {
      errors.push("title is required and must be a non-empty string");
    }
  }
  if (body.description !== undefined && typeof body.description !== "string") {
    errors.push("description must be a string");
  }
  if (body.priority !== undefined && !VALID_PRIORITIES.includes(body.priority)) {
    errors.push(`priority must be one of: ${VALID_PRIORITIES.join(", ")}`);
  }
  if (body.category !== undefined && body.category !== null && typeof body.category !== "string") {
    errors.push("category must be a string");
  }
  if (body.completed !== undefined && typeof body.completed !== "boolean") {
    errors.push("completed must be a boolean");
  }
  if (body.dueDate !== undefined && body.dueDate !== null && isNaN(Date.parse(body.dueDate))) {
    errors.push("dueDate must be a valid date string");
  }

  return errors;
}

const validateCreateTodo = (req, res, next) => {
  const errors = validate(req.body, { partial: false });
  if (errors.length) return next(new AppError("Validation failed", 400, errors));
  next();
};

const validateUpdateTodo = (req, res, next) => {
  const errors = validate(req.body, { partial: true });
  if (errors.length) return next(new AppError("Validation failed", 400, errors));
  next();
};

module.exports = { validateCreateTodo, validateUpdateTodo, VALID_PRIORITIES };
