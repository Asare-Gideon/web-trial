/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint errors during build
  },
  typescript: {
    ignoreBuildErrors: true, // Ignores TypeScript errors during build
  },
  reactStrictMode: false,
  compiler: {
    removeConsole: false,
  },
  env: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  },
  images: {
    domains: [
      "i.ibb.co",
      "robohash.org",
      "res.cloudinary.com",
      "firebasestorage.googleapis.com",
    ],
  },
};
