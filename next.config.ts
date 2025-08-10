import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  images: {
    domains: ['images.unsplash.com']
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL
  }
}

export default nextConfig
