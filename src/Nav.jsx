import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-600 dark:bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side - Logo and Title */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center">
            <img src="./src/assets/download.png" className="h-8" alt="Logo" />
          </Link>
          <Link className="text-xl text-black dark:text-white hidden md:block hover:text-blue-600 " to="https://gemini.google.com/" >Gemini AI</Link>
          <Link className="text-xl text-black dark:text-white hidden md:block hover:text-blue-600" to="https://chatgpt.com">Chat GPT </Link>
          <Link className="text-xl text-black dark:text-white hidden md:block hover:text-blue-600" to="https://grok.com/">Grok AI </Link>
          <Link to="/recent" className="text-xl text-black dark:text-white hidden md:block hover:text-blue-600">
            Recent
          </Link>
        </div>

        {/* Hamburger Menu Button for Mobile */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Right Side - Desktop Menu */}
        <div className="hidden md:flex items-center">
          <button className="bg-white text-blue-600 dark:bg-blue-600 dark:text-white px-4 py-2 rounded transition-all hover:bg-blue-200 dark:hover:bg-blue-700">
            Login
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="text-xl text-black dark:text-white">
              Gemini AI
            </Link>
            <Link to="/recent" className="text-xl text-black dark:text-white">
              Recent
            </Link>
            <button className="bg-white text-blue-600 dark:bg-blue-600 dark:text-white px-4 py-2 rounded transition-all hover:bg-blue-200 dark:hover:bg-blue-700 w-full text-left">
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;