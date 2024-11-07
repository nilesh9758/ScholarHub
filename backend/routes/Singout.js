const express = require('express');
const router = express.Router();


//token ko cookie se hata diya(reset)

router.post('/', (req, res) => {
    // Clear the token cookie by setting it to an empty string and expiring it immediately
    res.cookie('token', '', {
        httpOnly: false,      // Keeps it inaccessible to JavaScript
        secure: false,       // Set to true if using HTTPS in production
        sameSite: 'Strict',  // Controls cross-site behavior
        expires: new Date(0) // Expire the cookie immediately
    });

    return res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;



// const express = require('express')
// const cookieParser = require("cookie-parser");
// const router = express.Router()

// router.use(cookieParser());

// // importing fucntion of removing session id
// const {remove_uuid} = require('../service/auth')

// router.post('/',(req,res)=>{
//     remove_uuid(req.cookies?.uid)
//     res.status(200).json("logout")
    
// })

// module.exports = router 
