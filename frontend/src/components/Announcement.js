import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    body: '',
    date: new Date().toISOString().split('T')[0] // Initialize date with today's date
  });
  const [userType, setUserType] = useState('');

  useEffect(() => {
    fetchAnnouncements();
    fetchUserInfo();
  }, []); // Fetch announcements and user info on component mount

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:5000/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get_info');
      setUserType(response.data.type);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };
 
  const handleInputChange = (e) => {
    setNewAnnouncement({ ...newAnnouncement, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/announcements', {newAnnouncement,userType});
      setShowAddDialog(false);
      //reset
      setNewAnnouncement({
        title: '',
        body: '',
        date: new Date().toISOString().split('T')[0] // Reset date to today's date
      });
      fetchAnnouncements(); // Refresh announcements after adding a new one
    } catch (error) {
      console.error('Error adding announcement:', error);
    }
  };
  
  if(!announcements)
    return <h1>no announcements</h1>

  //display part
  return (
    <div className="min-h-screen bg-blue-100">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-blue-800">Announcements</h2>
          </div>
          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <div key={index} className="bg-white shadow-md rounded-md overflow-hidden">
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900">{announcement.title}</h3>
                  <p className="text-gray-600">{announcement.body}</p>
                  <p className="text-gray-500">Date: {new Date(announcement.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => window.history.back()} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 mr-3 px-4 rounded-md">Go Back</button>
          {/* condition */}
          {(userType === 'admin' || userType === 'teacher') && (
            <button
              onClick={() => setShowAddDialog(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold"
            >
              Add Announcement
            </button>
          )}
        </div>
      </div>
      {showAddDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Add Announcement</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newAnnouncement.title}
                  onChange={handleInputChange}
                  className="input-field border-4 w-full border-solid rounded-md border-blue-300"
                  required //important field
                />
              </div>
              <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700">Body</label>
                <textarea
                  id="body"
                  name="body"
                  value={newAnnouncement.body}
                  onChange={handleInputChange}
                  className="input-field h-32 w-full border-4 border-solid rounded-md border-blue-300"
                  required
                ></textarea>
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={newAnnouncement.date}
                  onChange={handleInputChange}
                  className="input-field bg-white border-2 border-solid rounded-md border-blue-300"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary w-20 bg-blue-400 rounded-sm p-2 mr-3">Submit</button>
                <button onClick={() => setShowAddDialog(false)} className="btn btn-primary w-20 bg-red-400 rounded-sm p-2">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
