const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require('dotenv').config();

// Routes importing 
const userRoute = require("./routes/SignupLogin"); 
const semester_route = require('./routes/SemesterToCourses');
const add_course_route = require('./routes/AddCourses');
const studyMaterials = require('./routes/StudyMaterials');
const announcement_route = require('./routes/Announcement');
const signout_route = require('./routes/Singout');
const result_route = require('./routes/GpaSemester');
const individual_course = require('./routes/GpaCourses');
const link_route = require('./routes/Links');
const pyq_route = require('./routes/PyqRoute');
const admin_route = require('./routes/MakeAdmin');
const get_profile = require('./routes/EditProfile');

// Middleware importing
const { check_login } = require('./middlewares/check_for_login');
const { check_admin } = require('./middlewares/check_type');
const { configDotenv } = require("dotenv");

const app = express();
const port = 5000;

// Database connection
mongoose
  //.connect(process.env.DATABASE_URL)
  .connect("mongodb://localhost:27017/test")
  //.connect("mongodb+srv://iib2022038:acKZwVv2fnUYcNDT@cluster0.0ouumue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err.message));

// CORS Options for specific configurations
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend domain
  //origin: true, // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allows cookies to be included
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS middleware globally
app.use(cors(corsOptions)); 

// Built-in middlewares for parsing data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use("/signup", userRoute);

// Routes to make someone teacher/admin 
app.use('/admin', check_login, check_admin, admin_route);

// Route that shows courses for the student based on the selected semester
app.use('/semester', check_login, semester_route);

// Route to get profile info
app.use('/get_info', check_login, get_profile);

// Route to add some courses
app.use('/add_courses', check_login, add_course_route);

// Route for admins to add PDF files for courses, others can access
app.use("/course/studyMaterial", check_login, studyMaterials);

// Route for admins to add links to courses, others can access
app.use("/course/links", check_login, link_route);

// Route for admins to add past year questions (PYQs) for courses, others can access
app.use("/course/pyq", check_login, pyq_route);

// Announcement route
app.use('/announcements', check_login, announcement_route);

// Route for overall semester results
app.use('/result', check_login, result_route);

// Route for individual course results
app.use('/result/course', check_login, individual_course);

// Signout route
app.use('/signout', check_login, signout_route);

// Start the server
app.listen(port, () => console.log(`Server is running on port ${port}`));


// important

//this is to allow cross origin requests 

//*******to connect frontend to backend*****
//   app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     res.header('Access-Control-Allow-Credentials', 'true');
//     next();
//   });

//   app.options('*', cors())

//   app.options('*', (req, res) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     res.header('Access-Control-Allow-Credentials', 'true');
//     res.status(200).send();
//   });

// // MIDDLEWARE FOR PARSING DATA INTO UNDERSTANDABLE FORM BY SERVER
// //built in middlewares
// const corsOptions = {
//   origin: 'http://localhost:3000', // Replace with your frontend domain
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
//   credentials: true, // Allows cookies to be included
//   allowedHeaders: ['Content-Type', 'Authorization'], 
// };


// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(cookieParser());
