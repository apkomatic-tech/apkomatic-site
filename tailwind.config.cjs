/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#430ebe',
				primaryDark: '#240865',
				primaryLighter: '#5a1bee',
				primaryLight: '#eff2ff',
				secondary: '#a4133c',
				secondaryLighter: '#c9184a',
				secondaryLight: '#ffccd5',
				accent: '#FDC500',
				accentDark: '#E0B000',
				accentLight: '#FFE999'
			}
		},
		fontFamily: {
			serif: ['Poppins', ...defaultTheme.fontFamily.serif],
			sans: ['Inter', ...defaultTheme.fontFamily.sans]
		}
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
		require('@tailwindcss/container-queries')
	]
};
