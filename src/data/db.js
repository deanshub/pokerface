import mongoose from 'mongoose'
mongoose.Promise = global.Promise

import Player from './dbModels/Player'
import Post from './dbModels/Post'
import Comment from './dbModels/Comment'
import Game from './dbModels/Game'
import generateFakeData from './faker/generator'

const connString = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost/pokerface`
mongoose.connect(connString,{
  useMongoClient: true,
})

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
