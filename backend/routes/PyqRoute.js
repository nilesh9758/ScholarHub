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
    course.pyq.push(result.secure_url);
    
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

    const cloudinaryUrl = course.pyq.find(note => note.startsWith('https://res.cloudinary.com'));
    if (!cloudinaryUrl) {
      return res.status(404).json({ message: 'Cloudinary URL not found in notes' });
    }

    const publicId = cloudinaryUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId);
    course.pyq = course.pyq.filter(note => note !== cloudinaryUrl);
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

    res.json(course.pyq);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve notes', error: error.message });
  }
});

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const fs = require('fs').promises;

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

// router.post("/upload_pyq", upload.single("file_pdf"), async (req, res) => {
//   // Check if the user is a teacher or admin
//   if (!check_if_teacher_or_admin(req)) {
//     return res.status(401).send("Not an admin or a teacher");
//   }

//   try {
//     // Retrieve the course based on the query parameter
//     const course = await Course.findOne({ title: req.query.course });

//     // If the course is not found, return a 404 response
//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     // Check if the pyq array exists, if not, initialize it
//     if (!course.pyq) {
//       course.pyq = [];
//     }

//     // Add the file location to the pyq array
//     course.pyq.push(req.file.path);
//     // Save the updated course document
//     await course.save();

//     // Send a success response with the updated course
//     res.status(200).json({
//       message: "File locations added to pyq array successfully",
//       course,
//     });
//   } catch (error) {
//     // Handle any errors that occur during the process
//     res.status(500).json({
//       message: "Failed to add file locations to pyq array",
//       error: error.message,
//     });
//   }
// });


// // router.delete("/delete", async (req, res) => {
// //   const fileName = req.body.fileName;
// //   const filePath = path.join('./uploads', fileName);
// //   console.log(filePath);

// //   if(!check_if_teacher_or_admin(req)){
// //     console.log("qert");
// //     return res.status(401).send("not an admin or a teacher");
// //   }

// //   try {
// //     const exists = await fs.pathExists(filePath);
// //     if (!exists) {
// //       return res.status(404).json({ message: "File not found" });
// //     }
// //     await fs.unlink(filePath);


// //     const stringToRemove = "uploads\\"+fileName; // The string to remove from the pyq array
// //     console.log(stringToRemove)

// //     try {        // Update the course document to remove all occurrences of the specified string from the pyq array
// //       const course = await Course.findOne({ title: req.body.course });

// //         if (!course) {
// //           return res.status(404).json({ message: 'Course not found' });
// //         }

// //         // Remove all occurrences of the specified string from the pyq array
// //         course.pyq = course.pyq.filter(note => note !== stringToRemove);

// //         // Save the updated course document
// //         await course.save();

// //         res.status(200).json({ message: 'Occurrences of the string removed from the pyq array', course });
// //       } 
// //     catch (error) {
// //       res.status(500).json({ message: 'Failed to remove occurrences of the string from the pyq array', error: error.message });
// //     }

// //   } catch (error) {
// //     // Failed to delete the file
// //     console.log(error.message)
// //     res
// //       .status(500)  
// //       .json({ message: "Failed to delete file", error: error.message });
// //   }
// // });



// router.delete("/delete", async (req, res) => {
//   const { fileName, course: courseTitle } = req.body;
//   const filePath = path.join(__dirname, 'uploads', fileName);  // Resolves the file path correctly
//   console.log("Deleting file at:", filePath);

//   // Check if the user is a teacher or admin
//   if (!check_if_teacher_or_admin(req)) {
//     console.log("Unauthorized attempt to delete file");
//     return res.status(401).send("Not an admin or a teacher");
//   }

//   try {
//     // Check if the file exists using fs.promises.access()
//     try {
//       await fs.access(filePath);  // Check if the file is accessible
//     } catch (error) {
//       return res.status(404).json({ message: "File not found" });
//     }

//     // File exists, so delete it
//     await fs.unlink(filePath);

//     // Construct the relative file path to remove from the pyq array
//     const stringToRemove = path.join('uploads', fileName);
//     console.log("Removing from pyq array:", stringToRemove);

//     try {
//       // Find the course by title
//       const course = await Course.findOne({ title: courseTitle });

//       if (!course) {
//         return res.status(404).json({ message: 'Course not found' });
//       }

//       // Remove the specified file path from the pyq array
//       course.pyq = course.pyq.filter(note => note !== stringToRemove);

//       // Save the updated course document
//       await course.save();

//       // Send success response
//       res.status(200).json({
//         message: 'File deleted and occurrence removed from the pyq array',
//         course,
//       });

//     } catch (error) {
//       console.error("Error updating course:", error.message);
//       res.status(500).json({
//         message: 'Failed to remove occurrences of the string from the pyq array',
//         error: error.message,
//       });
//     }

//   } catch (error) {
//     // Error in deleting the file
//     console.log("Error deleting file:", error.message);
//     res.status(500).json({
//       message: "Failed to delete file",
//       error: error.message,
//     });
//   }
// });


// // getting list/names of all files under pdf section under some specific course
// router.get("/", (req, res) => {
//   var course = req.query.course;
//   console.log(course)
//   Course.find({ title: course })
//     .then((foundpyq) => {
//       var reply = [];
//       var note = foundpyq[0].pyq;
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


// // user can get file with filename coming from the frontend
// // router.get("/files", async(req, res) => {
// //   const fileName = req.query.fileName;
// //   console.log(fileName);

// //   const filePath = path.join('./uploads', fileName);
// //   console.log(filePath);

// //   // only pdf file can be loaded not others

// //   const exists = await fs.pathExists(filePath);
// //     if (!exists) {
// //         return res.status(404).json({ message: "File not found" });
// //     }

// //   var data = fs.readFileSync(filePath);

// //     console.log(data)

// //   res.contentType("application/pdf");
// //   res.send(data);
// //   res.end();

// // });




// module.exports = router;
