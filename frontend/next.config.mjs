/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'blue-historical-tapir-536.mypinata.cloud',
            port: '',
            pathname: '/ipfs/**',
          },
        ],
      },
};


export default nextConfig;
