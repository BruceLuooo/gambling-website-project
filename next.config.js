/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
};

module.exports = {
	reactStrictMode: true,
	swcMinify: true,
	env: {
		REACT_APP_LIVE_SPORTS_ODDS_KEY:
			'2cbb011960msh3ff72f4f58249a1p127b8bjsnc63ffc1d70d9',
	},
};
