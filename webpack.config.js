// let rucksack = require('rucksack-css')
let webpack = require('webpack')
let path = require('path')
let NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'development')

let devtool
let plugins = [
  new webpack.DefinePlugin({
    'process.env': { NODE_ENV },
  }),
]

if (NODE_ENV==='"development"'){
  plugins.push(new webpack.NamedModulesPlugin())
  plugins.push(new webpack.HotModuleReplacementPlugin())
  devtool = 'inline-source-map'
}else{
  plugins.push(new webpack.NoEmitOnErrorsPlugin())
  plugins.push(new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor.bundle.js'}))
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false,
    },
  }))

}

let config = {
  context: path.join(__dirname, './client'),
  entry: {
    bundle: './index.js',
    html: './index.html',
    vendor: [
      'react',
      'react-dom',
      'react-router',
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
        include: path.join(__dirname, 'client'),
        use: [
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[local]___[hash:base64:5]',
          'postcss-loader',
        ],
      },
      {
        test: /\.css$/,
        exclude: path.join(__dirname, 'client'),
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
