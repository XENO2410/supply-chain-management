// craco.config.js
module.exports = {
    webpack: {
      alias: {
        stream: "stream-browserify",
        os: "os-browserify/browser"
      },
      configure: (webpackConfig) => {
        webpackConfig.resolve.fallback = {
          ...webpackConfig.resolve.fallback,
          stream: require.resolve("stream-browserify"),
          os: require.resolve("os-browserify/browser"),
        };
        return webpackConfig;
      },
    },
  };
  