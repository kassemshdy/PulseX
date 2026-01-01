/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@cms/shared', '@cms/services', '@cms/database', '@cms/cache'],
  webpack: (config) => {
    // Handle prisma client
    config.externals = [...(config.externals || []), '@prisma/client'];
    return config;
  },
}

module.exports = nextConfig

