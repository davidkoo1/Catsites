/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true
    },
    images: {
        domains: [
            'cdn.pixabay.com', 'images.pexels.com'
        ]
    }
}

export default nextConfig;
