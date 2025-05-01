"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

// Placeholder data - replace with actual content
const profile = {
  name: "Akram Bakhouche",
  tagline: "Fullstack Flutter mobile PHP Laravel PrestaShop Developer",
  summary: "Passionate web and mobile developer with 8 years of experience building full-stack applications. Expert in PrestaShop/PHP, with strong skills in Vue, Flutter, Dart, and Firebase.",
  skills: [
    "Fullstack Development (end-to-end projects)",
    "Backend (PHP/Laravel/CodeIgniter) & API development",
    "Frontend (HTML5, CSS3/SASS, JavaScript/jQuery)",
    "E-commerce (PrestaShop site creation)",
    "Mobile & Web Apps (Flutter, Vue, Firebase)",
    "Prestashop Module Development (v1.6 & 1.7)",
  ],
  highlights: [
    { label: "Bilingual", value: "FR / EN" },
    { label: "Project Management", value: "A to Z project management, open to challenges, critical feedback and maintenance" },
  ],
  testimonials: [
    { quote: "Prestation rapide et efficace, aucun problème.", author: "Client A" },
    { quote: "Un plaisir de travailler avec Akram… Je le recommande vivement.", author: "Client B" },
    // Add more testimonials if needed
  ],
  cta: "🚀 Contact me to discuss your project!",
  // Add social links from Footer or specific ones
};

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// Renamed component to HomePage
export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Cycle through testimonials automatically
  useEffect(() => {
    if (profile.testimonials.length <= 1) return; // Don't cycle if only one testimonial
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % profile.testimonials.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, []); // Rerun if testimonials change (though they are static here)


  return (
    <div className="space-y-12 md:space-y-16 lg:space-y-20">
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-8 md:flex-row">
        <motion.div
          className="w-full flex-1 md:w-1/2"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          <motion.h1 variants={fadeIn} className="mb-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Hello, I'm <span className="text-accent-600 dark:text-accent-400">{profile.name}</span>
          </motion.h1>
          <motion.p variants={fadeIn} className="text-xl text-gray-600 dark:text-gray-400">
            {profile.tagline}
          </motion.p>
        </motion.div>
        <motion.div
          className="w-full flex-shrink-0 md:w-1/3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {/* Placeholder for Profile Image */}
          <div className="aspect-square w-full max-w-xs mx-auto overflow-hidden rounded-full bg-gradient-to-br from-teal-100 via-cyan-100 to-sky-100 shadow-lg dark:from-teal-800 dark:via-cyan-800 dark:to-sky-800">
             {/* Replace with <Image /> component once image is available */}
            <div className="flex h-full w-full items-center justify-center text-gray-500 dark:text-gray-400">Image Placeholder</div>
             {/* Example: <Image src="/akram.png" alt={profile.name} width={400} height={400} className="object-cover" /> */}
          </div>
        </motion.div>
      </section>

      {/* Profile Summary */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4 text-3xl font-semibold">About Me</h2>
        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          {profile.summary}
        </p>
      </motion.section>

      {/* Skills List */}
      <motion.section
         initial={{ opacity: 0 }}
         whileInView={{ opacity: 1 }}
         viewport={{ once: true, amount: 0.3 }}
         transition={{ duration: 0.5 }}
      >
        <h2 className="mb-6 text-3xl font-semibold">Skills & Expertise</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profile.skills.map((skill, index) => (
            <motion.li
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-lg dark:hover:shadow-accent-900/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {/* TODO: Add icons here if desired */}
              <span className="font-medium text-gray-800 dark:text-gray-200">{skill}</span>
            </motion.li>
          ))}
        </ul>
      </motion.section>

      {/* Additional Highlights */}
      <motion.section
         initial={{ opacity: 0 }}
         whileInView={{ opacity: 1 }}
         viewport={{ once: true, amount: 0.5 }}
         transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4 text-3xl font-semibold">More About Me</h2>
        <div className="space-y-4">
          {profile.highlights.map((highlight, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="inline-block rounded bg-accent-100 px-2 py-0.5 text-sm font-medium text-accent-800 dark:bg-accent-900 dark:text-accent-200">{highlight.label}</span>
              <span className="text-gray-600 dark:text-gray-400">{highlight.value}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials Carousel */}
      {profile.testimonials && profile.testimonials.length > 0 && (
          <motion.section
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true, amount: 0.3 }}
             transition={{ duration: 0.5 }}
             className="overflow-hidden"
          >
            <h2 className="mb-6 text-center text-3xl font-semibold">What Clients Say</h2>
            <div className="relative mx-auto max-w-2xl" style={{ minHeight: '160px' }}> {/* Adjust min height as needed */}
               <AnimatePresence initial={false} mode="wait">
                  <motion.blockquote
                    key={currentTestimonial}
                    className="absolute inset-x-0 top-0 rounded-lg border-l-4 border-accent-500 bg-gray-50 p-6 italic text-gray-700 shadow-md dark:border-accent-400 dark:bg-gray-800 dark:text-gray-300 text-center"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="mb-3 text-lg">
                      "{profile.testimonials[currentTestimonial].quote}"
                    </p>
                    <footer className="text-base font-medium text-gray-800 dark:text-gray-200">
                      - {profile.testimonials[currentTestimonial].author}
                    </footer>
                  </motion.blockquote>
              </AnimatePresence>
            </div>
             {/* Dots for navigation */}
             <div className="mt-6 flex justify-center space-x-2">
               {profile.testimonials.map((_, index) => (
                 <button
                   key={index}
                   onClick={() => setCurrentTestimonial(index)}
                   className={`h-2.5 w-2.5 rounded-full transition-colors ${currentTestimonial === index ? 'bg-accent-500' : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'}`}
                   aria-label={`Go to testimonial ${index + 1}`}
                 />
               ))}
             </div>
          </motion.section>
       )}

      {/* Call to Action */}
      <motion.section
        className="text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/contact"
          className="mb-6 inline-block rounded-md bg-accent-600 px-6 py-3 text-lg font-medium text-white shadow-md transition hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 dark:bg-accent-500 dark:hover:bg-accent-600 dark:focus:ring-offset-gray-950"
        >
          {profile.cta}
        </Link>
        {/* TODO: Add social icons here, potentially reusing Footer's SocialLink */}
        <div className="mt-4 flex justify-center space-x-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">Social Links Placeholder</span>
        </div>
      </motion.section>
    </div>
  );
}
