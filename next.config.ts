import type { NextConfig } from "next";
import path from 'path';
// require('dotenv').config();
// import dotenv from 'dotenv'

const nextConfig: NextConfig = {
  future: {
    webpack5: true, // by default, if you customize webpack config, they switch back to version 4.
      // Looks like backward compatibility approach.
  },
  webpack: (config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      '@/components': path.resolve(__dirname, 'components'),
    }

    config.resolve.fallback = {
      ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
        // by next.js will be dropped. Doesn't make much sense, but how it is
      fs: false, // the solution
    };


    //  if (!isServer) {
    //   config.node = {
    //     fs: 'empty'
    //   }
    // }
    return config
  },
};

export default nextConfig;
