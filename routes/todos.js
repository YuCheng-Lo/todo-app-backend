const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const {
  getAllTodos,
  createTodo,
  editTodo,
  updateTodoStatus,
  deleteTodo,
} = require("../controllers/todoController");

router.use(authenticate);

//受保護頁面
router.get("/", getAllTodos);

router.post("/", createTodo);

router.patch("/:id", editTodo);

router.patch("/:id/status", updateTodoStatus);

router.delete("/:id", deleteTodo);

module.exports = router;
