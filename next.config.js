/** @type {import('next').NextConfig} */
const nextConfig = {
  // REMOVE output: 'export' completely
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse']
  }
}

module.exports = nextConfig