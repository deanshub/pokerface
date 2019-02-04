import mongoose from 'mongoose'
mongoose.Promise = Promise
import config from 'config'
import connectMongo from 'connect-mongo'

import User from './dbModels/User'
import Post from './dbModels/Post'
import Comment from './dbModels/Comment'
import Game from './dbModels/Game'
// import generateFakeData from './faker/generator'

// import mongooseErd from 'mongoose-erd'
// console.log(mongooseErd.toFile(mongoose))

const connString = `mongodb://${config.DB_USER}:${config.DB_PASSWORD}@localhost/pokerface`
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
    User,
    Post,
    Comment,
    Game,
  },
}

// generateFakeData(DB).catch(console.error)
export const getSessionStore = (session) => {
  const MongoStore = connectMongo(session)
  return new MongoStore({mongooseConnection: mongoose.connection})
}
export default DB
