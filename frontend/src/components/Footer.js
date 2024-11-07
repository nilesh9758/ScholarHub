import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-gray-300 py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Logo */}
                    <div className="mb-4 md:mb-0">
                        <a href="#" className="text-white text-2xl font-bold">Universe</a>
                    </div>

                    {/* Links */}
                    <div className="flex space-x-4 mb-4 md:mb-0">
                        <a href="#" className="hover:text-white">Home</a>
                        <a href="#" className="hover:text-white">About</a>
                        <a href="#" className="hover:text-white">Services</a>
                        <a href="#" className="hover:text-white">Contact</a>
                    </div>

                    {/* Social Icons */}
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-white">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.476 2 2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.879v-7.014H8.08v-2.866h2.358V9.691c0-2.324 1.393-3.595 3.525-3.595 1.021 0 2.086.183 2.086.183v2.3h-1.175c-1.158 0-1.515.719-1.515 1.456v1.764h2.59l-.415 2.865h-2.175v7.014C18.343 21.128 22 16.991 22 12c0-5.522-4.478-10-10-10z" /></svg>
                        </a>
                        <a href="#" className="hover:text-white">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6.03c-.83.37-1.72.61-2.66.72a4.68 4.68 0 0 0 2.05-2.57c-.89.53-1.87.91-2.91 1.11a4.71 4.71 0 0 0-8.01 4.3A13.39 13.39 0 0 1 2.4 4.84a4.69 4.69 0 0 0 1.45 6.28c-.74-.02-1.45-.23-2.06-.57v.06c0 2.27 1.61 4.17 3.74 4.61a4.73 4.73 0 0 1-2.06.08c.58 1.8 2.27 3.11 4.26 3.14a9.45 9.45 0 0 1-5.85 2.02c-.38 0-.75-.02-1.13-.07A13.31 13.31 0 0 0 7.1 21c8.66 0 13.4-7.18 13.4-13.4 0-.2 0-.4-.01-.61a9.6 9.6 0 0 0 2.37-2.46z" /></svg>
                        </a>
                        <a href="#" className="hover:text-white">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.25 2.91 7.8 6.82 8.74v-6.18h-2.1v-2.56h2.1V9.5c0-2.1 1.26-3.25 3.15-3.25.91 0 1.86.17 1.86.17v2.06h-1.05c-1.05 0-1.37.65-1.37 1.32v1.57h2.33l-.38 2.56h-1.95V20.8C17.09 19.8 20 16.25 20 12c0-5.52-4.48-10-10-10z" /></svg>
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center mt-8 text-gray-500">
                    &copy; 2024 Universe. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
