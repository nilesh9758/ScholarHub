const express = require("express");

// Model importing 
const Announ = require("../models/Announcement");
const router = express.Router();

// Check if user is a teacher or admin
function check_if_teacher_or_admin(req) {
  return req.body.userType === "admin" || req.body.userType === "teacher";
}

// Only for admin or teacher
router.post("/", async (req, res) => {
  if (!check_if_teacher_or_admin(req)) {
    return res.status(401).json({ error: "You are not authorized. Must be admin or teacher." });
  }

  // Ensure required fields are present
  const { title, body } = req.body.newAnnouncement;
  if (!title || !body) {
    return res.status(400).json({ error: "Title and body are required." });
  }

  try {
    const newAnnounce = new Announ({
      title: title,
      body: body,
      date: Date.now(),
    });

    await newAnnounce.save();
    res.status(201).json({ message: "Announcement created successfully." });
  } catch (error) {
    console.error("Error creating Announcement:", error);
    res.status(500).json({ error: "Internal server error. Could not create the announcement." });
  }
});

router.get("/", async (req, res) => {
  try {
    const announcements = await Announ.find().sort({ date: -1 });
    res.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ error: "Internal server error. Could not fetch announcements." });
  }
});

module.exports = router;
