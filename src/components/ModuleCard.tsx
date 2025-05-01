"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface ModuleCardProps {
  title: string;
  description: string;
  imageUrl?: string; // Optional image
  link?: string; // Optional link to details/repo
  index: number; // For staggering animation
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1, // Stagger based on index
      duration: 0.3,
    },
  }),
};

export default function ModuleCard({
  title,
  description,
  imageUrl,
  link,
  index,
}: ModuleCardProps) {
  return (
    <motion.div
      className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-indigo-900/30"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      custom={index} // Pass index to variants
      whileHover={{ scale: 1.03, y: -5 }} // Hover effect
      transition={{ type: "spring", stiffness: 300, damping: 15 }} // Springy hover effect
    >
      {imageUrl && (
        <div className="relative h-40 w-full bg-gray-100 dark:bg-gray-700">
          {/* Placeholder or Image */}
          {/* Replace with actual Image component when URLs are available */}
          <div className="flex h-full items-center justify-center text-gray-400">
            Module Image
          </div>
          {/* <Image src={imageUrl} alt={title} layout="fill" objectFit="cover" /> */}
        </div>
      )}
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
        {link && (
          <Link
            href={link}
            className="text-sm font-medium text-accent-600 hover:text-accent-800 dark:text-accent-400 dark:hover:text-accent-300"
            target="_blank" // Assuming external links
            rel="noopener noreferrer"
          >
            Learn More &rarr;
          </Link>
        )}
      </div>
    </motion.div>
  );
} 