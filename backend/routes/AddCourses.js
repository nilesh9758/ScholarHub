const express = require('express')

// model needed
const Course = require("../models/course");
const router = express.Router()

function check_if_teacher_or_admin(req){
  return req.body.userType==="admin" || req.body.userType==="teacher";
}

// power given only to admin to add courses
router.post("/", async (req, res) => {
  if(check_if_teacher_or_admin(req)){
    try {
      const newCourse = new Course(req.body.formData);
      const savedCourse = await newCourse.save();
      res.status(201).json(savedCourse);
    } 
    catch (error) {
      console.error("Error adding course:", error);
      res.status(500).json({ error: "Failed to add course" });
    }
    res.end();
  }
  else{
    return res.status(401).send("you are not admin or teacher");
  }

  });

module.exports=router