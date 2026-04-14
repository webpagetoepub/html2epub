/* eslint-disable @typescript-eslint/no-require-imports */

const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

const eslintOptions = {
  extensions: ['js', 'ts', 'mjs'],
};

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, './js'),
    filename: 'main.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      'path': require.resolve('path-browserify'),
      'fs': false,
    },
  },
  plugins: [
    new ESLintPlugin(eslintOptions),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
};
