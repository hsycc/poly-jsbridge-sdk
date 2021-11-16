/*
 * @Author: hsycc
 * @Date: 2021-11-16 10:52:03
 * @LastEditTime: 2021-11-16 17:38:33
 * @Description: 
 * 
 */

const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    'EasyJsSdk': './lib/index.ts',
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
    filename: (x) => x.chunk.name.replace(/^\S/, s => s.toLowerCase()) + '.js',
    library: '[name]',
    path: path.resolve(__dirname, 'dist/browser'),
  },
};
