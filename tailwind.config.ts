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
        // Define vibrant gradient colors
        gradient_start: colors.purple[600], // Vibrant purple
        gradient_end: colors.pink[500],     // Vibrant pink
        accent: colors.pink, // Use pink as the main accent now
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
      backgroundImage: {
        // Define the gradient utility
        'vibrant-gradient': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
      keyframes: {
        // Simple fade-in animation
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Subtle pulse/glow effect for interactions
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: `0 0 5px ${colors.pink[400]}` },
          '50%': { opacity: '0.8', boxShadow: `0 0 15px ${colors.pink[300]}` },
        }
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out',
        pulseGlow: 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
            '--tw-prose-links': theme('colors.accent.500'), // Updated accent color
            // Adjust base text color for better contrast if needed, especially on gradient bg
            // '--tw-prose-body': theme('colors.gray.800'), // Example for light mode
          },
        },
        // Add specific prose variants like prose-invert for dark mode if desired
         invert: { // Dark mode prose
           css: {
             '--tw-prose-body': theme('colors.gray.300'),
             '--tw-prose-headings': theme('colors.white'),
             '--tw-prose-lead': theme('colors.gray.400'),
             // '--tw-prose-links': theme('colors.accent[400]'), // Updated accent color
             '--tw-prose-bold': theme('colors.white'),
             '--tw-prose-counters': theme('colors.gray[400]'),
             '--tw-prose-bullets': theme('colors.gray[600]'),
             '--tw-prose-hr': theme('colors.gray[700]'),
             '--tw-prose-quotes': theme('colors.gray[100]'),
             '--tw-prose-quote-borders': theme('colors.gray[700]'),
             '--tw-prose-captions': theme('colors.gray[400]'),
             '--tw-prose-code': theme('colors.white'),
             '--tw-prose-pre-code': theme('colors.gray[300]'),
             // '--tw-prose-pre-bg': theme('colors.gray[900]'), // Darker code blocks
             '--tw-prose-pre-bg': 'rgb(15 23 42 / 0.8)', // Use rgb for transparency
             '--tw-prose-th-borders': theme('colors.gray[600]'),
             '--tw-prose-td-borders': theme('colors.gray[700]'),
             '--tw-prose-invert-body': theme('colors.gray.300'),
             '--tw-prose-invert-headings': theme('colors.white'),
             '--tw-prose-invert-lead': theme('colors.gray[400]'),
             '--tw-prose-invert-links': theme('colors.accent.400'), // Updated accent color
             '--tw-prose-invert-bold': theme('colors.white'),
             '--tw-prose-invert-counters': theme('colors.gray[400]'),
             '--tw-prose-invert-bullets': theme('colors.gray.600'),
             '--tw-prose-invert-hr': theme('colors.gray[700]'),
             '--tw-prose-invert-quotes': theme('colors.gray[100]'),
             '--tw-prose-invert-quote-borders': theme('colors.gray[700]'),
             '--tw-prose-invert-captions': theme('colors.gray.400'),
             '--tw-prose-invert-code': theme('colors.white'),
             '--tw-prose-invert-pre-code': theme('colors.gray[300]'),
             // '--tw-prose-invert-pre-bg': theme('colors.gray[900]'),
             '--tw-prose-invert-pre-bg': 'rgb(15 23 42 / 0.8)', // Use rgb for transparency
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