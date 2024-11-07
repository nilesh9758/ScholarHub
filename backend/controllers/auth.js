const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const personal_user = require("../models/PersonalDetails");
require('dotenv').config();
// User signup function
async function UserSignup(req, res) {
    try {
        const { name, rollNo, email, age, gender, password } = req.body;

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        await personal_user.create({
            name,
            rollNo,
            email,
            age,
            gender,
            password: hashedPassword,
        });

        console.log("User Signup Successful");
        return res.status(201).json({ message: "User Signup Successful." });
    } catch (error) {
        console.error("Error signing up user:", error);
        return res.status(500).json({ message: "User Signup Failed. Please try again later." });
    }
}

// User login function
async function UserLogin(req, res) {
    try {
        const { rollNo, password } = req.body;

        // Find user by rollNo
        const user = await personal_user.findOne({ rollNo });

        // If user not found, return an error message
        if (!user) {
            console.log("Incorrect rollNo or password.");
            return res.status(401).json({ message: "Invalid credentials. Please try again." });
        }

        // Compare the password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials. Please try again." });
        }

        // User found, create JWT token
        const token = jwt.sign(
            { rollNo: user.rollNo, name: user.name, userType: user.type },
            process.env.JWT_SECRET_KEY, 
            { expiresIn: '1h' }
        );

        console.log("User Login Successful");

        // Set JWT token in cookies (with options for security)
        res.cookie("token", token, {
            httpOnly: false,  // Make the cookie inaccessible to JavaScript
            secure: process.env.NODE_ENV === 'production',  // Ensure cookies are sent over HTTPS in production
            sameSite: 'strict',  // Prevent CSRF attacks
            maxAge: 3600 * 1000  // Cookie expiration time (1 hour)
        });

        return res.status(200).json({ message: "Login successful.", token }); // Send token in response body (optional)
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Login failed. Please try again later." });
    }
}

module.exports = {
    UserSignup,
    UserLogin,
};
