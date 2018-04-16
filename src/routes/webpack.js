import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpack from 'webpack'
import webpackConfig from '../../../client/webpack.config'

const compiler = webpack(webpackConfig)

export const devMiddleware = ()=> webpackDevMiddleware(compiler,{
  stats: {
    colors: true,
  },
  // noInfo: true,
  publicPath: webpackConfig[0].output.publicPath,
  watchOptions:{
    aggregateTimeout: 300,
  },
})
export const hotMiddleware = ()=> webpackHotMiddleware(compiler)
