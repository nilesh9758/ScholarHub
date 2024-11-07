import { faBook, faChartBar, faSignOutAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons'; // Import icons from @fortawesome/free-solid-svg-icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


const Layout = ({children}) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Function to fetch user details from backend
    //isko useeffect k bahar bhi kr skte hai declare
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get_info', {
          withCredentials: true, // Include credentials for CORS
        //   headers: {
        //     Authorization: Bearer ${token}
        // }
        });
        if (response.status === 200) {
          //fetchinng name of the logged in user to display on the navbar
          const userData = response.data;
          setUserName(userData.name);
        } else {
          console.log('Failed to fetch user data');
        }
      }
      catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []); // Run once on component mount


const handleSignOut = async () => {
    try {
        // Perform sign-out logic by sending a POST request to the sign-out endpoint
        const response = await axios.post('http://localhost:5000/signout', {}, {
          withCredentials: true, // Include credentials if cookies are involved
          // headers: {
          //     'Authorization': `Bearer ${localStorage.getItem('token')}`, // Optional, if your server needs it
          // },
      });

        // Check if the response is successful
        if (response.status !== 200) {
            throw new Error('Failed to sign out. Please try again.');
        }

        // Optionally clear any local storage or session storage if you are using it
        localStorage.removeItem('token'); // Uncomment if you store token in local storage

        // Redirect to the login page after sign-out
        window.location.href = '/login';
    } catch (error) {
        console.error('Error signing out:', error);
        // Optionally, you can show an error message to the user
        alert('Error signing out: ' + (error.response?.data?.message || error.message));
    }
};

  // const handleSignOut = async () => {
  //   try {
  //     // Perform sign-out logic here, such as sending a POST request to the sign-out endpoint
  //     await fetch('http://localhost:5000/signout', {
  //       method: 'POST',
  //       credentials: 'include', // Include credentials for CORS
  //     });
  //     // Redirect to the login page after sign-out
  //     window.location.href = '/login';
  //   } catch (error) {
  //     console.error('Error signing out:', error);
  //   }
  // };

  const isLoggedin = true; // Placeholder for login status

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-indigo-300 text-black py-4 flex justify-between items-center px-4 shadow-2xl">
        <div className="flex items-center">
          <img
            className="logo w-12 h-12 border-black rounded-full mr-5"
            alt="logo"
            src="https://imgs.search.brave.com/32pWfh2-hwyXyv2PFP3jL2_IF9JaqZExHuHFxAEJwTw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAxLzM4Lzg5LzM2/LzM2MF9GXzEzODg5/MzYzM19uUGFOaTFm/b1FKQjVEWVpjWG03/ZTJnS2FPbm42Y1Rq/Ry5qcGc"
          ></img>
          <h1 className="text-3xl font-bold flex">Welcome to ScholarHub</h1>
        </div>

        {isLoggedin && (
          <nav className="flex items-center">
            <Link to="/dashboard" className="px-4">
              <FontAwesomeIcon icon={faChartBar} />
            </Link>
            <Link to="/notes" className="px-4">
              <FontAwesomeIcon icon={faBook} />
            </Link>

            <Link to="/results" className="px-4">
              Results
            </Link>
            <Link to="/edit-profile" className="px-4">
              <FontAwesomeIcon icon={faUserEdit} />
            </Link>

            <div className="mr-7 ml-4 text-extrabold">
            Welcome, {userName}
            </div>
              <button className="mr-3" onClick={handleSignOut}>
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
           
          </nav>
        )}
      </header>

      <main className="flex-grow mt-3">{children}</main>
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
    <p>  © 2024 ScholarHub. All rights reserved.</p>
  </div>
</footer>


    </div>
  );
};

export default Layout;
