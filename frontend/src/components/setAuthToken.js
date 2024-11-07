import axios from "axios";

const setAuthToken = (token) => {

    if(token){
    axios.defaults.headers.common['Authorization']=`Bearer ${token}`;
   }else{
    delete axios.defaults.headers.common['Authorization'];
   }
   localStorage.setItem('token', token);

   // if (!token) {
   //     return res.status(400).json({ message: 'Token is required' });
   // }

   // // Set the JWT token in an HTTP-only cookie
   // res.cookie('token', token, {
   //     httpOnly: true,  // Prevents JavaScript access to the cookie
   //     secure: false,   // Set to true if using HTTPS in production
   //     sameSite: 'Strict', // Controls cross-site behavior
   //     maxAge: 3600000, // 1 hour expiration
   // });

   //return res.status(200).json({ message: 'Token stored in cookies successfully' });
};

export default setAuthToken;
