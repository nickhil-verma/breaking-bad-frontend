import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      className="bg-gray-100 bg-opacity-65 text-gray-800 py-10 px-6 mt-16"
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left - Text */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-semibold">© {new Date().getFullYear()} All rights reserved.</h2>
          <p className="text-sm text-gray-600">Built with ❤️ for those who care.</p>
        </div>

        {/* Right - Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 text-white px-6 py-2 rounded-full shadow hover:bg-blue-700 transition"
        >
          Book Now
        </motion.button>
      </div>
    </motion.footer>
  );
};

export default Footer;
