module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // i18n: {
  //   locales: ["en", "my"],
  //   defaultLocale: "en",
  //  },
  reactStrictMode: false,
  // swcMinify: true,
  compiler: {
    removeConsole: false,
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
