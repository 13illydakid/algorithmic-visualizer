const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'src/public');
const APP_DIR = path.resolve(__dirname, 'src');

const config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: '/', // Helps with React Router or assets
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,         // Matching .js and .jsx files
        include: APP_DIR,
        use: {
          loader: 'babel-loader', // Correct loader for Babel 7
        },
      },
      {
        test: /\.css$/,          // Matching .css files
        include: APP_DIR,
        use: ['style-loader', 'css-loader'],  // Handling CSS imports
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Allows importing without file extensions
  },
  devServer: {
    static: path.join(__dirname, '/server/index'),
    historyApiFallback: true, // Necessary for React Router to work
    port: 3000,
    open: true,
    hot: true, // Enables Hot Module Replacement (HMR)
  },
  mode: 'development', // Can switch to 'production' for optimized build
  devtool: 'source-map', // Useful for debugging
};

module.exports = config;
