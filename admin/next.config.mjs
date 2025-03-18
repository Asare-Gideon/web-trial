/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.experiments.asyncWebAssembly = true;
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
