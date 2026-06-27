const express = require("express");
const controller = require("../controllers/todos.controller");
const { validateCreateTodo, validateUpdateTodo } = require("../middleware/validateTodo");

const router = express.Router();

router.get("/", controller.getAllTodos);
router.get("/:id", controller.getTodoById);
router.post("/", validateCreateTodo, controller.createTodo);
router.put("/:id", validateUpdateTodo, controller.updateTodo);
router.delete("/:id", controller.deleteTodo);

module.exports = router;
