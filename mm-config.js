const config = require('config')

const connString = `mongodb://${config.DB_USER}:${config.DB_PASSWORD}@localhost/pokerface`

module.exports = {
  url: connString,
  directory: 'migrations',
}
