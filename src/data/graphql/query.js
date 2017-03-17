import {
  GraphQLObjectType, GraphQLString, GraphQLList,
} from 'graphql'

import Db from '../db'
import Player from './graphqlModels/Player'
import Post from './graphqlModels/Post'
import Comment from './graphqlModels/Comment'

const Query =  new GraphQLObjectType({
  name: 'Query',
  description: 'root query',
  fields: ()=>{
    return {
      players: {
        type: new GraphQLList(Player),
        args: {
          phrase: {
            type: GraphQLString,
          },
        },
        resolve(root, args){
          const where = args.phrase?{
            $or:[{
              username: {
                $ilike: `%${args.phrase}%`,
              },
            },{
              firstName: {
                $ilike: `%${args.phrase}%`,
              },
            },{
              lastName: {
                $ilike: `%${args.phrase}%`,
              },
            }],
          }:{}

          return Db.models.player.findAll({
            where,
            limit: 6
          })
        },
      },
      posts: {
        type: new GraphQLList(Post),
        resolve(root, args){
          return Db.models.post.findAll({where: args})
        },
      },
      comments: {
        type: new GraphQLList(Comment),
        resolve(root, args){
          return Db.models.comment.findAll({where: args})
        },
      }
    }
  },
})

export default Query
