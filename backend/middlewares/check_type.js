const jwt = require("jsonwebtoken");
require('dotenv').config();
const check_admin = (req, res, next) => {
    // Get the token from cookies (ensure `cookie-parser` middleware is used)
    const token = req.cookies.token; // Access cookies properly
    if (!token) {
        console.log("No token found in cookies.");
        return res.status(401).json({ message: "No token provided." });
    }

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY); // Secret key
        // Extract userType from the decoded token
        const userType = decoded.userType;

        // Check if the user is an admin
        if (userType === "admin") {
            next(); // Proceed to the next middleware or route handler
        } else {
            console.log("User is not an admin.");
            return res.status(403).json({ message: "You are not an admin." }); // Forbidden for non-admin users
        }
    } catch (err) {
        console.log("Error verifying token:", err.message); // More detailed logging of the error message
        return res.status(401).json({ message: "Invalid or expired token." }); // Handle invalid token
    }
};

module.exports = {
    check_admin,
};
