import express from "express";
import {
  loginUser,
  refreshToken,
  registerUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser); // Đăng ký
router.post("/login", loginUser); // Đăng nhập
router.post("/refresh-token", refreshToken);

export default router;
