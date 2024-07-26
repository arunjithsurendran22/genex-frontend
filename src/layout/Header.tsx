"use client";

import { FaBars, FaUserCircle, FaTimes } from "react-icons/fa";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useAuth } from "@context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      filter: "blur(10px)",
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return (
    <header className="bg-bgBlack shadow-2xl shadow-black border-gray-800 border text-white flex flex-col justify-center items-center w-full p-3 ">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/home">
          <h1>solspec</h1>
        </Link>

        <div className="relative flex items-center">
          <button onClick={toggleDropdown} className="text-xl">
            <FaUserCircle />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariants}
                className="absolute top-10  w-64 border-gray-800 bg-bgBlack shadow-md shadow-black rounded-md py-4 px-5 border"
              >
                <div className="flex justify-end">
                  <button
                    onClick={closeDropdown}
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="mt-10 flex flex-col items-center">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={buttonVariants}
                    className="block w-full text-left px-4 py-2 text-sm border-gray-800 bg-bgBlack shadow-md shadow-black rounded-full text-white hover:bg-cyanDark border cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex flex-1">
        {isSidebarOpen && <Sidebar onClose={toggleSidebar} />}
      </div>
    </header>
  );
};

export default Header;
