const { nodeEnv } = require("../config/env");

function notFoundHandler(req, res, next) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const body = {
    error: err.isOperational ? err.message : "Internal server error",
  };
  if (err.details) body.errors = err.details;
  if (nodeEnv === "development" && !err.isOperational) body.stack = err.stack;

  if (!err.isOperational) console.error(err);
  res.status(statusCode).json(body);
}

module.exports = { notFoundHandler, errorHandler };
