import express from "express";
import {
  register,
  verifyOtp,
  requestPasswordReset,
  resetPassword,
  login,
  logout,
} from "../controller/auth.js";

const route = express.Router();

route.post("/register", register);
route.post("/verify-otp", verifyOtp);
route.post("/forgot-password", requestPasswordReset);
route.post("/reset-password", resetPassword);
route.post("/login", login);
route.post("/logout", logout);

export default route;
