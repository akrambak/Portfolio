import ThemeCard from "@/components/ThemeCard";

// Placeholder data for themes
const themes = [
  {
    title: "Minimalist Clean Theme",
    description: "A sleek, modern theme focusing on typography and whitespace. Built with Bootstrap.",
    imageUrl: "/placeholder-theme-1.png", // Replace with actual image path
    demoLink: "#",
  },
  {
    title: "Vibrant Product Showcase",
    description: "Colorful theme designed to highlight product visuals. Fully responsive.",
    imageUrl: "/placeholder-theme-2.png", // Replace with actual image path
    demoLink: "#",
  },
  {
    title: "Elegant Fashion Store",
    description: "Sophisticated design suitable for apparel and luxury brands.",
    imageUrl: "/placeholder-theme-3.png", // Replace with actual image path
    demoLink: "#",
  },
  {
    title: "Tech Gadget Hub",
    description: "Dark mode theme tailored for electronics and gadget stores.",
    imageUrl: "/placeholder-theme-4.png", // Replace with actual image path
    demoLink: "#",
  },
];

// Helper function to create placeholder image files if they don't exist
// In a real scenario, these images would be provided.
async function createPlaceholderImages() {
  const fs = require('fs').promises;
  const path = require('path');
  const publicDir = path.resolve(process.cwd(), 'public');

  for (const theme of themes) {
    const imgPath = path.join(publicDir, theme.imageUrl);
    try {
      await fs.access(imgPath);
    } catch {
      // File doesn't exist, create a dummy one
      console.log(`Creating placeholder image: ${imgPath}`);
      await fs.writeFile(imgPath, '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="100%" height="100%" fill="#ddd"/><text x="50%" y="50%" font-family="sans-serif" font-size="20" fill="#555" dy=".3em" text-anchor="middle">Placeholder 640x360</text></svg>', 'utf-8');
    }
  }
}

export default async function ThemesPage() {
  // Create placeholders if running locally (optional, for demonstration)
  if (process.env.NODE_ENV === 'development') {
    await createPlaceholderImages();
  }

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold tracking-tight">PrestaShop Themes</h1>
      <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
        Explore custom PrestaShop themes designed for various e-commerce niches.
      </p>
      {/* Responsive grid, fewer columns on larger screens */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {themes.map((theme, index) => (
          <ThemeCard
            key={theme.title} // Use a unique key
            title={theme.title}
            description={theme.description}
            imageUrl={theme.imageUrl}
            demoLink={theme.demoLink}
            index={index} // Pass index for staggered animation
          />
        ))}
      </div>
    </div>
  );
} 