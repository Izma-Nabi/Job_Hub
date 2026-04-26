'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Jobs', href: '/jobs' },
    ...(user?.role === 'candidate' ? [{ label: 'Dashboard', href: '/dashboard/candidate' }] : []),
    ...(user?.role === 'company' ? [{ label: 'Dashboard', href: '/dashboard/company' }] : []),
    ...(user?.role === 'admin' ? [{ label: 'Admin', href: '/dashboard/admin' }] : []),
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.nav
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/20 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              JobHub
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <motion.div key={item.href} whileHover={{ y: -2 }}>
                <Link
                  href={item.href}
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}

            {user ? (
              <motion.div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {user.fullName || user.companyName || user.email}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
                >
                  <LogOut size={16} />
                  Logout
                </motion.button>
              </motion.div>
            ) : (
              <motion.div className="flex gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden bg-white border-b border-gray-200/20"
      >
        <div className="px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block text-gray-700 hover:text-indigo-600 font-medium"
            >
              {item.label}
            </Link>
          ))}
          {!user && (
            <>
              <Link href="/login" className="block text-indigo-600 font-medium">
                Login
              </Link>
              <Link href="/register" className="block text-indigo-600 font-medium">
                Sign Up
              </Link>
            </>
          )}
          {user && (
            <button
              onClick={handleLogout}
              className="w-full text-left text-red-600 font-medium"
            >
              Logout
            </button>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
}
