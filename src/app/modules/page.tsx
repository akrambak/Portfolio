import ModuleCard from "@/components/ModuleCard";

// Placeholder data for modules
const modules = [
  {
    title: "Inventory Manager",
    description: "A custom Prestashop module for bulk product updates and stock management.",
    link: "#", // Replace with actual link
  },
  {
    title: "Advanced SEO Suite",
    description: "Optimize your store's visibility with automated meta tags and sitemaps.",
    link: "#",
  },
  {
    title: "Custom Payment Gateway",
    description: "Integration for XYZ payment provider, supporting multiple currencies.",
    link: "#",
  },
  {
    title: "One-Page Checkout",
    description: "Streamline the checkout process to improve conversion rates.",
    link: "#",
  },
  {
    title: "Affiliate Program Manager",
    description: "Manage affiliates, track referrals, and automate commission payouts.",
  },
  {
    title: "Blog Integration",
    description: "Add a fully featured blog section to your PrestaShop store.",
    link: "#",
  },
];

export default function ModulesPage() {
  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold tracking-tight">PrestaShop Modules</h1>
      <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
        A collection of custom PrestaShop modules I have developed to enhance e-commerce functionality.
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module, index) => (
          <ModuleCard
            key={module.title} // Use a unique key, title might not be unique in real data
            title={module.title}
            description={module.description}
            link={module.link}
            // imageUrl={module.imageUrl} // Add imageUrl if available
            index={index} // Pass index for staggered animation
          />
        ))}
      </div>
    </div>
  );
} 