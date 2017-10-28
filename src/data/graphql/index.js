import {graphqlExpress} from 'apollo-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import {SubscriptionServer} from 'subscriptions-transport-ws'
import {execute, subscribe} from 'graphql'
import {mergeStrings} from 'gql-merge'
import {merge} from 'lodash'
import config from 'config'
import { createServer } from 'http'
import {getUserByToken, getTokenFromCookieString}  from '../../utils/authUtils'
import {eventConnectionListener as timerListener} from '../../utils/blindTimers'

import { schema as PostSchema, resolvers as PostResolvers } from './graphqlModels/Post'
import { schema as CommentSchema, resolvers as CommentResolvers } from './graphqlModels/Comment'
import { schema as PlayerSchema, resolvers as PlayerResolvers } from './graphqlModels/Player'
import { schema as GameSchema, resolvers as GameResolvers } from './graphqlModels/Game'
import { schema as UploadSchema, resolvers as UploadResolvers } from './graphqlModels/UploadedFile'
import { schema as TimerSchema, resolvers as TimerResolvers } from './graphqlModels/Timer'

const schema = makeExecutableSchema({
  typeDefs: [mergeStrings([
    ...PostSchema,
    ...CommentSchema,
    ...PlayerSchema,
    ...GameSchema,
    ...UploadSchema,
    ...TimerSchema,
  ])],
  resolvers: merge(
    PostResolvers,
    CommentResolvers,
    PlayerResolvers,
    GameResolvers,
    UploadResolvers,
    TimerResolvers,
  ),
})

export const graphqlExpressMiddleware = graphqlExpress(req=>{
  return {
    schema,
    pretty: config.NODE_ENV==='development'?true:false,
    printErrors: true,
    context: {user: req.user},
  }
})

export const createGraphqlSubscriptionsServer = (app) => {
  const apolloPubSubServer = createServer(app)

  SubscriptionServer.create({
    schema,
    execute,
    subscribe,
    onConnect: (connectionParams) => {
      // clientSocketId is created in client so
      // it could be sent with mutations
      const { clientSocketId, jwt } = connectionParams

      return getUserByToken(jwt).then((user) => {
        timerListener.onConnect(user._id)
        return {userId: user._id, clientSocketId}
      })
    },
    onDisconnect: (webSocket) => {
      const {cookie} = webSocket.upgradeReq.headers
      const token = getTokenFromCookieString(cookie)
      if (token !== null){
        getUserByToken(token).then(user => {
          timerListener.onDisconnect(user._id)
        }).catch(err => {
          console.error(err)
        })
      }
    },
  },{
    server: apolloPubSubServer,
    path: '/subscriptions',
  },
  )

  return apolloPubSubServer
}
