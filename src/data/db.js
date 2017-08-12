import mongoose from 'mongoose'
mongoose.Promise = Promise

import Player from './dbModels/Player'
import Post from './dbModels/Post'
import Comment from './dbModels/Comment'
import Game from './dbModels/Game'
// import generateFakeData from './faker/generator'

const connString = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost/pokerface`
// mongoose.set('debug', true)
mongoose.connection.once('open', function() {
  console.log('MongoDB event open')

  mongoose.connection.on('connected', function() {
    console.log('MongoDB event connected')
  })

  mongoose.connection.on('disconnected', function() {
    console.warn('MongoDB event disconnected')
  })

  mongoose.connection.on('reconnected', function() {
    console.log('MongoDB event reconnected')
  })

  mongoose.connection.on('error', function(err) {
    console.error(`MongoDB event error:${err}`)
  })
})

  // return resolve();
  // return server.start();

mongoose.connect(connString,{
  useMongoClient: true,
  // socketTimeoutMS: 0,
  // keepAlive: true,
  // reconnectTries: 30,
}).then(()=>{
  console.log('Connected to DB successfuly')
}).catch(console.error)

const DB = {
  models:{
    Player,
    Post,
    Comment,
    Game,
  },
}

// generateFakeData(DB).catch(console.error)

export default DB
