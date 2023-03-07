import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import User from "../models/User.js";
import UserOTPVerification from "../models/UserOTPVerification.js";

// REGISTER USER

export const register = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const userName = req.body.userName.toLowerCase();
    const { password, fullName, pictureUrl, friends } = req.body;

    let emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(500).json({ msg: "Email address already exists." });
    }
    let userNameExists = await User.findOne({ userName });
    if (userNameExists) {
      return res.status(500).json({ msg: "Username already exists." });
    }

    const newUser = new User({
      email,
      password,
      userName,
      fullName,
      pictureUrl,
      friends,
    });

    req.body.data = await newUser.save();
    const OTPStatus = await sendOTPVerificationEmail(req, res);
    res.status(201).json({ OTPStatus, user: newUser });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase();
    const userName = req.body.userName?.toLowerCase();
    const { password } = req.body;
    let user = {};
    if (email) {
      user = await User.findOne({ email });
    } else if (userName) {
      user = await User.findOne({ userName });
    }
    if (!user) return res.status(400).json({ msg: "User does not exist." });
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect)
      return res.status(400).json({ msg: "Invalid Credentials." });
    // const token = user.createJWT();
    user.password = undefined;
    res.status(200).json({ user });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

//OTP

export const sendOTPVerificationEmail = async (req, res) => {
  try {
    const { _id, email } = req.body.data;
    const action = req.body.action
    // get access token and create transporter
    const oauth2Client = new google.auth.OAuth2(
      process.env.MAILING_SERVICE_CLIENT_ID,
      process.env.MAILING_SERVICE_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.MAILING_SERVICE_REFRESH_TOKEN,
    });
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.SENDER_EMAIL_ADDRESS,
        clientId: process.env.MAILING_SERVICE_CLIENT_ID,
        clientSecret: process.env.MAILING_SERVICE_CLIENT_SECRET,
        refreshToken: process.env.MAILING_SERVICE_REFRESH_TOKEN,
        accessToken,
      },
    });
    await UserOTPVerification.deleteMany({ userId: _id });

    // Create the OTP
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
    console.log(otp);

    // mail options
    const mailOptions = {
      from: ` "Retrieve" <${process.env.AUTH_EMAIL}>`,
      to: email,
      subject: "Verify Your Retrieve Account",
      html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete the sign up process.</p>
      <p>This code <b>expires in 10 minutes</b>.</p>`,
    };

    // hash the otp
    const salt = await bcrypt.genSalt();
    const hashedOTP = await bcrypt.hash(otp, salt);
    const newOTPVerification = new UserOTPVerification({
      userId: _id,
      otp: hashedOTP,
    });
    // save otp record
    await newOTPVerification.save();
    await transporter.sendMail(mailOptions);
    if (action === "Another Verification Code") {
      return res.status(200).json({
        msg: "Verification OTP Email sent.",
        data: { _id, email, verified: false },
      })

    }
      return {
        msg: "Verification OTP Email sent.",
        data: { _id, email, verified: false },
      };
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
      return res.status(400).json({ msg: "OTP Parameters cannot be empty." });
    } else {
      const UserOTPVerificationRecords = await UserOTPVerification.find({
        userId,
      });
      if (UserOTPVerificationRecords.length <= 0) {
        // No record found
        return res.status(400).json({
          msg: "Please Request a new OTP.",
        });
      } else {
        // user record exists
        // const { expireAt } = UserOTPVerificationRecords[0];
        // const date = new Date()
        // console.log(date);
        // console.log(expireAt);
        const hashedOTP = UserOTPVerificationRecords[0].otp;
        // if (expireAt < date) {
        //   // user otp record expired
        //   await UserOTPVerification.deleteMany({ userId });
        //   return res.status(400).json({
        //     msg: "Code has expired. Please request a new otp code.",
        //   });
        // } else {
          const validotp = await bcrypt.compare(otp, hashedOTP);
          if (!validotp) {
            // supplied otp is wrong
            return res.status(400).json({
              msg: "Invalid OTP.",
            });
          } else {
            // success
            await User.updateOne({ _id: userId }, { verified: true });
            const user = await User.findOne({ _id: userId });
            // const token = user.createJWT();
            user.password = undefined;
            await UserOTPVerification.deleteMany({ userId });
            res.status(200).json({
              msg: "User email verified successfully.",
              user,
            });
          }
        // }
      }
    }
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};
