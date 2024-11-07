const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const personal_user = require('../models/PersonalDetails');

// Middleware to authenticate and get the user's rollNo from the JWT token
// const authenticateToken = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(' ')[1]; // Extract token from Authorization header

//     if (!token) {
//         return res.status(401).json({ message: 'Access denied. No token provided.' });
//     }

//     try {
//         // Verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nilesh_123');
//         req.user = { rollNo: decoded.rollNo }; // Attach rollNo to the request
//         next();
//     } catch (error) {
//         console.error("Token verification failed:", error);
//         return res.status(403).json({ message: 'Invalid or expired token.' });
//     }
// };

// PUT request to update user profile
//router.put('/',authenticateToken, async (req, res)...aise hota  in case 
router.put('/', async (req, res) => {
    const { rollNo } = req.body; // Extract rollNo from the verified token
    const updateFields = req.body;

    try {
        // Find the user by rollNo
        const user = await personal_user.findOne({ rollNo });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Prevent changing rollNo
        delete updateFields.rollNo;

        // Update user details
        Object.assign(user, updateFields);
        await user.save();

        res.json({ message: "User profile updated successfully." });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// GET request to fetch user profile
router.get('/', async (req, res) => {
    const token= req.cookies.token;
    const decoded = jwt.decode(token);
    if (!decoded) {
        throw new Error('Invalid token');
      }
    const { rollNo,name } = decoded;

    try {
        // Find the user by rollNo
        const user = await personal_user.findOne({ rollNo });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Exclude password field from user details
        const { password, ...userDetails } = user.toObject(); // Convert Mongoose document to plain JavaScript object

        res.json({ rollNo, ...userDetails });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const personal_user = require('../models/PersonalDetails');
// const { getUser } = require('../service/auth')

// // PUT request to update user profile
// router.put('/', async (req, res) => {
//     // Extract rollNo from request body
//     const { rollNo, ...updateFields } = req.body; // New details to update
//     console.log(rollNo);
//     try {
//         // Find the user by rollNo
//         const user = await personal_user.findOne({ rollNo });
//         console.log(user);
//         // If user not found, return error
//         if (!user) {
//             return res.status(404).json({ message: "User not found." });
//         }

//         // Prevent changing rollNo
//         //rollno deleted from updateFields
//         delete updateFields.rollNo;

//         // Update user details 
//         Object.assign(user, updateFields);
//         await user.save();

//         res.json({ message: "User profile updated successfully." });
//     } catch (error) {
//         console.error("Error updating user profile:", error);
//         res.status(500).json({ message: "Internal server error." });
//     }
// });

// // GET request to fetch user profile
// router.get('/', async (req, res) => {
//     // Extract UID from cookies
//     const uid = req.cookies.uid;
//     console.log(uid);
//     try {
//         // If UID is not available, return error
//         if (!uid) {
//             return res.status(400).json({ message: "UID not found in cookies." });
//         }

//         // Find the user by UID
//         // const user = await personal_user.findOne({ uid });
//         const user = getUser(uid);
//         // console.log(user);
//         // If user not found, return error
//         if (!user) {
//             return res.status(404).json({ message: "User not found." });
//         }

//         // Extract rollNo from the user object
//         const rollNo = user.rollNo;
//         const userByRollNo = await personal_user.findOne({ rollNo });

//         // If user not found, return error
//         if (!userByRollNo) {
//             return res.status(404).json({ message: "User not found." });
//         }

//         // Exclude password field from user details
//         const { password, ...userDetails } = userByRollNo.toObject(); // Convert Mongoose document to plain JavaScript object

//         res.json({ rollNo, ...userDetails });
//     } catch (error) {
//         console.error("Error fetching user profile:", error);
//         res.status(500).json({ message: "Internal server error." });
//     }
// });

// module.exports = router;
