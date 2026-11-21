import User from "../models/User.js";
import Post from "../models/Post.js";

export const searchAll = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.json({ jobs: [], people: [], posts: [] });
    }

    // Safely escape special regex characters to prevent regex crashes
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(escapedQuery, "i");

    const [jobs, people, posts] = await Promise.all([
      Post.find({
        postType: "job",
        $or: [
          { "content.jobTitle": searchRegex },
          { "content.jobDescription": searchRegex },
        ],
      }).populate("author", "name role profilePictureUrl"),

      User.find({
        $or: [{ name: searchRegex }, { skills: searchRegex }],
      }).select("name role bio skills profilePictureUrl"),

      Post.find({
        postType: { $ne: "job" },
        $or: [{ "content.text": searchRegex }, { hashtags: searchRegex }],
      }).populate("author", "name role profilePictureUrl"),
    ]);

    res.json({ jobs, people, posts });
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ error: "Server error during search" });
  }
};
