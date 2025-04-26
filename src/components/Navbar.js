import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "../images/logo.png";
import { Link } from 'react-router-dom';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full fixed top-4 left-1/2 -translate-x-1/2 z-50 font-poppins">
      <div className="mx-auto max-w-5xl rounded-full px-6 py-3 bg-white/10 backdrop-blur-md shadow-lg flex justify-between items-center border border-white/20 text-white transition-all duration-300">
        {/* Brand */}
        <img src={Logo} className="h-10"></img>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 text-gray-300 font-medium">
          <a href="#about" className="hover:text-white transition">
            About Us
          </a>
          <a href="#how" className="hover:text-white transition">
            How it Works
          </a>
          <a href="/login" className="hover:text-white transition">
            Login
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-5xl bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 px-6 py-4 text-gray-300 space-y-3 transition-all duration-300">
          <a href="#about" className="block hover:text-white">
            About Us
          </a>
          <a href="#how" className="block hover:text-white">
            How it Works
          </a>
          <Link to="/login" className="text-white hover:text-gray-300">
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
