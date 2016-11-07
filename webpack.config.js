var path = require('path');
var webpack = require('webpack');
 
module.exports = {
  entry: './src/js/index.js',
  output: { path: __dirname+'/dist/', filename: 'main.js' },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      },
      {
          test: /\.(j2|nunjucks)$/,
          loader: 'nunjucks-loader'
      }
    ]
  },
};