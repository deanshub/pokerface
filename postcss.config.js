module.exports = {
  plugins: [
    require('postcss-icss-values'),
    require('postcss-smart-import')({ /* ...options */ }),
    require('precss')({ /* ...options */ }),
    require('autoprefixer')({ /* ...options */ }),
    require('postcss-flexbugs-fixes'),
  ],
}
