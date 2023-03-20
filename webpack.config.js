const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, './js'),
    filename: 'main.js',
  },
  resolve: {
    extensions: ['.ts'],
  },
  module: {
    rules: [{
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
    }],
  },
};
