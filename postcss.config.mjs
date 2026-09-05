const config = {
	plugins: {
		'@tailwindcss/postcss': {
			content: [
				// Better - only scans the 'src' folder
				'../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
			],
		},
	},
}

export default config
