require("dotenv").config();

const defaultCorsOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

module.exports = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
    : defaultCorsOrigins,
};
