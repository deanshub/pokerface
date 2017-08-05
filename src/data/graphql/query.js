import {
  GraphQLObjectType, GraphQLString, GraphQLList,
  GraphQLInt,
} from 'graphql'

import DB from '../db'
import Player from './graphqlModels/Player'
import Post from './graphqlModels/Post'
import Comment from './graphqlModels/Comment'
import Game from './graphqlModels/Game'

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
          if (args.username){
            return DB.models.Player.find({_id:args.username})
          }else if (args.phrase){
            return DB.models.Player.find()
              .or([{
                _id: new RegExp(args.phrase,'i'),
              },{
                firstname: new RegExp(args.phrase,'i'),
              },{
                lastname: new RegExp(args.phrase,'i'),
              }])
              .limit(6)
          }
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
          let query
          if (args.id!==undefined){
            query = DB.models.Post.find({_id: args.id})
          }else if (args.username!==undefined) {
            return DB.models.Comment.find({player: args.username}).then((comments)=>{
              const posts = comments.map(comment=>comment.post)
              return DB.models.Post.find({
                $or:[
                  {player: args.username},
                  {_id:{$in:posts}},
                ],
              })
              .limit(20)
              .skip(args.offset||0)
              .sort('-created')
            })
          }else{
            query = DB.models.Post.find()
          }

          return query
            .limit(20)
            .skip(args.offset||0)
            .sort('-created')
        },
      },
      comments: {
        type: new GraphQLList(Comment),
        resolve(root, args){
          return DB.models.Comment.find(args)
        },
      },
      games: {
        type: new GraphQLList(Game),
        resolve(root, args, context){
          return DB.models.Game.find({
            startDate: {
              $gt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          })
          .or([{
            invited: context.user._id,
          },{
            player: context.user._id,
          }])
          .limit(20)
          .sort('-startDate')
        },
      },
    }
  },
})

export default Query
