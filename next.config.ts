/** @type {import('next').NextConfig} */

import type { Configuration as WebpackConfig } from "webpack";
import type { NextConfig } from "next";

const path = require("path");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
  },
  webpack: (config: WebpackConfig, { isServer }) => {
    // Handle external modules from bitbucket
    if (config.module?.rules) {
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
    }

    // Polyfills for modules that expect a browser environment
    if (!isServer && config.resolve) {
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
    "@fortawesome/fontawesome-svg-core",
  ],
};

export default nextConfig;
