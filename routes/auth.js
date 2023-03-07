import express from "express";
import {
  login,
  register,
  verifyOTP,
  sendOTPVerificationEmail,
} from "../controllers/auth.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/verifyOTP").post(verifyOTP);
router.route("/sendNewOTP").post(sendOTPVerificationEmail);

export { router };
