/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.dribbble.com',
                port: '',
                pathname: '/userupload/**'
            }
        ]
    }
};

export default nextConfig;
