/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        // domains: ['images.unsplash.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    // env: {
    //     API_KEY: process.env.API_KEY,
    // },
    // experimental: {
    //     appDir: true,
    // },
};

export default nextConfig;
