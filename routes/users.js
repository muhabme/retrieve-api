import express from "express";
// import { verifyToken } from "../middleware/auth";
import {
    updateProfile,
//   getUser,
//   getUserFriends,
//   addRemoveFriend,
} from "../controllers/users.js";

const router = express.Router();

// router.route("/:id").get(getUser);
// router.route("/:id/friends").get(getUserFriends);
// router.route("/:id/:friendId").patch(addRemoveFriend);
router.patch("/updateProfile", updateProfile);

export { router };
