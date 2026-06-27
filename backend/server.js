const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { port, nodeEnv, corsOrigin } = require("./config/env");
const todosRoutes = require("./routes/todos.routes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: corsOrigin }));
app.use(express.json());
app.use(morgan(nodeEnv === "development" ? "dev" : "combined"));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/todos", todosRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Todo backend listening on http://localhost:${port}`);
});
