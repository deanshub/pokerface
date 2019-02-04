import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpack from 'webpack'
import config from 'config'
import webpackConfig from '../../../client/webpack.config'

const compiler = webpack(webpackConfig)

export const devMiddleware = ()=> webpackDevMiddleware(compiler,{
  stats: {
    colors: true,
  },
  // noInfo: true,
  // publicPath: '/',
  publicPath: `${config.ROOT_URL}/`,
  watchOptions:{
    aggregateTimeout: 300,
  },
})
export const hotMiddleware = ()=> webpackHotMiddleware(compiler, {
  path: '/__webpack_hmr',
})
