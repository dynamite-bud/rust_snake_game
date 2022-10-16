const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const WebpackShellPluginNext = require("webpack-shell-plugin-next");

// eslint-disable-next-line no-undef
module.exports = {
  entry: "./src/bootstrap.js",
  output: {
    // eslint-disable-next-line no-undef
    path: path.resolve(__dirname, "public"),
    filename: "bootstrap.js",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "./src/index.html", to: "./" }],
    }),
  ],
};
