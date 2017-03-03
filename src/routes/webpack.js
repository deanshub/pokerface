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
  publicPath: webpackConfig.output.publicPath,
})
export const hotMiddleware = ()=> webpackHotMiddleware(compiler)
