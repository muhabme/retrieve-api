import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: [8, "Password must be at least 8 characters long."],
    },
    userName: {
      type: String,
      required: true,
      min: 3,
      max: 50,
      unique: true,
    },
    fullName: {
      type: String,
      default: "",
      max: 50,
    },
    about: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      max: 100,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
    },
    profilePicturePath: {
      type: String,
      default: "",
    },
    profilePictureURL: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    isSurveyDone: {
      type: Boolean,
      default: false,
    },
    likedPosts: {
      type: Map,
      of: Boolean,
      default: [],
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// UserSchema.methods.createJWT = function () {
//   return jwt.sign(
//     { userId: this._id, userName: this.userName, fullName: this.fullName  },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: process.env.JWT_LIFETIME,
//     }
//   );
// };

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

const User = mongoose.model("User", UserSchema);

export default User;
