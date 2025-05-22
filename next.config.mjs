/** @type {import('next').NextConfig} */
const nextConfig = {

    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`
            }
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.devdojo.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'i.namu.wiki',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'img.stibee.com',
                port: '',
                pathname: '/**',

            }

        ],
    },
};

export default nextConfig;
