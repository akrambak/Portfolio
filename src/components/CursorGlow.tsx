"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CursorGlow() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[9999] transition duration-300"
      style={{
        background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(236, 72, 153, 0.15), transparent 80%)`, // Using pink-500 with opacity
      }}
      // Note: Framer Motion applies transform directly, we don't need to offset style here
      // Instead, we can animate the x/y props if needed, but the background positioning handles the follow
      // animate={{ 
      //   x: mousePosition.x - 300, // Center the gradient visually if needed
      //   y: mousePosition.y - 300, 
      // }}
      // transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }} // Faster, slightly springy follow
    />
  );
} 