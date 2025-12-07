import { Search, Menu, LogOut, Award, Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useContext } from "react";

import AdminAuthContext from "@/app/admin/context/AuthContext";

const DashboardHeader = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrollText, setScrollText] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const authContext = useContext(AdminAuthContext);

  useEffect(() => {
    setProfilePicture("/admin.jpg");
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollText((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!authContext) return null;
  const { logoutAdmin } = authContext;
  const scrollingTexts = [
    "Excellence in Digital Education",
    "Transforming Learning Through Technology",
    "Building Tomorrow's Leaders Today",
  ];

  return (
    <div className={`flex w-full flex-col ${darkMode ? "dark" : ""}`}>
      {/* Top announcement bar with scrolling text */}
      <div className="overflow-hidden bg-blue-600 px-4 py-2 text-white">
        <div className="flex items-center justify-center">
          <div className="mr-2 animate-pulse">
            <Award className="size-5" />
          </div>
          <div className="relative h-6 overflow-hidden">
            <div className="flex items-center">
              <p className="animate-marquee whitespace-nowrap text-sm font-medium">
                {scrollingTexts[scrollText]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Left side - Logo and Company Name */}
            <div className="flex items-center space-x-4">
              <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 lg:hidden">
                <Menu size={24} />
              </button>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-wider text-blue-600">
                  RAM LLC
                </span>
                <span className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  ACADEMY
                </span>
              </div>
            </div>

            {/* Center - Navigation */}
            <nav className="hidden items-center space-x-8 md:flex">
              <Link
                href="/admin"
                className="font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/edit-course"
                className="font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300"
              >
                Courses
              </Link>
              <Link
                href="#"
                className="font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300"
              >
                Resources
              </Link>
              <Link
                href="/admin/Community"
                className="font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300"
              >
                Community
              </Link>
            </nav>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-4">
              {/* Dark mode toggle */}
              {/* <button
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button> */}

              {/* Search input */}
              <div className="hidden items-center rounded-lg border border-gray-300 dark:border-gray-600 md:flex">
                <input
                  type="text"
                  className="px-3 py-2 text-sm dark:bg-gray-800 dark:text-gray-300"
                  placeholder="Search courses..."
                />
                <button className="p-2">
                  <Search size={18} />
                </button>
              </div>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center space-x-3 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="size-10 rounded-full">
                    <Image
                      src={profilePicture}
                      alt="profile"
                      className="rounded-full"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="hidden text-left md:block">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-300">
                      Admin User
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      admin@ramllc.com
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Profile
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Settings
                    </a>
                    <div className="border-t border-gray-100 dark:border-gray-700"></div>
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                      onClick={logoutAdmin}
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <nav className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 lg:hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="text-sm font-medium text-gray-600 dark:text-gray-300"
              >
                Dashboard
              </a>
              <a
                href="#"
                className="text-sm font-medium text-gray-600 dark:text-gray-300"
              >
                Courses
              </a>
              <a
                href="#"
                className="text-sm font-medium text-gray-600 dark:text-gray-300"
              >
                Resources
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default DashboardHeader;
