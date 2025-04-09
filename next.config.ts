/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
  },
  webpack: (config, { isServer }) => {
    // Handle external modules from bitbucket
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      include: [
        /node_modules\/Configurator/,
        /node_modules\/FE-utils/,
        /node_modules\/Navigation/,
        /node_modules\/web-appointment-calendar-component/,
        /node_modules\/web-authentication/,
      ],
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
      },
    });

    // Enable support for SASS in external modules
    config.module.rules.push({
      test: /\.s[ac]ss$/i,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            sourceMap: true,
          },
        },
        {
          loader: "sass-loader",
          options: {
            sourceMap: true,
          },
        },
      ],
    });

    // Polyfills for modules that expect a browser environment
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        util: require.resolve("util/"),
        url: require.resolve("url/"),
      };
    }

    return config;
  },
  transpilePackages: [
    "Configurator",
    "FE-utils",
    "Navigation",
    "web-appointment-calendar-component",
    "web-authentication",
  ],
};

module.exports = nextConfig;
