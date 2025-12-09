/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      // Supabase Storage
      {
        protocol: 'https',
        hostname: 'phcpyzcnhjwnmfqezcnp.supabase.co'
      }
    ]
  },
  basePath: process.env.GITHUB_ACTIONS ? '/snow-shopping' : ''
}

export default nextConfig
