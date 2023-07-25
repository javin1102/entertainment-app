/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},

			colors: {
				"dark-blue": "#10141E",
				red: "#FC4747",
				"greyish-blue": "#5A698F",
				"semi-dark-blue": "#161D2F",
				white: "#FFFFFF",
				gray: "#979797",
			},
		},
	},
	plugins: [],
};
