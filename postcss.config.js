const path = require('path');

module.exports = {
	plugins: [
		[
			path.resolve(__dirname, 'postcss-plugins/css-alias.js'),
			{
				aliases: {
					'@/tailwindcss': path.resolve(
						__dirname,
						'src/styles/tailwind-reference.css'
					),
					'@/': path.resolve(__dirname, 'src') + '/',
				},
			},
		],
		'@tailwindcss/postcss',
		'postcss-nesting',
	],
};
