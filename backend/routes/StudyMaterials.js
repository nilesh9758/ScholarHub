const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs-extra');
require('dotenv').config();

// Model
const Course = require('../models/course');

function check_if_teacher_or_admin(req) {
  return req.body.userType === "admin" || req.body.userType === "teacher";
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Multer storage configuration
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Upload PDF to Cloudinary and add URL to course notes
router.post('/upload_pdf', upload.single('file_pdf'), async (req, res) => {
  if (!check_if_teacher_or_admin(req)) {
    return res.status(401).json({ message: 'You are not admin or teacher' });
  }

  try {
    const course = await Course.findOne({ title: req.query.course });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    console.log("File uploaded successfully")
    course.notes.push(result.secure_url);
    
    await course.save();
    await fs.unlink(req.file.path); // Delete temporary file
    res.status(200).json({
      message: 'File uploaded to Cloudinary and added to notes array successfully',
      course
    });
  } catch (error) {
    console.log(error);
    if (req.file && req.file.path)
    await fs.unlink(req.file.path).catch(() => {});
    res.status(500).json({
      message: 'Failed to upload file or add to notes array',
      error: error.message
    });
  }
});

// Delete PDF from Cloudinary and remove URL from course notes
router.delete('/delete', async (req, res) => {
  if (!check_if_teacher_or_admin(req)) {
    return res.status(401).json({ message: 'You are not admin or teacher' });
  }

  try {
    const course = await Course.findOne({ title: req.body.course });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const cloudinaryUrl = course.notes.find(note => note.startsWith('https://res.cloudinary.com'));
    if (!cloudinaryUrl) {
      return res.status(404).json({ message: 'Cloudinary URL not found in notes' });
    }

    const publicId = cloudinaryUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId);
    course.notes = course.notes.filter(note => note !== cloudinaryUrl);
    await course.save();

    res.status(200).json({ message: 'PDF deleted from Cloudinary and removed from notes' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete PDF or remove from notes', error: error.message });
  }
});

// Get list of PDF URLs for a specific course
router.get('/', async (req, res) => {
  try {
    const course = await Course.findOne({ title: req.query.course });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course.notes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve notes', error: error.message });
  }
});

module.exports = router;

/***** FOR LOCAL STORAGE IN ./uploads folder *****/

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs-extra");

// //model
// const Course = require("../models/course");


// function check_if_teacher_or_admin(req){
//   return req.body.userType==="admin" || req.body.userType==="teacher";
// }

// // finding and application
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     return cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     return cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// router.post("/upload_pdf" , upload.single("file_pdf"), async (req, res) => {

//   if(check_if_teacher_or_admin(req)){

//     try {
//       const course = await Course.find({ title: req.query.course });
//       if (!course) {
//         return res.status(404).json({ message: "Course not found" });
//       }

//       // Add file locations to the notes array
//       course[0].notes.push(req.file.path);
//       await course[0].save();
//       res.status(200).json({
//         message: "File locations added to notes array successfully",
//         course,
//       });
//     } catch (error) {
//       res.status(500).json({
//         message: "Failed to add file locations to notes array",
//         error: error.message,
//       });
//     }
//   }
//   else{
//     return res.status(401).send("you are not admin or teacher");
//   }
// });
// router.delete("/delete", async (req, res) => {
//   const fileName = req.body.fileName;
//   const filePath = path.join('./uploads', fileName);
//   console.log(filePath);

//   if(check_if_teacher_or_admin(req)){
//     try {
//       const exists = await fs.pathExists(filePath);
//       if (!exists) {
//         return res.status(404).json({ message: "File not found" });
//       }
//       await fs.unlink(filePath);


//       const stringToRemove = "uploads\\"+fileName; // The string to remove from the notes array
//       console.log(stringToRemove)

//       try {        // Update the course document to remove all occurrences of the specified string from the notes array
//         const course = await Course.findOne({ title: req.body.course });

//           if (!course) {
//             return res.status(404).json({ message: 'Course not found' });
//           }

//           // Remove all occurrences of the specified string from the notes array
//           course.notes = course.notes.filter(note => note !== stringToRemove);

//           // Save the updated course document
//           await course.save();

//           res.status(200).json({ message: 'Occurrences of the string removed from the notes array', course });
//         } 
//       catch (error) {
//         res.status(500).json({ message: 'Failed to remove occurrences of the string from the notes array', error: error.message });
//       }

//     } catch (error) {
//       // Failed to delete the file
//       console.log(error.message)
//       res
//         .status(500)  
//         .json({ message: "Failed to delete file", error: error.message });
//     }
//   }
//   else{
//     return res.status(401).send("you are not admin or teacher")
//   }
  
// });
// // getting list/names of all files under pdf section under some specific course
// router.get("/", (req, res) => {
//   var course = req.query.course;
//   Course.find({ title: course })
//     .then((foundpdf) => {
//       var reply = [];
//       var note = foundpdf[0].notes;
//       for (i = 0; i < note.length; i++) {
//         reply.push(path.basename(note[i]));
//       }
//       res.json(reply);
//     })
//     .catch((error) => {
//       console.error("Error retrieving courses:", error);
//       res.status(500).send("Error retrieving courses");
//     });
// });

// module.exports = router;
