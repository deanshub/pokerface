import {
  GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList,
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
          console.log({_,args});
          return Db.models.comment.create({
            content: args.content,
            playerUsername: args.username,
            postId: args.post,
            photos: args.photos||[],
            likes:[],
          })
        },
      },

    }
  },
})

export default Mutation
