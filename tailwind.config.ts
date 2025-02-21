import type { Config } from 'tailwindcss';

export default {
    darkMode: ['class'],
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
  	},
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {}
  	}
  },
  plugins: [require("tailwindcss-animate")]
} satisfies Config;
