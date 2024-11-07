import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react'; //hooks
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
//all components
import Announcements from './components/Announcement';
import CourseContentPage from './components/CourseContentPage';
import Dashboard from './components/Dashboard';
import EditProfile from './components/EditProfile';
import Layout from './components/Layout';
import Layout2 from './components/Layout2';
import LinksPage from './components/LinksPage';
import Loading from './components/Loading';
import Login from './components/Login';
import Notes from './components/Notes';
import PYQS from './components/Pyqs';
import Results from './components/Results';
import SemesterDetails from './components/SemesterDetails';
import Signup from './components/Signup';
import StudyMaterials from './components/StudyMaterials';
import setAuthToken from './components/setAuthToken';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // New state for authentication


  useEffect(() => {
    const checkAuthentication = () => {
        //const token = localStorage.getItem('token');
           // Access the token from cookies
           console.log(document.cookie);
           console.log("hello")
           const token = document.cookie
           .split('; ')
           .find(row => row.startsWith('token='))
           ?.split('=')[1]; // Adjust 'token' if your cookie name is different
            
           if (!token) {
            setIsAuthenticated(false);
        } else {
            try {
                const decodedToken = jwtDecode(token); // Decode the token if you're using JWTs
                const currentTime = Date.now() / 1000; // Get current time in seconds
                if (decodedToken.exp < currentTime) {
                    setIsAuthenticated(false); // Token expired
                } else {
                    setAuthToken(token);
                    setIsAuthenticated(true); // Valid token
                }
            } catch (error) {
                console.error('Invalid token:', error);
                setIsAuthenticated(false); // Invalid token
            }
        }
    };

    // Simulate loading time
    const timeout = setTimeout(() => {
      
      checkAuthentication();
      // console.log("hello");
        setIsLoading(false); // Set loading to false after checking auth status
    }, 1000); // Simulate 1 second loading time

    return () => clearTimeout(timeout); // Clear the timeout on component unmount
}, []);

  
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

 
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div><Loading/></div>;
  }

  return (
   <>
    <Router>
      {isAuthenticated ? (
        <Layout>
          {/* <button onClick={handleLogout} className="absolute top-0 right-0 m-4 p-2 bg-blue-500 text-white rounded">Logout</button> */}
          
          {/* children jo ki pass hoga as a prop */}
          <Routes>
            <Route exact path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/results" element={<Results />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/courses/:course_name" element={<CourseContentPage />} />
            <Route path="/notes/:semesterId" element={<SemesterDetails />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            {/* 3 options in notes/id */}
            <Route path="/courses/study_materials/:course_name" element={<StudyMaterials />} />
            <Route path="/courses/pyqs/:course_name" element={<PYQS />} />
            <Route path="/courses/video_links/:course_name" element={<LinksPage />} />
          </Routes>
        </Layout>
      ) : (
        <Layout2>
        <Routes>
            <Route exact path="/" element={<Navigate to="/signup" />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/dashboard" element={<Navigate to="/login"/>} />
            <Route path="/notes" element={<Navigate to="/login"/>}/>
            <Route path="/results" element={<Navigate to="/login"/>}/>
            <Route path="/announcements" element={<Navigate to="/login"/>}/>
            <Route path="/courses/:course_name" element={<Navigate to="/login"/>}/>
            <Route path="/notes/:semesterId" element={<Navigate to="/login"/>}/>
            <Route path="/courses/study_materials/:course_name" element={<Navigate to="/login"/>}/>
            <Route path="/courses/pyqs/:course_name" element={<Navigate to="/login"/>}/>
            <Route path="/courses/video_links/:course_name" element={<Navigate to="/login"/>}/>
            <Route path="/edit-profile" element={<Navigate to="/login"/>}/>
        </Routes>
        </Layout2>
      )}
    </Router>
    {/* <Footer/> */}
   </>
  );
};

export default App;