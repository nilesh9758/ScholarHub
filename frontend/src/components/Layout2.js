import { BookOpen, Home, LogOut, Menu, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleSignOut = async () => {
    try {
      // Perform sign-out logic here, such as sending a POST request to the sign-out endpoint
      await fetch('http://localhost:5000/signout', {
        method: 'POST',
        credentials: 'include', // Include credentials for CORS
      });
      // Redirect to the login page after sign-out
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isLoggedin = true;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl opacity-20 blur group-hover:opacity-30 transition-opacity duration-200"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  ScholarHub
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Knowledge Gateway</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {isLoggedin && (
                <>
                  {/* <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group">
                    <Home className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Home</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group">
                    <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Profile</span>
                  </button> */}
                  {/* <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group"
                  >
                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Sign Out</span>
                  </button> */}
                </>
              )}
              
              {!isLoggedin && (
                <div className="flex items-center space-x-4">
                  <button className="px-6 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                    Login
                  </button>
                  <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ${
          isMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 pointer-events-none'
        } overflow-hidden bg-white/95 backdrop-blur-md border-t border-gray-200`}>
          <div className="px-4 py-4 space-y-2">
            {isLoggedin && (
              <>
                <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 transition-colors duration-200 w-full text-left">
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </button>
                <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 transition-colors duration-200 w-full text-left">
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </>
            )}
            
            {!isLoggedin && (
              <div className="space-y-2">
                <button className="block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg font-medium transition-colors duration-200 w-full text-left">
                  Login
                </button>
                <button className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg text-center transform hover:scale-105 transition-all duration-200 w-full">
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 lg:pt-20 min-h-screen">
        <div className="relative">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>
          </div>
          
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative mt-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        <div className="relative pt-8 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Brand Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">ScholarHub</h3>
                    <p className="text-blue-200 text-sm">Knowledge Gateway</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Empowering scholars and students with cutting-edge tools for academic excellence and collaborative learning.
                </p>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Quick Links</h4>
                <div className="space-y-2">
                  <button className="block text-gray-300 hover:text-blue-300 transition-colors duration-200 text-sm">Home</button>
                  <button className="block text-gray-300 hover:text-blue-300 transition-colors duration-200 text-sm">About</button>
                  <button className="block text-gray-300 hover:text-blue-300 transition-colors duration-200 text-sm">Contact</button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Connect</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>Email: support@scholarhub.com</p>
                  <p>Phone: +1 (555) 123-4567</p>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700 pt-6">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-gray-400 text-sm">
                  © 2024 ScholarHub. All rights reserved.
                </p>
                <div className="flex space-x-6 text-sm">
                  <button className="text-gray-400 hover:text-blue-300 transition-colors duration-200">Privacy Policy</button>
                  <button className="text-gray-400 hover:text-blue-300 transition-colors duration-200">Terms of Service</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-300 rounded-full opacity-30 animate-ping" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-indigo-300 rounded-full opacity-40 animate-ping" style={{animationDelay: '3s'}}></div>
          <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-30 animate-ping" style={{animationDelay: '5s'}}></div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
