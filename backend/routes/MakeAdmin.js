
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const personal_user = require("../models/PersonalDetails");

//helper function
const updateUserType = async (rollNo, newType, req, res) => {
    const token = req.cookies.token; // Assuming token is stored in cookies
    
    if (!token) {
        return res.status(401).json({ message: "Token not found" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use jwt.verify to validate token
            const { AdminRollNo } = decoded;

        if (rollNo === AdminRollNo) {
            return res.status(401).json({ message: "You can't change yourself" });
        }

        const user = await personal_user.findOne({ rollNo });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.type = newType;
        await user.save();
        
        return res.status(200).json({ message: `${newType} updated successfully` });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Admin can make teacher
router.put('/teacher', async (req, res) => {
    const { rollNo } = req.body;
    console.log(`Trying to make ${rollNo} a teacher`);
    // Directly handle the response from the helper function
    await updateUserType(rollNo, 'teacher', req, res);
});

// Admin can make student
router.put('/student', async (req, res) => {
    const { rollNo } = req.body;
    console.log(`Trying to make ${rollNo} a student`);
    // Directly handle the response from the helper function
    await updateUserType(rollNo, 'student', req, res);
});

// Admin can make admin
router.put('/admin', async (req, res) => {
    const { rollNo } = req.body;
    console.log(`Trying to make ${rollNo} an admin`);
    // Directly handle the response from the helper function
    await updateUserType(rollNo, 'admin', req, res);
});

module.exports = router;
