import { faBook, faChartBar, faSignOutAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://scholarhub-zj03.onrender.com/get_info', {
          withCredentials: true,
        });
        if (response.status === 200) {
          const userData = response.data;
          setUserName(userData.name);
        } else {
          console.log('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      const response = await axios.post('https://scholarhub-zj03.onrender.com/signout', {}, {
        withCredentials: true,
      });

      if (response.status !== 200) {
        throw new Error('Failed to sign out. Please try again.');
      }

      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Error signing out: ' + (error.response?.data?.message || error.message));
    }
  };

  const isLoggedin = true;

  const navigationItems = [
    { path: '/dashboard', icon: faChartBar, label: 'Dashboard' },
    { path: '/notes', icon: faBook, label: 'Notes' },
    { path: '/results', icon: null, label: 'Results' },
    { path: '/edit-profile', icon: faUserEdit, label: 'Profile' },
  ];

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  className="w-10 h-10 rounded-full ring-2 ring-blue-500 ring-offset-2 object-cover"
                  alt="ScholarHub Logo"
                  src="https://imgs.search.brave.com/32pWfh2-hwyXyv2PFP3jL2_IF9JaqZExHuHFxAEJwTw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAxLzM4Lzg5LzM2/LzM2MF9GXzEzODg5/MzYzM19uUGFOaTFm/b1FKQjVEWVpjWG03/ZTJnS2FPbm42Y1Rq/Ry5qcGc"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ScholarHub
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Your Academic Dashboard</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            {isLoggedin && (
              <nav className="hidden md:flex items-center space-x-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 text-sm font-medium ${
                      isActiveRoute(item.path)
                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon && <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            )}

            {/* User Info and Actions */}
            {isLoggedin && (
              <div className="flex items-center space-x-4">
                {/* User Welcome */}
                <div className="hidden lg:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {isLoading ? (
                        <div className="animate-pulse bg-gray-300 h-4 w-20 rounded"></div>
                      ) : (
                        `Welcome, ${userName}`
                      )}
                    </p>
                    <p className="text-xs text-gray-500">Student</p>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  title="Sign Out"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          {isLoggedin && isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
              {/* Mobile User Info */}
              <div className="flex items-center space-x-3 px-4 py-2 mb-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {isLoading ? 'Loading...' : userName}
                  </p>
                  <p className="text-xs text-gray-500">Student</p>
                </div>
              </div>

              {/* Mobile Navigation Items */}
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActiveRoute(item.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.icon && <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />}
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative overflow-hidden">
        {/* Decorative Wave */}
        <div className="absolute top-0 left-0 w-full overflow-hidden">
          <svg
            className="relative block w-full h-12"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              fill="currentColor"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              fill="currentColor"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>

        {/* Footer Content */}
        <div className="relative pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Footer Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Brand Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    className="w-8 h-8 rounded-full"
                    alt="ScholarHub Logo"
                    src="https://imgs.search.brave.com/32pWfh2-hwyXyv2PFP3jL2_IF9JaqZExHuHFxAEJwTw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAxLzM4Lzg5LzM2/LzM2MF9GXzEzODg5/MzYzM19uUGFOaTFm/b1FKQjVEWVpjWG03/ZTJnS2FPbm42Y1Rq/Ry5qcGc"
                  />
                  <h3 className="text-lg font-bold">ScholarHub</h3>
                </div>
                <p className="text-blue-100 text-sm">
                  Empowering students with comprehensive academic management tools.
                </p>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Quick Links</h4>
                <ul className="space-y-2 text-blue-100">
                  <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                  <li><Link to="/notes" className="hover:text-white transition-colors">Notes</Link></li>
                  <li><Link to="/results" className="hover:text-white transition-colors">Results</Link></li>
                  <li><Link to="/edit-profile" className="hover:text-white transition-colors">Profile</Link></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Support</h4>
                <div className="text-blue-100 text-sm space-y-2">
                  <p>📧 support@scholarhub.com</p>
                  <p>📞 +1 (555) 123-4567</p>
                  <p>🕒 Mon-Fri, 9AM-6PM</p>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-blue-500 pt-6 flex flex-col md:flex-row justify-between items-center">
              <p className="text-blue-100 text-sm">
                © 2024 ScholarHub. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/privacy" className="text-blue-100 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-blue-100 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
