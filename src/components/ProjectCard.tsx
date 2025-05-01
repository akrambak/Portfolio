"use client";

import React from 'react';
// import Image from "next/image"; // Removed unused import
import Link from "next/link";
import { motion } from "framer-motion";
import { FaCode } from "react-icons/fa";

// Import only the necessary icons used in getTechIcon
import {
  FaReact, FaVuejs, FaPhp, FaLaravel, FaBootstrap, FaJsSquare, FaCss3Alt, FaHtml5, FaDatabase, FaGitAlt
} from 'react-icons/fa';

import {
  SiNextdotjs, SiTailwindcss, SiFlutter, SiDart, SiMysql, SiRedis, SiPrestashop, SiCodeigniter, SiJquery, SiFirebase, SiDocker
} from 'react-icons/si';

import { TbBrandCSharp } from "react-icons/tb";

// Map tech names (lowercase) to icons
const techIconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  react: FaReact,
  'next.js': SiNextdotjs,
  vue: FaVuejs,
  'vue.js': FaVuejs,
  php: FaPhp,
  laravel: FaLaravel,
  prestashop: SiPrestashop,
  flutter: SiFlutter,
  dart: SiDart,
  firebase: SiFirebase,
  bootstrap: FaBootstrap,
  tailwindcss: SiTailwindcss,
  javascript: FaJsSquare,
  css: FaCss3Alt,
  html: FaHtml5,
  mysql: SiMysql,
  database: FaDatabase,
  redis: SiRedis,
  codeigniter: SiCodeigniter,
  jquery: SiJquery,
  git: FaGitAlt,
  docker: SiDocker,
  csharp: TbBrandCSharp,
  'c#': TbBrandCSharp,
  // Add more mappings as needed
};

const TechIcon = ({ label }: { label: string }) => {
  const IconComponent = techIconMap[label.toLowerCase()];
  return (
    <span
      title={label} // Add tooltip for the tech name
      className="inline-flex items-center gap-1 rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
    >
      {IconComponent ? <IconComponent /> : <FaCode />} {/* Use FaCode, not FaCodeIcon */}
      {/* Optionally display label text as well or instead of tooltip */}
      {/* {label} */}
    </span>
  );
};

interface ProjectCardProps {
  title: string;
  tagline: string;
  imageUrl?: string; // Optional image/icon
  techStack: string[];
  link?: string; // Optional link to case study/live site
  index: number;
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
};

export default function ProjectCard({
  title,
  tagline,
  imageUrl,
  techStack,
  link,
  index,
}: ProjectCardProps) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      custom={index}
      // Slight lift on hover
      whileHover={{ y: -5, boxShadow: "0 8px 12px -3px rgba(0, 0, 0, 0.1), 0 3px 5px -2px rgba(0, 0, 0, 0.05)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Optional Image Area */}
      {imageUrl && (
        <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-700">
          {/* Replace with actual Image component */}
          <div className="flex h-full items-center justify-center text-gray-400">
             Project Image
          </div>
          {/* <Image src={imageUrl} alt={title} layout="fill" objectFit="cover" /> */}
        </div>
      )}

      {/* Content Area */}
      <div className="p-4">
        <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          {tagline}
        </p>
      </div>

      {/* Hover Overlay with Tech Stack & Link */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/50 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        <div className="mb-2 flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <TechIcon key={tech} label={tech} />
          ))}
        </div>
        {link && (
          <Link
            href={link}
            className="mt-auto text-sm font-medium text-accent-300 hover:text-accent-100"
            target="_blank" // Assuming external links
            rel="noopener noreferrer"
          >
            Learn More &rarr;
          </Link>
        )}
      </motion.div>

      {/* Optional: If no hover overlay is desired, show tech stack and link directly */}
      {/* <div className="px-4 pb-4 pt-0">
        <div className="mb-2 flex flex-wrap gap-1">
          {techStack.map((tech) => (
            <TechIcon key={tech} label={tech} />
          ))}
        </div>
        {link && (
          <Link href={link} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
            Learn More &rarr;
          </Link>
        )}
      </div> */}
    </motion.div>
  );
} 