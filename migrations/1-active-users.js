'use strict';

module.exports.id = "active-users";

module.exports.up = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const players = this.db.collection('players');
  players.updateMany({}, {$set:{active: true}}, undefined, done);
};

module.exports.down = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  const players = this.db.collection('players');
  players.updateMany({}, {$unset:{active: 1}}, {multi: true}, done);
};
