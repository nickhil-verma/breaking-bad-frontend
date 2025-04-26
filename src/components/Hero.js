import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import BG from '../images/bg.png';
import { GoArrowRight } from "react-icons/go";
import BAND from "../images/band.png";

const Hero = () => {
  const controls = useAnimation();
  const [triggerRef, inView] = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start('scrolled');
    } else {
      controls.start('visible');
    }
  }, [inView, controls]);

  const imageVariants = {
    visible: {
      scale: 1,
      x: 0,
      opacity: 1,
      transition: { duration: 1, ease: 'easeInOut' },
    },
    scrolled: {
      scale: 0.6,
      x: '-40%',
      opacity: 0.4,
      transition: { duration: 1, ease: 'easeInOut' },
    },
  };

  const textVariants = {
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 1 },
    },
    scrolled: {
      x: '-20%',
      opacity: 1,
      transition: { duration: 1 },
    },
  };

  return (
    <>
      <div className="relative w-full min-h-screen overflow-hidden">
        {/* Background image with zoom animation */}
        <motion.div
          className="fixed inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${BG})`,
            filter: 'grayscale(100%)',
            opacity: 0.3,
            zIndex: 0,
          }}
          animate={{ scale: [1, 2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Foreground content */}
        <div className="relative z-10 flex max-sm:mt-14 flex-col lg:flex-row items-center justify-center lg:justify-between min-h-screen px-6 sm:px-8 md:px-12 lg:px-16 text-white font-poppins">
          {/* Left: Watch Image */}
          <motion.div
            className="w-full lg:w-1/2 flex justify-center mb-8 lg:mb-0"
            variants={imageVariants}
            animate={controls}
          >
            <img
              src={BAND}
              alt="Band"
              className="w-[70%] sm:w-[60%] md:w-[50%] lg:w-[60%] h-auto rounded-xl shadow-xl"
            />
          </motion.div>

          {/* Right: Text */}
          <motion.div
            className="w-full lg:w-1/2 px-2 sm:px-4 md:px-6 lg:px-8 text-center lg:text-left"
            variants={textVariants}
            animate={controls}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              No more carelessness
            </h1>
            <p className="text-base sm:text-lg text-gray-200 mb-4">
              We have something for your loved ones/patient.
            </p>
            <p className="text-sm sm:text-md text-gray-300">
              Our smart fitness band is designed for continuous health tracking, ensuring early detection of critical changes in oxygen, ECG, heart rate, and temperature. 
              Whether at home or on the move, receive real-time alerts directly to your device — so you never miss a warning sign.
            </p>
            <div className="flex justify-center lg:justify-start">
              <button className="text-sm sm:text-base mt-6 border-[0.5px] text-white flex items-center justify-center hover:text-black duration-100 hover:bg-gray-100 px-4 py-2 rounded-3xl w-44">
                ✨ Order Now
                <span className="ml-2">
                  <GoArrowRight />
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Invisible trigger element below Hero */}
      <div ref={triggerRef} className="h-[100px]" />
    </>
  );
};

export default Hero;
