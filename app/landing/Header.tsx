"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  FaTelegramPlane,
  FaLifeRing,
  FaGlobe,
  FaUser,
  FaBars,
  FaTimes,
  FaCode,
} from "react-icons/fa";
import { motion } from "framer-motion";

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <Link
    href={href}
    className="text-gray-300 hover:text-white transition-colors duration-200 px-3 py-2 text-sm font-medium"
  >
    {children}
  </Link>
);

const SupportDropdown: React.FC = () => {
  return (
    <div className="relative group">
      <button className="text-gray-300 hover:text-white transition-colors duration-200 px-3 py-2 text-sm font-medium flex items-center">
        <span>پشتیبانی</span>
        <svg
          className="w-4 h-4 mr-1 transform group-hover:rotate-180 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      <div className="absolute right-0 mt-2 w-80 bg-[#1e293b] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-6 z-50 text-right">
        <ul className="space-y-6">
          <li className="flex items-start space-x-4 space-x-reverse">
            <FaLifeRing className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-white">پشتیبانی در Options iran</h3>
              <p className="text-gray-400 text-sm mt-1">
                ما همیشه اینجا هستیم تا به شما کمک کنیم. تمام کانال‌های پشتیبانی
                مختلف ما را بررسی کنید.
              </p>
            </div>
          </li>

          <li className="flex items-start space-x-4 space-x-reverse">
            <FaCode className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-white">مستندات API</h3>
              <p className="text-gray-400 text-sm mt-1">
                هر آنچه را که باید در مورد API ما بدانید، بیابید.
                <NavLink href="/modalTrading">Modal Trding </NavLink>
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

const Header: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = (
    <>
      <NavLink href="/options"> آپشن </NavLink>
      <NavLink href="/landing/support">آموزش</NavLink>
      <NavLink href="/landing/about">درباره ما</NavLink>
      <NavLink href="/landing/contact"> تماس با ما</NavLink>
      <SupportDropdown />
    </>
  );

  return (
    <header className="py-4 bg-[#0a1125]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center">
          {/* لوگو */}
          <div className="flex items-center space-x-8 space-x-reverse">
            <Link href="/" className="text-2xl font-bold text-white">
              Options
            </Link>
            <nav className="hidden md:flex items-center">{navItems}</nav>
          </div>

          {/* دکمه‌ها */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            {/* <Link
              href="#"
              className="text-white hover:text-gray-300 border border-gray-600 rounded-md px-4 py-2 text-sm font-semibold transition-all duration-200"
            >
              ورود
            </Link> */}
            <Link
              href="/auth"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm font-semibold transition-all duration-200"
            >
              ورود / ثبت نام
            </Link>
            <button className="text-gray-400 hover:text-white">
              <FaUser className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-white">
              <FaGlobe className="w-5 h-5" />
            </button>
          </div>

          {/* منو موبایل */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <FaTimes className="w-6 h-6 text-white" />
              ) : (
                <FaBars className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* منوی موبایل */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-4 bg-[#0a1125] p-4 border-t border-gray-700"
        >
          <nav className="flex flex-col space-y-4">
            {navItems}
            <div className="pt-4 border-t border-gray-700 flex flex-col space-y-3">
              <Link
                href="#"
                className="text-white hover:text-gray-300 border border-gray-600 rounded-md px-4 py-2 text-sm font-semibold text-center transition-all duration-200"
              >
                ورود
              </Link>
              <Link
                href="#"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm font-semibold text-center transition-all duration-200"
              >
                ایجاد حساب کاربری
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
