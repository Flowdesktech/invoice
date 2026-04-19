import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'invoicemanagement-35961';
const FIREBASE_FUNCTIONS_REGION = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION || 'us-central1';
const API_ORIGIN = `https://${FIREBASE_FUNCTIONS_REGION}-${FIREBASE_PROJECT_ID}.cloudfunctions.net`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Allow packages that reference CJS exports from React 19 during SSR.
  transpilePackages: [
    '@mui/material',
    '@mui/icons-material',
    '@mui/x-date-pickers',
    '@mui/material-nextjs',
  ],

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_ORIGIN}/api/:path*`,
      },
    ];
  },

  webpack: (config) => {
    // Alias react-router-dom to our Next.js-backed compatibility shim so
    // existing page/component imports keep working untouched.
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-router-dom$': path.resolve(__dirname, 'src/lib/router-compat.js'),
      'react-router-dom': path.resolve(__dirname, 'src/lib/router-compat.js'),
    };
    return config;
  },
};

export default nextConfig;
