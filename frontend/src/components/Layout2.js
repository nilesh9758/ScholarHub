import React from 'react';
import { Link } from 'react-router-dom';


const Layout = ({ children }) => {

  const handleSignOut = async () => {
    try {
      // Perform sign-out logic here, such as sending a POST request to the sign-out endpoint
      await fetch('http://localhost:5000/signout', {
        method: 'POST',
        credentials: 'include', // Include credentials for CORS
      });
      // Redirect to the login page after sign-out
      window.location.href = '/login';
    }
    catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // const auth=localStorage.getItem('user');
  // const navigate=useNavigate();
  // const logout=()=>{
  //   localStorage.clear();
  //   navigate('/signup');
  // }
  const isLoggedin=true;
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-indigo-300 text-black py-4 flex justify-between items-center px-4 shadow-2xl">
      <div className="flex items-center " >
      <img className="logo w-12 h-12 border-black rounded-full mr-5"  alt="logo" src="https://imgs.search.brave.com/32pWfh2-hwyXyv2PFP3jL2_IF9JaqZExHuHFxAEJwTw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAxLzM4Lzg5LzM2/LzM2MF9GXzEzODg5/MzYzM19uUGFOaTFm/b1FKQjVEWVpjWG03/ZTJnS2FPbm42Y1Rq/Ry5qcGc">
      </img>
        <h1 className="text-3xl font-bold flex">Welcome to ScholarHub</h1>
        </div>
        
         {isLoggedin &&(
           <nav className="flex items-center mr-5">
             <div className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mr-5">
           <Link to="/login" className="px-4 py-4  text-bold">
             {/* <FontAwesomeIcon icon={faUserEdit} /> */}
             Login
           </Link>
           </div>
           <div className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md">
           <Link to="/signup" className="px-4 text-bold">
             {/* <FontAwesomeIcon icon={faBook} /> */}
             SignUp
           </Link>
           </div>
         </nav> 
         )}
        
      </header>

      <main className="flex-grow mb-3">{children}</main>
      <footer className="text-black">
        <div className="w-full h-16 bg-indigo-300">
          {/* Wavy border SVG */}
          <svg
            className="w-full h-16"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1200 0L0 0 0 32.1C94.9 44.4 193.9 51.9 297.1 54.4 470.2 58.4 648.3 45.5 824 21.6c74.1-7.9 150.7-18.2 221.9 8.5C1092 60.6 1200 65.1 1200 65.1V0z"
              fill="#ffffff"
            ></path>
          </svg>
        </div>
        <div className="text-center">
          <p> © 2024 ScholarHub. All rights reserved.</p>
        </div>
     
      </footer>
      {/* <footer className="bg-blue-700 text-white py-4 px-6 text-center">
        © 2024 Universe. All rights reserved.
      </footer> */}
     
    </div>
  );
};

export default Layout;
