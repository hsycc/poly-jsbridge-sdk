/*
 * @Author: hsycc
 * @Date: 2021-11-16 10:52:03
 * @LastEditTime: 2021-11-16 11:39:56
 * @Description: 
 * 
 */

const path = require('path');
const packageName = require('./package.json').name;

function toHump(name) {
  return name.replace(/\-(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
}
module.exports = {
  entry: {
    [toHump(packageName)]: './lib/index.ts',
  },
  devtool: 'inline-source-map',
  mode: 'development',
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
    filename: (x) => x.chunk.name.replace('_', '-') + '.js',
    library: '[name]',
    path: path.resolve(__dirname, 'dist/browser'),
  },
};
