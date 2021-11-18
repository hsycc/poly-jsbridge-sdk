/*
 * @Author: hsycc
 * @Date: 2021-06-28 18:52:24
 * @LastEditTime: 2021-11-18 13:59:53
 * @Description:
 *
 */

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { merge } = require('webpack-merge');

const devConfig = require('./webpack.dev');
module.exports = merge(devConfig, {
  mode: 'production',
  devtool: false,
  output: {
    filename: (x) =>
      x.chunk.name.replace(/^\S/, (s) => s.toLowerCase()) + '.min.js',
    library: '[name]',
    path: path.resolve(__dirname, 'dist/browser'),
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'tests/*.html'),
          to: path.resolve(__dirname, 'dist/'),
        },
        {
          from: path.resolve(__dirname, 'tests/*.css'),
          to: path.resolve(__dirname, 'dist/'),
        },
        {
          from: path.resolve(__dirname, 'README.md'),
          to: path.resolve(__dirname, 'dist/'),
        },
        {
          from: path.resolve(__dirname, 'CHANGELOG.md'),
          to: path.resolve(__dirname, 'dist/'),
        },
      ],
    }),
  ],
});
