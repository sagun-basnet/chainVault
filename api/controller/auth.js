import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { sendOtpEmail } from "../utils/mail.js";

const prisma = new PrismaClient();

let pendingRegistrations = {}; // Temp in-memory store

// Register: Step 1 - Send OTP
export const register = async (req, res) => {
  const { name, address, phone, email, password, role_id } = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(409).json({ message: "User already exists." });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    // Store pending registration
    pendingRegistrations[email] = {
      name,
      address,
      phone,
      email,
      password,
      role_id,
      otp,
    };
    console.log(otp, ":OTP");

    // Send OTP (implement sendOtpEmail yourself)
    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// Register: Step 2 - Verify OTP and create user
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const registration = pendingRegistrations[email];

  if (!registration) {
    return res.status(404).json({ message: "No registration found." });
  }

  if (parseInt(otp) !== registration.otp) {
    return res.status(200).json({ message: "Invalid OTP.", success: 0 });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(registration.password, 10);
    // Create user with Prisma
    await prisma.user.create({
      data: {
        name: registration.name,
        email: registration.email,
        password: hashedPassword,
        role: registration.role_id === 1 ? "ADMIN" : "USER", // Adjust as needed
        // Add address/phone if your schema supports it
      },
    });
    delete pendingRegistrations[email]; // Remove from temp store
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User Not found." });

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword)
      return res.status(400).json({ message: "Password not match" });

    // Generate JWT token with 1-month expiry
    const token = jwt.sign({ id: user.id, role: user.role }, "secretkey", {
      expiresIn: "30d",
    });

    const { password: pw, ...others } = user;

    res
      .cookie("accessToken", token, {
        httpOnly: false,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json({ message: "Login Successfully.", others, token });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// Password Reset OTP Table: password_reset_otps
// Prisma model needed: PasswordResetOtp (id, email, otp, expiresAt)

// Request Password Reset (send OTP)
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    // Store OTP in DB
    await prisma.passwordResetOtp.create({
      data: { email, otp, expiresAt },
    });
    await sendOtpEmail(email, otp);
    res.status(200).json({ message: "OTP sent to your email.", success: 1 });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    // Get latest OTP for this email
    const otpRecord = await prisma.passwordResetOtp.findFirst({
      where: { email },
      orderBy: { id: "desc" },
    });
    if (!otpRecord) return res.status(400).json({ message: "OTP not found." });
    if (otpRecord.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP." });
    if (new Date() > otpRecord.expiresAt)
      return res.status(400).json({ message: "OTP expired." });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
    // Optionally delete OTPs for this email
    await prisma.passwordResetOtp.deleteMany({ where: { email } });
    res
      .status(200)
      .json({ message: "Password reset successfully.", success: 1 });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("accessToken").json({ message: "Logout successfully." });
};
