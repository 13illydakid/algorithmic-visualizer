const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const APP_DIR = path.resolve(__dirname, 'src');
const BUILD_DIR = path.resolve(__dirname, 'build');

module.exports = (env = {}, argv = {}) => {
  const isProd = argv.mode === 'production';
  return {
    entry: path.join(APP_DIR, 'index.jsx'),
    output: {
      path: BUILD_DIR,
      filename: isProd ? 'static/js/bundle.[contenthash:8].js' : 'bundle.js',
      clean: true,
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: APP_DIR,
          use: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico)$/i,
          type: 'asset',
        }
      ]
    },
    resolve: { extensions: ['.js', '.jsx'] },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        favicon: path.resolve(__dirname, 'public/icon.ico'),
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'public/manifest.json', to: 'manifest.json' },
          { from: 'public/robots.txt', to: 'robots.txt' },
          { from: 'public/logo192.png', to: 'logo192.png' },
          { from: 'public/logo512.png', to: 'logo512.png' },
        ].filter(Boolean)
      })
    ],
    devServer: {
      static: BUILD_DIR,
      historyApiFallback: true,
      port: 3000,
      open: true,
      hot: true,
    },
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',
    performance: { hints: false }
  };
};
