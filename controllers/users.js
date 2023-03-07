import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const {
      userId,
      fullName,
      about,
      address,
      dateOfBirth,
      gender,
      profilePicturePath,
      profilePictureURL,
      isSurveyDone,
    } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        about,
        address,
        dateOfBirth,
        gender,
        profilePicturePath,
        profilePictureURL,
        isSurveyDone,
      },
      { new: true }
    );
    // const token = user.createJWT();
    user.password = undefined;
    res.status(200).json({ user });
  } catch (e) {
    res.status(404).json({ msg: e.message });
  }
};

// export const getUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findById(id);
//     user.password = undefined;
//     res.status(200).json(user);
//   } catch (e) {
//     res.status(404).json({ msg: e.message });
//   }
// };

// export const getUserFriends = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findById(id);

//     const friends = await Promise.all(
//       user.friends.map((id) => User.findById(id))
//     );
//     const formattedFriends = friends.map(
//       ({ _id, firstName, lastName, occupation, location, picturePath }) => {
//         return {
//           _id,
//           firstName,
//           lastName,
//           occupation,
//           location,
//           picturePath,
//         };
//       }
//     );
//     res.status(200).json(formattedFriends);
//   } catch (e) {
//     res.status(404).json({ msg: e.message });
//   }
// };

// export const addRemoveFriend = async (req, res) => {
//   try {
//     const { id, friendId } = req.params;

//     if (req.user.id !== id) return res.status(403).send("Access Denied");

//     const user = await User.findById(id);
//     const friend = await User.findById(friendId);
//     if (user.friends.includes(friendId)) {
//       user.friends = user.friends.filter((id) => id !== friendId);
//       friend.friends = friend.friends.filter((id) => id !== id);
//     } else {
//       user.friends.push(friendId);
//       friend.friends.push(id);
//     }
//     await user.save();
//     await friend.save();

//     const friends = await Promise.all(
//       user.friends.map((id) => User.findById(id))
//     );
//     const formattedFriends = friends.map(
//       ({ _id, firstName, lastName, occupation, location, picturePath }) => {
//         return {
//           _id,
//           firstName,
//           lastName,
//           occupation,
//           location,
//           picturePath,
//         };
//       }
//     );

//     res.status(200).json(formattedFriends);
//   } catch (e) {
//     res.status(404).json({ msg: e.message });
//   }
// };
