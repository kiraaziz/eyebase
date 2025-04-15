const path = require("path");

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
  webpack(config, { isServer }) {
    // Exclude ./docs folder from the build process
    config.module.rules.push({
      test: /docs/,
      loader: 'ignore-loader', // Ignore loading files from ./docs folder
      include: path.resolve(__dirname, 'docs'),
    });

    return config;
  },
};

export default config;
