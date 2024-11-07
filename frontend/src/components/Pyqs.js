// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// const PYQS = () => {
//   const { course_name } = useParams();
//   const courseId = course_name;
//   const [courseName, setCourseName] = useState('');
//   const [studyMaterials, setStudyMaterials] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadedFileName, setUploadedFileName] = useState('');
//   const [userType, setUserType] = useState('');

//   const fetchCourseDetails = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/course/pyq?course=${courseId}`);
//       console.log(response);
//       setCourseName(`Course ${courseId}`);
//       setStudyMaterials(response.data);
//     } catch (error) {
//       console.error('Error fetching course details:', error);
//     }
//   };

//   useEffect(() => {
//     fetchCourseDetails();
//     fetchUserType();
//   }, [courseId]);

//   const fetchUserType = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/get_info');
//       setUserType(response.data.type);
//     } catch (error) {
//       console.error('Error fetching user type:', error);
//     }
//   };

//   const handleDownload = (fileName) => {
//     console.log(`Downloading file: ${fileName}`);
//     window.open(`http://localhost:5000/course/pyq/files?fileName=${fileName}`, '_blank');
//   };

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//     setUploadedFileName(event.target.files[0].name);
//   };

//   const handleUpload = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('file_pdf', selectedFile);
//       formData.append('userType', userType);
//       const response = await axios.post(`http://localhost:5000/course/pyq/upload_pyq?course=${courseId}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       console.log(response.data);
//       fetchCourseDetails();
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     }
//   };

//   const handleDelete = async (fileName) => {
//     if (window.confirm(`Are you sure you want to delete ${fileName}?`)) {
//       try {
//         await axios.delete('http://localhost:5000/course/pyq/delete', {
//           data: {
//             fileName: fileName,
//             course: courseId,
//             userType
//           }
//         });
//         fetchCourseDetails();
//       } catch (error) {
//         console.error('Error deleting file:', error);
//       }
//     }
//   };

//   return (
//     <div className="container mx-auto mt-8">
//       <div className="flex justify-between items-center mb-8 p-6">
//         <h1 className="text-3xl font-bold">{courseName}</h1>
//         {(userType === 'admin' || userType === 'teacher') && (
//           <div className="flex items-center space-x-4">
//             <input type="file" onChange={handleFileChange} className="hidden" id="fileInput" />
//             <label htmlFor="fileInput" className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105 cursor-pointer`}>Choose File</label>
//             <div>{uploadedFileName && <span className="text-sm">{uploadedFileName}</span>}</div>
//             <button className={`bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105`} onClick={handleUpload}>Upload PDF</button>
//           </div>
//         )}
//       </div>
//       <div className="grid grid-cols-1 gap-6">
//         <div>
//           <h2 className="text-2xl font-bold mb-4">PYQS</h2>
//           <div>
//             <ul className="p-4 bg-base-200 rounded-box w-full">
//               {studyMaterials.slice(1).map((material, index) => (
//                 <li key={index} className="study-card">
//                   <div className="flex justify-between items-center">
//                     <span className="study-name">{material}</span>
//                     <div>
//                       <button className="btn btn-download btn-sm bg-green-500 hover:bg-green-600 text-white font-bold mr-2 rounded-lg py-3 px-4" onClick={() => handleDownload(material)}>View</button>
//                       {userType === 'admin' && (
//                         <button className="btn btn-delete btn-sm bg-red-400 hover:bg-red-600 text-white font-bold rounded-lg py-3 px-4" onClick={() => handleDelete(material)}>Delete</button>
//                       )}
//                     </div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PYQS;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './StudyMaterials.css';

const PYQS = () => {
  const { course_name } = useParams();
  const courseId = course_name;

  const [courseName, setCourseName] = useState('');
  const [prqys, setPrqys] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [userType, setUserType] = useState('');

  useEffect(() => {
    fetchCourseDetails();
    fetchUserType();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/course/pyq?course=${courseId}`);
      setCourseName(`Course ${courseId}`);
      setPrqys(response.data);
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const fetchUserType = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get_info');
      setUserType(response.data.type);
    } catch (error) {
      console.error('Error fetching user type:', error);
    }
  };

  const handleDownload = (fileUrl) => {
    // Open the file in a new tab
    window.open(fileUrl, '_blank');
  };
  

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadedFileName(file.name);
    }
  };

  
  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file_pdf', selectedFile);
      formData.append('userType', userType); // Include userType in formData if it’s required by the server
  
      const response = await axios.post(`http://localhost:5000/course/pyq/upload_pdf?course=${courseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      fetchCourseDetails(); // Call function to fetch details after successful upload
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  

  const handleDelete = async (fileName) => {
    if (window.confirm(`Are you sure you want to delete ${fileName}?`)) {
      try {
        await axios.delete('http://localhost:5000/course/pyq/delete', {
          data: { fileName, course: courseId,userType},
        });
        fetchCourseDetails();
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="flex justify-between items-center mb-8 p-6">
        <h1 className="text-3xl font-bold">{courseName}</h1>

        {(userType === 'admin' || userType === 'teacher') && (
          <div className="flex items-center space-x-4">
            <input type="file" onChange={handleFileChange} className="hidden" id="fileInput" />
            <label
              htmlFor="fileInput"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105 cursor-pointer"
            >
              Choose File
            </label>
            <div>{uploadedFileName && <span className="text-sm">{uploadedFileName}</span>}</div>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
              onClick={handleUpload}
            >
              Upload PDF
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">PYQ's</h2>
          <div>
            {prqys.length > 0 ? (
              prqys.map((material, index) => (
                <div key={index} className="study-card">
                  <div className="flex justify-between items-center">
                    {/* <span className="study-name">{material}</span> */}
                    <span className="study-name">PYQ {index+1}</span>
                    <div>
                      <button
                        className="btn btn-download btn-sm bg-green-600 hover:bg-green-600 text-white font-bold mr-2 rounded-lg py-3 px-4"
                        onClick={() => handleDownload(material)}
                      >
                        View
                      </button>
                      {(userType === 'admin' || userType === 'teacher') && (
                        <button
                          className="btn btn-delete btn-sm bg-red-400 hover:bg-red-600 text-white font-bold rounded-lg py-3 px-4"
                          onClick={() => handleDelete(material)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h2>No files uploaded by the admin yet</h2>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PYQS
  ;

