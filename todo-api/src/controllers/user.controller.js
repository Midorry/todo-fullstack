import User from "../models/user.model.js";
import bcrypt from "bcrypt";

// Create user (cũ)
export const createUser = async (req, res) => {
  try {
    const { userName, role, email, password } = req.body;

    // Kiểm tra email tồn tại
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Mã hoá password trước khi lưu
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      userName,
      role,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Đăng ký user (check trùng email)

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user by id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteManyUsers = async (req, res) => {
  try {
    const { ids } = req.body; // nhận mảng ids từ body

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Danh sách ids không hợp lệ" });
    }

    // Xoá nhiều
    const result = await User.deleteMany({ _id: { $in: ids } });

    res.json({ message: "Xoá thành công", deletedCount: result.deletedCount });
  } catch (error) {
    console.error("Lỗi xoá nhiều users:", error);
    res.status(500).json({ error: error.message });
  }
};
