"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CursorGlow from "./CursorGlow";
import { usePathname } from "next/navigation"; // Ensure pathname is imported

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get current path for AnimatePresence key

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <CursorGlow />
      <Navbar />
      {/* AnimatePresence enables animations when components are added/removed */}
      {/* key={pathname} ensures animation triggers on route change */}
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname} // Use pathname as key for route transitions
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-grow container mx-auto px-4 py-8" // Added padding and container
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
