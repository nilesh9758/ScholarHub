const jwt = require("jsonwebtoken");
require('dotenv').config();
const check_login = (req, res, next) => {
    // const authHeader = req.headers.authorization;
    // const token = authHeader && authHeader.split(' ')[1];
    const token = req.cookies.token;
    if (!token) {
        console.log("check login m dikkat");
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        //console.log("Authenticated user:", { rollNo: decoded.rollNo });
        next();
    } catch (err) {
        console.log("Token verification failed:", err);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = { check_login};


// const { getUser, checking_login } = require("../service/auth");

// const check_login = (req, res, next) => {
//     const sessionId = req.cookies.uid;
    
//     if(checking_login(req,res,sessionId)){
//         console.log(req.user);
//         next(); 
//     }
//     else{
//         res.status(401).send('Invalid session');
//     }
// };

// module.exports = {
//     check_login,
// }

