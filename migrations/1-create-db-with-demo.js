'use strict';

import DB from '../src/data/db'
import generateFakeData from '../src/data/faker/generator'

module.exports.id = "create-db-with-demo";

module.exports.up = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  generateFakeData(DB).then(() =>{
    done()
  }).catch((err) =>{
    done(err)
  })
};

module.exports.down = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  done();
};
