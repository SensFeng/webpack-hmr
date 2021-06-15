const path = require('path');
const HtmlWebapckPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: false,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    // hotUpdateChunkFilename: '[hash].tom.hot-update.js',
    // hotUpdateGlobal: 'webpackHotUpdate'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devServer: {
    open: true,
    port: 9000,
    contentBase: path.resolve(__dirname, 'static'),
    // hot: true,
  },
  plugins: [
    new HtmlWebapckPlugin({
      template:'./public/index.html'
    })
  ]
}