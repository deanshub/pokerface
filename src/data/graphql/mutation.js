import {
  GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList,
  GraphQLBoolean,
} from 'graphql'
import mailer from '../../utils/mailer'
import Player from './graphqlModels/Player'
import Post from './graphqlModels/Post'
import Comment from './graphqlModels/Comment'
import Game from './graphqlModels/Game'
import UploadedFile from './graphqlModels/UploadedFile'
import DB from '../db'


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
          firstname: {
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
          return new DB.models.Player({
            username: args.username,
            firstname: args.firstname,
            lastName: args.lastName,
            email: args.email.toLowerCase(),
          }).save()
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
          return new DB.models.Post({
            content: args.content,
            player: context.user._id,
            photos: args.photos,
          }).save()
        },
      },

      addComment: {
        type: Post,
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
          return new DB.models.Comment({
            content: args.content,
            player: context.user._id,
            post: args.post,
            photos: args.photos,
          }).save()
          .then(()=>{
            return DB.models.Post.findById(args.post)
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
          return DB.models.Comment.findById(args.comment)
            .then((comment)=>{
              const username = context.user._id
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
          return DB.models.Post.findById(args.post)
            .then((post)=>{
              const username = context.user._id
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
          return DB.models.Game.findById(args.gameId)
          .then(game=>{
            const username = context.user._id
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

      addGame:{
        type: Game,
        args:{
          title: {
            type: GraphQLString,
          },
          description: {
            type: GraphQLString,
          },
          type: {
            type: GraphQLString,
          },
          subtype: {
            type: GraphQLString,
          },
          location: {
            type: GraphQLString,
          },
          from: {
            type: new GraphQLNonNull(GraphQLString),
          },
          to: {
            type: GraphQLString,
          },
          invited: {
            type: new GraphQLList(GraphQLString),
          },
        },
        resolve(_, args, context){
          return new DB.models.Game({
            player: context.user._id,
            title: args.title,
            description: args.description,
            type: args.type,
            subtype: args.subtype,
            location: args.location,
            startDate: new Date(args.from),
            endDate: args.to!==undefined?new Date(args.to):undefined,
            invited: args.invited,
          }).save()
          .then(game=>{
            mailer.sendGameInvite(game, DB)
            return game
          })
        },
      },

      deleteGame:{
        type: Game,
        args:{
          gameId: {
            type: GraphQLString,
          },
        },
        resolve(_, args, context){
          return DB.models.Game.findById(args.gameId).then(game=>{
            if (game.player===context.user._id){
              return mailer.sendGameCancelled(game, DB).catch((err)=>{
                console.error(err)
                return game.remove()
              }).then(()=>{
                return game.remove()
              })
            }else{
              throw new Error('Can\'t delete game of another user')
            }
          })
        },
      },

      updatePersonalInfo:{
        type: Player,
        args:{
          firstname: {
            type: GraphQLString,
          },
          // cover: {
          //   type: UploadedFile,
          // },
        },
        resolve(rootValue, args, context){
          // console.log(args, rootValue.request.file, rootValue.request.files);
          return DB.models.Player.findById(context.user._id)
        },
      },

    }
  },
})

export default Mutation
