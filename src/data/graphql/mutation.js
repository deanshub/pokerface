import {
  GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList,
  GraphQLBoolean,
} from 'graphql'
import Player from './graphqlModels/Player'
import Post from './graphqlModels/Post'
import Comment from './graphqlModels/Comment'
import Game from './graphqlModels/Game'
import Db from '../db'


const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Functions to CRUD objects',
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
          photos:{
            type: new GraphQLList(GraphQLString),
          },
        },
        resolve(_, args, context){
          return Db.models.post.create({
            content: args.content,
            playerUsername: context.user.username,
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
          photos:{
            type: new GraphQLList(GraphQLString),
          },
          post:{
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve(_, args, context){
          return Db.models.comment.create({
            content: args.content,
            playerUsername: context.user.username,
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
          comment:{
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve(_, args, context){
          return Db.models.comment.findById(args.comment)
            .then((comment)=>{
              const username = context.user.username
              let likes = comment.get('likes')
              if (args.content&&!likes.includes(username)){
                likes.push(username)
              }else if (!args.content&&likes.includes(username)){
                likes = likes.filter(user=>user!==username)
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
          post:{
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve(_, args, context){
          return Db.models.post.findById(args.post)
            .then((post)=>{
              const username = context.user.username
              let likes = post.get('likes')
              if (args.content&&!likes.includes(username)){
                likes.push(username)
              }else if (!args.content&&likes.includes(username)){
                likes = likes.filter(user=>user!==username)
              }

              post.set('likes', likes)
              return post.save()
            })
        },
      },

      gameAttendanceUpdate:{
        type: Game,
        args:{
          gameId:{
            type: new GraphQLNonNull(GraphQLString),
          },
          attendance:{
            type: new GraphQLNonNull(GraphQLBoolean),
          },
        },
        resolve(_, args, context){
          return Db.models.game.findById(args.gameId)
          .then(game=>{
            const username = context.user.username
            let invited = game.get('invited')

            if (invited.includes(username)){
              const attendance = args.attendance
              let accepted = game.get('accepted')
              let declined = game.get('declined')

              const acceptedIndex = accepted.indexOf(username)
              const declinedIndex = declined.indexOf(username)

              if (declinedIndex>-1 && attendance){
                declined.splice(declinedIndex, 1)
              }else if (declinedIndex===-1 && !attendance){
                declined.push(username)
              }

              if (acceptedIndex>-1 && !attendance){
                accepted.splice(acceptedIndex, 1)
              }else if (acceptedIndex===-1 && attendance) {
                accepted.push(username)
              }

              game.set('accepted',accepted)
              game.set('declined',declined)
              return game.save()
            }

            return game
          })
        },
      },

    }
  },
})

export default Mutation
