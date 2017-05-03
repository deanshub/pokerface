import {
  GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList,
  GraphQLBoolean,
} from 'graphql'
import Player from './graphqlModels/Player'
import Post from './graphqlModels/Post'
import Comment from './graphqlModels/Comment'
import Db from '../db'


const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Functions to CUD objects',
  fields() {
    return {
      createPlayer: {
        type: Player,
        args:{
          username:{
            type: new GraphQLNonNull(GraphQLString),
          },
          firstName: {
            type: new GraphQLNonNull(GraphQLString),
          },
          lastName: {
            type: new GraphQLNonNull(GraphQLString),
          },
          email: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve(_, args){
          // TODO: authorize only admins
          return Db.models.player.create({
            username: args.username,
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email.toLowerCase(),
          })
        },
      },

      createPost: {
        type: Post,
        args:{
          content:{
            type: new GraphQLNonNull(GraphQLString),
          },
          username:{ //TODO: get username out of authentication
            type: new GraphQLNonNull(GraphQLString),
          },
          photos:{
            type: new GraphQLList(GraphQLString),
          },
        },
        resolve(_, args){
          return Db.models.post.create({
            content: args.content,
            playerUsername: args.username,
            photos: args.photos||[],
            likes:[],
          })
        },
      },

      addComment: {
        type: Comment,
        args:{
          content:{
            type: new GraphQLNonNull(GraphQLString),
          },
          username:{ //TODO: get username out of authentication
            type: new GraphQLNonNull(GraphQLString),
          },
          photos:{
            type: new GraphQLList(GraphQLString),
          },
          post:{
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve(_, args){
          return Db.models.comment.create({
            content: args.content,
            playerUsername: args.username,
            postId: args.post,
            photos: args.photos||[],
            likes:[],
          })
        },
      },

      setCommentLike: {
        type: Comment,
        args:{
          content:{
            type: new GraphQLNonNull(GraphQLBoolean),
          },
          username:{ //TODO: get username out of authentication
            type: new GraphQLNonNull(GraphQLString),
          },
          comment:{
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve(_, args){
          return Db.models.comment.findById(args.comment)
            .then((comment)=>{
              let likes = comment.get('likes')
              if (args.content&&!likes.includes(args.username)){
                likes.push(args.username)
              }else if (!args.content&&likes.includes(args.username)){
                likes = likes.filter(user=>user!==args.username)
              }

              comment.set('likes', likes)
              return comment.save()
            })
        },
      },

      setPostLike: {
        type: Post,
        args:{
          content:{
            type: new GraphQLNonNull(GraphQLBoolean),
          },
          username:{ //TODO: get username out of authentication
            type: new GraphQLNonNull(GraphQLString),
          },
          post:{
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve(_, args){
          return Db.models.post.findById(args.post)
            .then((post)=>{
              let likes = post.get('likes')
              if (args.content&&!likes.includes(args.username)){
                likes.push(args.username)
              }else if (!args.content&&likes.includes(args.username)){
                likes = likes.filter(user=>user!==args.username)
              }

              post.set('likes', likes)
              return post.save()
            })
        },
      },

    }
  },
})

export default Mutation
