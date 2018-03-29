// let rucksack = require('rucksack-css')
let webpack = require('webpack')
let path = require('path')
let NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'development')

let devtool
let hotloaderEntries=[]
let plugins = [
  new webpack.DefinePlugin({
    'process.env': { NODE_ENV },
  }),
]

if (NODE_ENV==='"development"'){
  plugins.push(new webpack.NamedModulesPlugin())
  plugins.push(new webpack.HotModuleReplacementPlugin())
  plugins.push(new webpack.LoaderOptionsPlugin({
    debug: true,
  }))
  devtool = 'eval-source-map'
  hotloaderEntries = [
    'webpack-hot-middleware/client',
  ]
}else{
  plugins.push(new webpack.optimize.AggressiveMergingPlugin())
  plugins.push(new webpack.LoaderOptionsPlugin({
    minimize: true,
  }))
}

const config = {
  mode: NODE_ENV==='"development"'?'development':'production',
  context: path.resolve(__dirname, './client'),
  entry: {
    bundle: [
      ...hotloaderEntries,
      './index.js',
    ],
    html: './index.html',
    vendor: [
      'babel-polyfill',
      'whatwg-fetch',
      ...hotloaderEntries,
      'react',
      'react-dom',
      'react-router',
      'draft-js',
      'draft-js-emoji-plugin',
      'draft-js-focus-plugin',
      'draft-js-hashtag-plugin',
      'draft-js-inline-toolbar-plugin',
      'draft-js-linkify-plugin',
      'draft-js-mention-plugin',
      'draft-js-plugins-editor',
      'history',
      'javascript-time-ago',
      'mobx',
      'mobx-react',
      'mobx-react-router',
      'moment',
      'ramda',
      'intl-messageformat',
      'react-addons-shallow-compare',
      'react-datetime',
      'react-document-title',
      'react-router-dom',
      'recharts',
      'superagent',
    ],
  },
  output: {
    path: path.resolve(__dirname, './static'),
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
        include: path.resolve(__dirname, 'client'),
        use: [
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[local]___[hash:base64:5]',
          'postcss-loader',
        ],
      },
      {
        test: /\.css$/,
        exclude: path.resolve(__dirname, 'client'),
        use: [{
          loader:'style-loader',
        },{
          loader:'css-loader',
        }],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader?cacheDirectory=true',
        ],
      },
      {
        test: /\.svg(\?.*)?$/,
        include: path.resolve(__dirname, 'client', 'assets'),
        loader: 'url-loader?limit=1024h&outputPat=images&context=/images&name=[name].[ext]',
        // loader: 'svg-url-loader?limit=1024&noquotes&outputPat=images&context=/images&name=[name].[ext]',
      }, {
        test: /\.png$/,
        loader: 'url-loader?limit=8192&mimetype=image/png&outputPat=images&context=/images&name=[name].[ext]',
        // include: path.resolve(__dirname, 'client', 'assets'),
      }, {
        test: /\.gif$/,
        loader: 'url-loader?limit=8192&mimetype=image/gif&outputPat=images&context=/images&name=[name].[ext]',
        include: path.resolve(__dirname, 'client', 'assets'),
      }, {
        test: /\.jpg$/,
        loader: 'url-loader?limit=8192&mimetype=image/jpg&outputPat=images&context=/images&name=[name].[ext]',
        include: path.resolve(__dirname, 'client', 'assets'),
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=1024&mimetype=application/font-woff',
      },
      {
        test: /\.(svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        exclude: path.resolve(__dirname, 'client', 'assets'),
      },
      {
        test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
      {
        test: /\.mp3$/,
        loader: 'file-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx','.json'],
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
