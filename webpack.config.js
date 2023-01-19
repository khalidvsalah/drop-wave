const path = require("path");

module.exports = {
  entry: {
    main: path.join(__dirname, "./index.js"),
  },
  mode: "production",
  output: {
    library: "Ardor",
    filename: "ardor.js",
    path: path.resolve(__dirname, "./"),
    asyncChunks: true,
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
};
