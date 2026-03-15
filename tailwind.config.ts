import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Picks up the CSS variable injected by next/font
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        background: {
          DEFAULT: '#0A0A0F',
          alt: '#0D0D14',
        },
        surface: '#111118',
        accent: {
          primary: '#0A84FF',
          secondary: '#30D5C8',
        },
        content: {
          primary: '#F5F5F7',
          secondary: '#8E8E93',
        },
        border: 'rgba(255,255,255,0.07)',
        success: '#30D158',
        error: '#FF453A',
      },
      maxWidth: {
        container: '1280px',
      },
    },
  },
  plugins: [],
}

export default config
