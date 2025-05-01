"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface ThemeCardProps {
  title: string;
  description: string;
  imageUrl: string; // Assuming themes always have an image
  demoLink: string;
  index: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
    },
  }),
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function ThemeCard({
  title,
  description,
  imageUrl,
  demoLink,
  index,
}: ThemeCardProps) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      custom={index}
      // Adding a subtle lift and shadow increase on hover for the whole card
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="relative aspect-video w-full bg-gray-100 dark:bg-gray-700">
        {/* Placeholder or Image - Using aspect-video for theme previews */}
        <Image src={imageUrl} alt={title} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
        {/* Hover Overlay for action button */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 group-hover:opacity-100 opacity-0"
          variants={overlayVariants}
          initial="hidden"
          whileHover="visible" // Show overlay content on hover
        >
          <Link
            href={demoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-accent-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Live Demo
          </Link>
        </motion.div>
      </div>
      <div className="p-4">
        <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </motion.div>
  );
} 