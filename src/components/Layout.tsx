"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
// import { usePathname } from "next/navigation"; // Import usePathname if needed for keying AnimatePresence

export default function Layout({ children }: { children: React.ReactNode }) {
  // const pathname = usePathname(); // Get current path if needed for AnimatePresence key

  return (
    <div className="flex min-h-screen flex-col dark:bg-gray-950">
      <Navbar />
      {/* AnimatePresence enables animations when components are added/removed */}
      {/* Use `mode='wait'` if you want the exiting page to finish animating before the new one enters */}
      {/* Keying AnimatePresence with pathname ensures transition triggers on route change */}
      <AnimatePresence mode="wait">
        <motion.main
          // key={pathname} // Use pathname as key if you want transitions between different routes
          initial={{ opacity: 0, y: 20 }} // Initial state (invisible and slightly down)
          animate={{ opacity: 1, y: 0 }} // Animate to (fully visible and at original position)
          exit={{ opacity: 0, y: -20 }} // Exit state (fade out and slightly up)
          transition={{ duration: 0.3 }} // Animation duration
          className="container mx-auto flex-grow px-4 py-8 sm:px-6 lg:px-8"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
} 