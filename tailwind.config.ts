import type { Config } from 'tailwindcss'

/**
 * Tailwind CSS Configuration
 * Configures styles for the entire application
 */
const config: Config = {
  // Paths where Tailwind will scan for class names
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  // Dark mode is enabled but not used (permanent dark theme applied via base styles)
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
