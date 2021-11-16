/*
 * @Author: hsycc
 * @Date: 2021-06-28 18:52:24
 * @LastEditTime: 2021-11-16 11:35:58
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
  mode: 'production',
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
    filename: (x) => x.chunk.name.replace('_', '-') + '.min.js',
    library: '[name]',
    path: path.resolve(__dirname, 'dist/browser'),
  },
};
