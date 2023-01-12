const path = require("path");

module.exports = {
  entry: {
    main: path.join(__dirname, "./src/index.js"),
  },
  mode: "production",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "core"),
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      }
    ],
  },
};
