/** @type {import('next').NextConfig} */
const nextConfig = {
  // For external packages in server components
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse'],
  },
  
  // Basic optimizations
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig