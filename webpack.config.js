// let rucksack = require('rucksack-css')
let webpack = require('webpack')
let path = require('path')

let NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'development')

let devtool
let plugins = [
  new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor.bundle.js'}),
  new webpack.DefinePlugin({
    'process.env': { NODE_ENV },
  }),
  new webpack.NoEmitOnErrorsPlugin(),
]

if (NODE_ENV!=='"development"'){
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false,
    },
  }))
  plugins.push(new webpack.HotModuleReplacementPlugin())
  plugins.push(new webpack.NamedModulesPlugin())
  devtool = 'inline-source-map'
}

let config = {
  context: path.join(__dirname, './client'),
  entry: {
    bundle: './index.js',
    html: './index.html',
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-redux',
      'redux',
    ],
  },
  output: {
    path: path.join(__dirname, './static'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'file-loader?name=[name].[ext]',
      },
      {
        test: /\.css$/,
        include: /client\\client/,
        use: [
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[local]___[hash:base64:5]',
          'postcss-loader',
        ],
      },
      {
        test: /\.css$/,
        exclude: /client\\client/,
        use: [{
          loader:'style-loader',
        },{
          loader:'css-loader',
        }],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: [
          'react-hot-loader',
          'babel-loader',
        ],
      },
      {
        test: /\.svg(\?.*)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml&name=images/[name].[ext]',
        include: path.join(__dirname, 'client', 'assets'),
      }, {
        test: /\.png$/,
        loader: 'url-loader?limit=8192&mimetype=image/png&name=images/[name].[ext]',
        include: path.join(__dirname, 'client', 'assets'),
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
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins,
  devtool,
  devServer: {
    contentBase: './client',
    hot: true,
    publicPath: '/',
  },
}

module.exports = config
