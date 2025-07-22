import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'akbob5wqs7.ufs.sh',
        port: '',
        pathname: '/f/**',
      },
      {
        protocol: 'https',
        hostname: '*.ufs.sh',
        port: '',
        pathname: '/f/**',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/f/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
