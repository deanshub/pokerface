// let rucksack = require('rucksack-css')
const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const config = require('config')

const NODE_ENV = JSON.stringify(config.NODE_ENV || 'development')
const DB_USER = JSON.stringify(config.DB_USER)
const DB_PASSWORD = JSON.stringify(config.DB_PASSWORD)
const PORT = JSON.stringify(config.PORT)
const GMAIL_USER = JSON.stringify(config.GMAIL_USER)
const GMAIL_PASSWORD = JSON.stringify(config.GMAIL_PASSWORD)

let devtool
// let hotloaderEntries=[]
let babelHotloader=[]
let plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV,
      DB_USER,
      DB_PASSWORD,
      PORT,
      GMAIL_USER,
      GMAIL_PASSWORD,
    },
  }),
]

if (NODE_ENV==='"development"'){
  plugins.push(new webpack.NamedModulesPlugin())
  plugins.push(new webpack.HotModuleReplacementPlugin())
  devtool = 'inline-source-map'
  // hotloaderEntries = [
  //   'react-hot-loader/patch',
  //   'webpack-hot-middleware/client',
  // ]
  // plugins.push(new webpack.NoEmitOnErrorsPlugin())
  babelHotloader = ['react-hot-loader/webpack']
}else{
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false,
    },
  }))
  plugins.push(new webpack.optimize.AggressiveMergingPlugin())
}

const webpackConfig = {
  target: 'node',
  entry: './src/index.js',
  externals: nodeExternals(),
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js',
    publicPath: path.join(__dirname, './dist'),
    chunkFilename: '[id].[chunkhash].js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          ...babelHotloader,
          'babel-loader?cacheDirectory=true',
        ],
      },
      {
        test: /\.svg(\?.*)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml&name=images/[name].[ext]',
        include: path.join(__dirname, 'client', 'assets'),
      }, {
        test: /\.png$/,
        loader: 'url-loader?limit=8192&mimetype=image/png&name=images/[name].[ext]',
        // include: path.join(__dirname, 'client', 'assets'),
      }, {
        test: /\.gif$/,
        loader: 'url-loader?limit=8192&mimetype=image/gif&name=images/[name].[ext]',
        include: path.join(__dirname, 'client', 'assets'),
      }, {
        test: /\.jpg$/,
        loader: 'url-loader?limit=8192&mimetype=image/jpg&name=images/[name].[ext]',
        include: path.join(__dirname, 'client', 'assets'),
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
      {
        test: /\.mp3$/,
        loader: 'file-loader',
      },
      {
        test: /\.css$/,
        loader: 'null',
      },
      {
        test: /\.node$/,
        loader: 'node-loader',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx','.json', '.node'],
  },
  plugins,
  devtool,
  devServer: {
    contentBase: './client',
    hot: true,
    publicPath: '/',
  },
  node: {
    __dirname: true,
  },
}

module.exports = webpackConfig
