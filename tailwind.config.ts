import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors'; // Import default colors

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Define primary accent color (e.g., Teal)
        accent: colors.teal,
        // Example: You could also define specific shades
        // accent: {
        //   light: colors.teal[400],
        //   DEFAULT: colors.teal[500],
        //   dark: colors.teal[600],
        // },
        gray: colors.neutral, // Use neutral gray for better dark mode compatibility
      },
      fontFamily: {
        // Ensure Geist fonts are available if needed beyond the layout root
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      // Extend typography styles here if needed
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            // Add base prose styles here
            'h1, h2, h3, h4, h5, h6': {
              // Example: Add scroll margin top for anchor links
               scrollMarginTop: theme('spacing.20'),
            },
            // Add dark mode prose styles
            // See: https://tailwindcss.com/docs/typography-plugin#adding-custom-color-themes
            '--tw-prose-links': theme('colors.accent[600]'), // Use accent color for links
          },
        },
        // Add specific prose variants like prose-invert for dark mode if desired
         invert: {
           css: {
             '--tw-prose-body': theme('colors.gray[300]'),
             '--tw-prose-headings': theme('colors.white'),
             '--tw-prose-lead': theme('colors.gray[400]'),
             '--tw-prose-bold': theme('colors.white'),
             '--tw-prose-counters': theme('colors.gray[400]'),
             '--tw-prose-bullets': theme('colors.gray[600]'),
             '--tw-prose-hr': theme('colors.gray[700]'),
             '--tw-prose-quotes': theme('colors.gray[100]'),
             '--tw-prose-quote-borders': theme('colors.gray[700]'),
             '--tw-prose-captions': theme('colors.gray[400]'),
             '--tw-prose-code': theme('colors.white'),
             '--tw-prose-pre-code': theme('colors.gray[300]'),
             '--tw-prose-pre-bg': theme('colors.gray[900]'), // Darker code blocks
             '--tw-prose-th-borders': theme('colors.gray[600]'),
             '--tw-prose-td-borders': theme('colors.gray[700]'),
             '--tw-prose-invert-body': theme('colors.gray[300]'),
             '--tw-prose-invert-headings': theme('colors.white'),
             '--tw-prose-invert-lead': theme('colors.gray[400]'),
             '--tw-prose-invert-links': theme('colors.accent[400]'), // Use accent color for dark mode links
             '--tw-prose-invert-bold': theme('colors.white'),
             '--tw-prose-invert-counters': theme('colors.gray[400]'),
             '--tw-prose-invert-bullets': theme('colors.gray[600]'),
             '--tw-prose-invert-hr': theme('colors.gray[700]'),
             '--tw-prose-invert-quotes': theme('colors.gray[100]'),
             '--tw-prose-invert-quote-borders': theme('colors.gray[700]'),
             '--tw-prose-invert-captions': theme('colors.gray[400]'),
             '--tw-prose-invert-code': theme('colors.white'),
             '--tw-prose-invert-pre-code': theme('colors.gray[300]'),
             '--tw-prose-invert-pre-bg': theme('colors.gray[900]'),
             '--tw-prose-invert-th-borders': theme('colors.gray[600]'),
             '--tw-prose-invert-td-borders': theme('colors.gray[700]'),
           },
         },
      }),
    },
  },
  darkMode: 'class', // Or 'media', depending on preference
  plugins: [
    require('@tailwindcss/typography'),
    // Add other plugins here
  ],
};

export default config; 