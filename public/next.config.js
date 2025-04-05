// Frontend configuration
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['source.unsplash.com', 'www.classcentral.com'],
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:5000/api',
  },
};
