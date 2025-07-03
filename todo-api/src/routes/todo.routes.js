import express from "express";
import {
  createTodo,
  getAllTodos,
  getTodosByUserId,
  updateTodo,
  deleteTodo,
  getTodoById,
  deleteManyTodos,
} from "../controllers/todo.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("user", " admin"), createTodo);
router.get("/", verifyToken, authorizeRoles("admin"), getAllTodos);
router.delete(
  "/todos",
  verifyToken,
  authorizeRoles("user", "admin"),
  deleteManyTodos
);
router.get(
  "/user/:userId",
  verifyToken,
  authorizeRoles("user", "admin"),
  getTodosByUserId
);
router.get("/:id", verifyToken, authorizeRoles("user", "admin"), getTodoById);
router.put("/:id", verifyToken, authorizeRoles("user", "admin"), updateTodo);
router.delete("/:id", verifyToken, authorizeRoles("user", "admin"), deleteTodo);

export default router;
