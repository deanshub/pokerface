// let rucksack = require('rucksack-css')
let webpack = require('webpack')
let path = require('path')
let NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'development')

let devtool
let hotloaderEntries=[]
let babelHotloader=[]
let plugins = [
  new webpack.DefinePlugin({
    'process.env': { NODE_ENV },
  }),
  // new webpack.optimize.CommonsChunkPlugin({
  //   name: 'vendor',
  // }),
]

if (NODE_ENV==='"development"'){
  plugins.push(new webpack.NamedModulesPlugin())
  plugins.push(new webpack.HotModuleReplacementPlugin())
  devtool = 'eval-source-map'
  hotloaderEntries = [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
  ]
  plugins.push(new webpack.NoEmitOnErrorsPlugin())
  babelHotloader = ['react-hot-loader/webpack']
}else{
  plugins.push(new webpack.optimize.DedupePlugin())
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false,
    },
    sourceMap: false,
  }))
  plugins.push(new webpack.optimize.AggressiveMergingPlugin())
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
      'semantic-ui-react',
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
          // 'react-hot-loader',
          ...babelHotloader,
          'babel-loader?cacheDirectory=true',
        ],
      },
      {
        test: /\.svg(\?.*)?$/,
        include: path.resolve(__dirname, 'client', 'assets'),
        loader: 'url-loader?limit=1024&name=images/[name].[ext]',
        // loader: 'svg-url-loader?limit=1024&noquotes&name=images/[name].[ext]',
      }, {
        test: /\.png$/,
        loader: 'url-loader?limit=8192&mimetype=image/png&name=images/[name].[ext]',
        // include: path.resolve(__dirname, 'client', 'assets'),
      }, {
        test: /\.gif$/,
        loader: 'url-loader?limit=8192&mimetype=image/gif&name=images/[name].[ext]',
        include: path.resolve(__dirname, 'client', 'assets'),
      }, {
        test: /\.jpg$/,
        loader: 'url-loader?limit=8192&mimetype=image/jpg&name=images/[name].[ext]',
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
