import React, { useState } from 'react';
import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";
import { Menu, X } from 'lucide-react';

export default function Navbar({ sticky }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { to: "home", label: "Home" },
    { to: "about", label: "About" }
  ];

  return (
    <nav className={`fixed w-full ${
      sticky 
        ? "bg-[#dee2e6] z-12 rounded-full mt-4 mx-2 w-[99%] justify-center p-1 shadow-lg" 
        : "bg-transparent"
    } z-20 transition-all duration-300`}>
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2">
            <img 
              src="./citylogo.png" 
              alt="Logo" 
              className="w-16 h-14 xs:w-20 xs:h-16 sm:w-24 sm:h-20" 
            />
            <h1 className={`text-xl xs:text-2xl font-semibold hover:text-[#343a40] cursor-pointer ${
              sticky ? "text-gray-800" : "hidden"
            }`}>
              City Synergy
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex justify-center items-center space-x-8">
            {navLinks.map((link) => (
              <ScrollLink
                key={link.to}
                to={link.to}
                smooth={true}
                duration={500}
                className={`font-semibold hover:text-[#343a40] cursor-pointer ${
                  sticky ? "text-gray-800" : "text-white"
                }`}
              >
                {link.label}
              </ScrollLink>
            ))}
            <Link 
              to="/login" 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </Link>
          </div>

          {/* Hamburger Menu Button */}
          <button 
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md"
          >
            {isOpen ? (
              <X className={`h-6 w-6 ${sticky ? "text-gray-800" : "text-white"}`} />
            ) : (
              <Menu className={`h-6 w-6 ${sticky ? "text-gray-800" : "text-white"}`} />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="lg:hidden absolute right-4 mt-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden w-48">
              <div className="py-2">
                {navLinks.map((link) => (
                  <ScrollLink
                    key={link.to}
                    to={link.to}
                    smooth={true}
                    duration={500}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </ScrollLink>
                ))}
                <Link
                  to="/login"
                  className="block mx-4 mt-2 text-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}