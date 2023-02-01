/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				bleu: {
					primary: '#07B4EE',
					bg: '#123753',
					dark: '#0F1F2A',
					gray: '#D9DFE9'
				}
			}
		}
	},
	plugins: []
};
