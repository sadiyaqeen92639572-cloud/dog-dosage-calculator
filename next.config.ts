import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  output: 'export',
  basePath: '/dog-dosage-calculator',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: ['motion'],
};

export default nextConfig;
