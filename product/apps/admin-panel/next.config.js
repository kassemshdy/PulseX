/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@cms/services', '@cms/database', '@cms/cache', '@cms/shared'],
  reactStrictMode: true,
};

module.exports = nextConfig;

