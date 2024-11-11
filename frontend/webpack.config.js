// frontend/webpack.config.js

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development', // Change to 'production' for production builds
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    // publicPath: '/', // Uncomment if needed
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      // CSS Loader Example
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // Add loaders for images, fonts, etc., as needed
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assessments/',
          to: 'assessments/',
        },
      ],
    }),
    // Add other plugins like HtmlWebpackPlugin if necessary
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    historyApiFallback: true,
    port: 3000,
    open: true, // Automatically open the browser
    hot: true,  // Enable Hot Module Replacement
  },
  devtool: 'source-map', // Enable source maps for easier debugging
};
