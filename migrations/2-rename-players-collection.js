'use strict';

module.exports.id = "rename-players-collection";

module.exports.up = function (done) {

  // use this.db for MongoDB communication, and this.log() for logging
  const users = this.db.collection('players')
  const games = this.db.collection('games')
  const posts = this.db.collection('posts')
  const comments = this.db.collection('comments')

  users.rename('users').then(() =>
  {
    return games.updateMany({},{$rename:{'player':'owner'}})
  }).then(() => {
    return posts.updateMany({},{$rename:{'player':'owner'}})
  }).then(() => {
    return comments.updateMany({},{$rename:{'player':'owner'}})
  }).then(() => {
    done()
  })
};

module.exports.down = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const users = this.db.collection('users')
  const games = this.db.collection('games')
  const posts = this.db.collection('posts')
  const comments = this.db.collection('comments')

  users.renameCollection('players').then(() =>
  {
    return games.updateMany({},{$rename:{'owner':'player'}})
  }).then(() => {
    return posts.updateMany({},{$rename:{'owner':'player'}})
  }).then(() => {
    return comments.updateMany({},{$rename:{'owner':'player'}})
  }).then(() => {
    this.log('done')
    done()
  })
};
