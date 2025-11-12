/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'tesseract.js'],
  },
  // Increase timeout if needed for large files
  serverExternalPackages: ['pdf-parse'],
}

module.exports = nextConfig