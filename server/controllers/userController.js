// controllers/userController.js
import User from "../models/User.js";

export const updateMe = async (req, res) => {
  try {
    const { name, bio, skills, profilePictureUrl } = req.body;

    const update = {};
    if (name !== undefined) update.name = name;
    if (bio !== undefined) update.bio = bio;
    if (skills !== undefined) update.skills = skills;
    if (profilePictureUrl !== undefined) update.profilePictureUrl = profilePictureUrl;

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    const userId = req.user._id; // ✅ correct way now
    const user = await User.findByIdAndUpdate(userId, update, { new: true });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(typeof user.toSafeJSON === "function" ? user.toSafeJSON() : user.toObject());
  } catch (err) {
    console.error("updateMe error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};
