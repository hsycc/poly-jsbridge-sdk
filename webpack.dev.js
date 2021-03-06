/**
 * /*
 *
 * @format
 * @Author: hsycc
 * @Date: 2021-11-16 10:52:03
 * @LastEditTime: 2021-11-21 14:58:23
 * @Description:
 */
/* eslint-disable */
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    PolyJsbridgeSdk: './index.ts',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.json',
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: x => x.chunk.name.replace(/^\S/, s => s.toLowerCase()) + '.js',
    library: '[name]',
    path: path.resolve(__dirname, 'dist/browser'),
  },
};
