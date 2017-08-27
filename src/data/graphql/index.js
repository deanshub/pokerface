import { graphqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import {mergeStrings} from 'gql-merge'
import {merge} from 'lodash'
import config from 'config'

import { schema as PostSchema, resolvers as PostResolvers } from './graphqlModels/Post'
import { schema as CommentSchema, resolvers as CommentResolvers } from './graphqlModels/Comment'
import { schema as PlayerSchema, resolvers as PlayerResolvers } from './graphqlModels/Player'
import { schema as GameSchema, resolvers as GameResolvers } from './graphqlModels/Game'
import { schema as UploadSchema, resolvers as UploadResolvers } from './graphqlModels/UploadedFile'

const Schema = makeExecutableSchema({
  typeDefs: [mergeStrings([
    ...PostSchema,
    ...CommentSchema,
    ...PlayerSchema,
    ...GameSchema,
    ...UploadSchema,
  ])],
  resolvers: merge(
    PostResolvers,
    CommentResolvers,
    PlayerResolvers,
    GameResolvers,
    UploadResolvers,
  ),
})

export default graphqlExpress(req=>{
  return {
    schema: Schema,
    pretty: config.NODE_ENV==='development'?true:false,
    graphiql: config.NODE_ENV==='development'?true:false,
    printErrors: true,
    context: {user: req.user},
  }
})
