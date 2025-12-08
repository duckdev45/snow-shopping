/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      // 👇 未來你一定會用到 Supabase Storage，建議現在順手加上去！
      // 記得把 hostname 換成你自己的 supabase 網址 (例如 phcpyzcnh...supabase.co)
      {
        protocol: 'https',
        hostname: 'phcpyzcnhjwnmfqezcnp.supabase.co'
      }
    ]
  }
}

export default nextConfig
