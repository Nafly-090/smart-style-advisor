import React from 'react';

const Nav = () => {
    return (
        <div className="bg-blue-600 dark:bg-gray-900 text-white p-4   flex justify-between items-center">
            {/* Left Side - Logo and Title */}
            <div className="flex items-center space-x-4 mx-4">
                <a href="#" className="flex items-center">
                    <img src="./src/assets/download.png" className="h-8" alt="Logo" />
                </a>
                <div className="text-xl text-black dark:text-white">Gemini AI</div>
                <div className="text-xl text-black dark:text-white">Recent </div>
            </div>

            {/* Right Side - Login Button */}
            <div>
                <button className="bg-white text-blue-600 dark:bg-blue-600 dark:text-white mr-4 px-4 py-2 rounded transition-all hover:bg-blue-200 dark:hover:bg-blue-700">
                    Login
                </button>
            </div>
        </div>
    );
};

export default Nav;
