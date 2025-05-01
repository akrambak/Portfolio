import ContactForm from "@/components/ContactForm";
import CalendlyButton from "@/components/CalendlyButton";
import { FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaGithub } from 'react-icons/fa'; // Import necessary icons
import Link from "next/link";

// Replace with actual links and details
const CALENDLY_URL = "https://calendly.com/your-link";
const CONTACT_EMAIL = "akram.bakhouche@example.com";
const LOCATION = "Somewhere, Earth";
const LINKEDIN_URL = "#"; // Replace with LinkedIn profile URL
const GITHUB_URL = "#"; // Replace with GitHub profile URL

export default function ContactPage() {
  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold tracking-tight">Contact Me</h1>
      <p className="mb-12 text-lg text-gray-600 dark:text-gray-400">
        Have a project in mind or just want to say hi? Fill out the form below or schedule a call.
      </p>

      <div className="grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-2">
        {/* Column 1: Contact Form */}
        <div>
          <h2 className="mb-6 text-2xl font-semibold">Send a Message</h2>
          <ContactForm />
        </div>

        {/* Column 2: Quick Info & Calendly */}
        <div className="space-y-10">
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Quick Info</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaEnvelope className="mt-1 h-5 w-5 flex-shrink-0 text-accent-600 dark:text-accent-400" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-gray-700 hover:text-accent-600 dark:text-gray-300 dark:hover:text-accent-400">
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 h-5 w-5 flex-shrink-0 text-accent-600 dark:text-accent-400" />
                <span className="text-gray-700 dark:text-gray-300">{LOCATION}</span>
              </div>
              {/* Social Links */}
               <div className="flex items-start gap-3">
                 <FaLinkedin className="mt-1 h-5 w-5 flex-shrink-0 text-accent-600 dark:text-accent-400" />
                 <Link href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-accent-600 dark:text-gray-300 dark:hover:text-accent-400">
                   LinkedIn Profile
                 </Link>
               </div>
               <div className="flex items-start gap-3">
                 <FaGithub className="mt-1 h-5 w-5 flex-shrink-0 text-accent-600 dark:text-accent-400" />
                 <Link href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-accent-600 dark:text-gray-300 dark:hover:text-accent-400">
                   GitHub Profile
                 </Link>
               </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-semibold">Schedule a Meeting</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Prefer to talk directly? Book a time that works for you:
            </p>
            <CalendlyButton url={CALENDLY_URL} />
          </div>
        </div>
      </div>
    </div>
  );
} 