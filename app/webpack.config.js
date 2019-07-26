const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: [
          "./src/index.js",
        ],
  mode: "development",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" },
                           { from: "./src/styles.css", to: "styles.css" }
                          ]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};
