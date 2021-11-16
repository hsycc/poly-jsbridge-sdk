/*
 * @Author: hsycc
 * @Date: 2021-06-28 18:52:24
 * @LastEditTime: 2021-11-16 17:39:31
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
          to: path.resolve(__dirname, 'dist/browser/'),
        },
        {
          from: path.resolve(__dirname, 'tests/*.css'),
          to: path.resolve(__dirname, 'dist/browser/'),
        },
      ],
    }),
  ],
});
// module.exports = {
//   module: {
//     rules: [
//       {
//         test: /\.tsx?$/,
//         use: {
//           loader: 'ts-loader',
//           options: {
//             configFile: 'tsconfig.json',
//           },
//         },
//         exclude: /node_modules/,
//       },
//     ],
//   },
//   resolve: {
//     extensions: ['.tsx', '.ts', '.js'],
//   },
//   output: {
//     filename: (x) =>
//       x.chunk.name.replace(/^\S/, (s) => s.toLowerCase()) + '.min.js',
//     library: '[name]',
//     path: path.resolve(__dirname, 'dist/browser'),
//   },
//   mode: 'production',
//   plugins: [
//     new CopyPlugin({
//       patterns: [
//         {
//           from: path.resolve(__dirname, 'tests/*.html'),
//           to: path.resolve(__dirname, 'dist/browser/'),
//         },
//         {
//           from: path.resolve(__dirname, 'tests/*.css'),
//           to: path.resolve(__dirname, 'dist/browser/'),
//         },
//       ],
//     }),
//   ],
//   entry: {
//     EasyJsSdk: './lib/index.ts',
//   },
// };
