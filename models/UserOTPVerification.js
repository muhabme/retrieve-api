import mongoose from "mongoose";

const UserOTPVerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
      index: { expires: "13m" },
      default: Date.now() + 13 * 60 * 1000,
    },
  },
  { timestamps: true }
);

const UserOTPVerification = mongoose.model("UserOTPVerification", UserOTPVerificationSchema);

export default UserOTPVerification;
