import {
  GraphQLObjectType, GraphQLString, GraphQLList,
  GraphQLInt,
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
          username: {
            type: GraphQLString,
          },
        },
        resolve(root, args){
          let where

          if (args.username){
            where = {
              username: args.username,
            }
          }else if (args.phrase){
            where = {
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
            }
          }

          return Db.models.player.findAll({
            where,
            limit: 6,
          })
        },
      },
      posts: {
        type: new GraphQLList(Post),
        args: {
          id: {
            type: GraphQLString,
          },
          username: {
            type: GraphQLString,
          },
          offset: {
            type: GraphQLInt,
          },
        },
        resolve(root, args){
          let where
          if (args.id!==undefined){
            where = {
              id: args.id,
            }
          }else if (args.username!==undefined) {
            where = {
              $or:[
                {playerUsername: args.username},
                {'$comments.playerUsername$': args.username},
              ],
            }
          }

          return Db.models.post.findAll({
            where,
            include: [{
              model: Db.models.comment,
              as: 'comments',
              // where:{'playerUsername': args.username},
              // required: false,
              // separate: true,
              // limit: 6,
              duplicating: false,
            }],
            limit: 20,
            offset: args.offset,
            order: [['created', 'DESC']],
          })
        },
      },
      comments: {
        type: new GraphQLList(Comment),
        resolve(root, args){
          return Db.models.comment.findAll({where: args})
        },
      },
    }
  },
})

export default Query
