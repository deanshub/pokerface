import {
  GraphQLObjectType, GraphQLString, GraphQLList,
} from 'graphql'

import Db from '../db'
import Player from './graphqlModels/Player'
import Post from './graphqlModels/Post'

const Query =  new GraphQLObjectType({
  name: 'Query',
  description: 'root query',
  fields: ()=>{
    return {
      players: {
        type: new GraphQLList(Player),
        args: {
          username: {
            type: GraphQLString,
          },
          email: {
            type: GraphQLString,
          },
        },
        resolve(root, args){
          return Db.models.player.findAll({where: args})
        },
      },
      posts: {
        type: new GraphQLList(Post),
        resolve(root, args){
          return Db.models.post.findAll({where: args})
        },
      },
    }
  },
})

export default Query
