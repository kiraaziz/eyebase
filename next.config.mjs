const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Add this section to ignore .docs files/directories
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  webpack: (config, { isServer }) => {
    // Ignore .docs files/directories
    config.module.rules.push({
      test: /\.docs$/,
      use: 'ignore-loader',
    });
    
    return config;
  },
};

export default config;