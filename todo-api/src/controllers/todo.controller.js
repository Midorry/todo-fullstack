import Todo from "../models/todo.model.js";
import User from "../models/user.model.js";

// Create todo
export const createTodo = async (req, res) => {
  try {
    const { title, completed, priority, deadline, tags } = req.body;

    const newTodo = new Todo({
      title,
      completed,
      priority,
      deadline,
      tags,
      userId: req.userId, // lấy từ token
    });

    const saved = await newTodo.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all todos
export const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find().populate("userId", "email");
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get todos by userId
export const getTodosByUserId = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.params.userId });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update todo
export const updateTodo = async (req, res) => {
  try {
    const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete todo
export const deleteTodo = async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(deletedTodo.userId, {
      $pull: { todos: deletedTodo._id },
    });
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteManyTodos = async (req, res) => {
  try {
    const { ids } = req.body; // nhận mảng ids từ body

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Danh sách ids không hợp lệ" });
    }

    // Xoá nhiều
    const result = await Todo.deleteMany({ _id: { $in: ids } });

    res.json({ message: "Xoá thành công", deletedCount: result.deletedCount });
  } catch (error) {
    console.error("Lỗi xoá nhiều todos:", error);
    res.status(500).json({ error: error.message });
  }
};
