const express = require("express");
const Courses = require("../models/course");
const router = express.Router();

router.get('/', async (req, res) => {
 // const uid = req.cookies?.uid;

  // Check if the user is logged in
  // if (!checking_login(req, res, uid)) {
  //   return res.status(401).json({ message: "You have not logged in yet" });
  // }

  // Check if semester query parameter is provided
  const semester = req.query.semester;
  if (!semester) {
    return res.status(400).json({ message: "Semester parameter is required" });
  }

  try {
    // Retrieve all courses for the specified semester
    const foundCourses = await Courses.find({ semester: semester });
    res.json(foundCourses);
    //console.log(`Courses for semester ${semester}:`, foundCourses);
  } catch (error) {
    console.error("Error retrieving courses:", error);
    res.status(500).json({ message: "Error retrieving courses" });
  }
});

module.exports = router;


