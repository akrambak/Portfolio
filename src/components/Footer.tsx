import Link from "next/link";
import { FaLinkedin, FaGithub } from "react-icons/fa"; // Import icons

// Replace with actual profile URLs
const LINKEDIN_URL = "#";
const GITHUB_URL = "#";

const SocialLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }) => (
  <Link href={href} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-accent-600 dark:text-gray-400 dark:hover:text-accent-400 transition-colors">
    <span className="sr-only">{label}</span>
    <Icon className="h-6 w-6" />
  </Link>
);

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 sm:text-left">
            &copy; {new Date().getFullYear()} Akram Bakhouche. All rights reserved.
          </div>
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-start">
            <SocialLink href={LINKEDIN_URL} label="LinkedIn" icon={FaLinkedin} />
            <SocialLink href={GITHUB_URL} label="GitHub" icon={FaGithub} />
            {/* Add other social links as needed */}
          </div>
        </div>
      </div>
    </footer>
  );
} 