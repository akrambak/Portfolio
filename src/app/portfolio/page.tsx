import ProjectCard from "@/components/ProjectCard";

// Placeholder data for portfolio projects
const projects = [
  {
    title: "E-commerce Platform",
    tagline: "Complete online store built with PrestaShop, custom theme & modules.",
    techStack: ["PrestaShop", "PHP", "MySQL", "jQuery", "Bootstrap"],
    link: "#",
    imageUrl: "/placeholder-project-1.png", // Optional image
  },
  {
    title: "Flutter Mobile App",
    tagline: "Cross-platform app for booking services, integrated with Firebase.",
    techStack: ["Flutter", "Dart", "Firebase Auth", "Firestore", "Bloc"],
    link: "#",
    imageUrl: "/placeholder-project-2.png",
  },
  {
    title: "Vue.js Admin Dashboard",
    tagline: "Data visualization and management interface for a SaaS product.",
    techStack: ["Vue.js", "Vuex", "Tailwind CSS", "Chart.js", "Laravel API"],
    // link: "#", // No link example
    imageUrl: "/placeholder-project-3.png",
  },
  {
    title: "Laravel API Service",
    tagline: "Backend REST API powering multiple client applications.",
    techStack: ["Laravel", "PHP", "MySQL", "Redis", "PHPUnit"],
    link: "#",
    imageUrl: "/placeholder-project-4.png", // Added placeholder
  },
    {
    title: "Static Marketing Site",
    tagline: "Fast, responsive landing pages built with Next.js.",
    techStack: ["Next.js", "React", "Tailwind CSS", "Static Export"],
    link: "#",
    imageUrl: "/placeholder-project-5.png", // Added placeholder
  },
    {
    title: "PrestaShop Module: QuickView",
    tagline: "Adds quick product view functionality to category pages.",
    techStack: ["PrestaShop", "PHP", "jQuery", "Smarty"],
    link: "#",
    imageUrl: "/placeholder-project-6.png", // Added placeholder
  },
];

// Optional: Helper function to create placeholder images if needed (similar to themes)
// For demonstration, let's add it here too.
async function createPlaceholderProjectImages() {
  // Avoid running this on the server in production
  if (typeof window !== 'undefined') return;

  try {
    const fs = require('fs').promises;
    const path = require('path');
    const publicDir = path.resolve(process.cwd(), 'public');
    await fs.mkdir(publicDir, { recursive: true }); // Ensure public directory exists

    for (const project of projects) {
      if (!project.imageUrl) continue;
      const imgPath = path.join(publicDir, project.imageUrl);
      try {
        await fs.access(imgPath);
      } catch {
        // File doesn't exist, create a dummy SVG
        console.log(`Creating placeholder project image: ${imgPath}`);
        const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="#eee"/><text x="50%" y="50%" font-family="sans-serif" font-size="18" fill="#aaa" dy=".3em" text-anchor="middle">Placeholder 400x300</text></svg>';
        await fs.writeFile(imgPath, svgContent, 'utf-8');
      }
    }
  } catch (error) {
      console.error("Error creating placeholder images:", error);
      // Fail silently in production or non-Node.js environments
  }
}

export default async function PortfolioPage() {
  // Create placeholders if running locally (optional, for demonstration)
  if (process.env.NODE_ENV === 'development') {
    await createPlaceholderProjectImages();
  }

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold tracking-tight">Portfolio</h1>
      <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
        A selection of projects showcasing my skills in web and mobile development.
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.title} // Use a unique key
            title={project.title}
            tagline={project.tagline}
            techStack={project.techStack}
            link={project.link}
            imageUrl={project.imageUrl} // Pass image URL
            index={index} // Pass index for staggered animation
          />
        ))}
      </div>
    </div>
  );
} 