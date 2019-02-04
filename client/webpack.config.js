// let rucksack = require('rucksack-css')
let webpack = require('webpack')
let path = require('path')
let NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'development')

let publicPath
let devtool
let hotloaderEntries=[]
let sdkHotReloadEntries=[]
let plugins = [
  new webpack.DefinePlugin({
    'process.env': { NODE_ENV },
  }),
]

if (NODE_ENV==='"development"'){
  publicPath='http://localhost:9031/'
  plugins.push(new webpack.NamedModulesPlugin())
  plugins.push(new webpack.HotModuleReplacementPlugin())
  plugins.push(new webpack.LoaderOptionsPlugin({
    debug: true,
  }))
  devtool = 'eval-source-map'
  hotloaderEntries = [
    `webpack-hot-middleware/client?path=${publicPath}__webpack_hmr&name=desktop`,
    // 'webpack-hot-middleware/client',
  ]
  sdkHotReloadEntries = [`webpack-hot-middleware/client?path=${publicPath}__webpack_hmr&name=sdk`]
}else{
  publicPath='https://pokerface.io/'
  plugins.push(new webpack.optimize.AggressiveMergingPlugin())
  plugins.push(new webpack.LoaderOptionsPlugin({
    minimize: true,
  }))
}

const config = {
  target: 'web',
  mode: NODE_ENV==='"development"'?'development':'production',
  context: path.resolve(__dirname, './client'),
  entry: {
    bundle: [
      ...hotloaderEntries,
      './index.js',
    ],
    html: './index.html',
    vendor: [
      ...hotloaderEntries,
      'babel-polyfill',
      'whatwg-fetch',
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
    // publicPath: '/',
    publicPath: publicPath,
    filename: '[name].js',
    chunkFilename: '[id].[chunkhash].js',
    // hotUpdateChunkFilename: 'hot-update.js',
    // hotUpdateMainFilename: 'hot-update.json',
    // hotUpdateChunkFilename: '__webpack_hmr/[id].[hash].hot-update.js',
    // hotUpdateMainFilename: '__webpack_hmr/[hash].hot-update.json',
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
        loader: 'url-loader?limit=1024h&context=images&outputPath=images&name=[name].[ext]',
        // loader: 'svg-url-loader?limit=1024&noquotes&context=images&outputPath=images&name=[name].[ext]',
      }, {
        test: /\.png$/,
        loader: 'url-loader?limit=8192&mimetype=image/png&context=images&outputPath=images&name=[name].[ext]',
        // include: path.resolve(__dirname, 'client', 'assets'),
      }, {
        test: /\.gif$/,
        loader: 'url-loader?limit=8192&mimetype=image/gif&context=images&outputPath=images&name=[name].[ext]',
        include: path.resolve(__dirname, 'client', 'assets'),
      }, {
        test: /\.jpg$/,
        loader: 'url-loader?limit=8192&mimetype=image/jpg&context=images&outputPath=images&name=[name].[ext]',
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
    // publicPath: '/',
    publicPath: publicPath,
  },
}

const sdkConfig = {
  ...config,
  entry: {
    pokerface: [...sdkHotReloadEntries, './sdk.js'],
  },
  output:{
    ...config.output,
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
}
// module.exports = config
module.exports = [config, sdkConfig]
