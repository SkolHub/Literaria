import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    screens: {
      'big-laptop': {
        max: '1750px'
      },
      laptop: {
        max: '1600px'
      },
      tablet: {
        max: '1250px'
      },
      'small-tablet': {
        max: '1110px'
      },
      mobile: {
        max: '900px'
      },
      'mobile-medium': {
        raw: ''
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
export default config;
