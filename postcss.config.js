module.exports = {
  plugins: [
    require('postcss-icss-values'),
    require('postcss-smart-import')({ /* ...options */ }),
    require('precss')({ /* ...options */ }),
    require('autoprefixer')({ browsers: ['last 2 versions', 'safari >= 7'] }),
    require('postcss-flexbugs-fixes'),
  ],
}
