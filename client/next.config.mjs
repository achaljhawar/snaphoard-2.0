/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dribbble.com",
        port: "",
        pathname: "/userupload/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      enabled: true,
      allowedOrigins: ["https://snap-hoard.vercel.app", "http://localhost:3000"],
    },
  },
};

export default nextConfig;
