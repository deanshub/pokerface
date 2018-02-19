import ApolloClient from 'apollo-client'
import { createBatchingNetworkInterface  } from 'apollo-upload-client'
import {SubscriptionClient, addGraphQLSubscriptions} from 'subscriptions-transport-ws'


const networkInterface = createBatchingNetworkInterface ({
  uri: '/graphql',
  batchInterval: 10,  // in milliseconds
  batchMax: 10,
  opts: {
    credentials: 'same-origin',
  },
})

// TODO create socket id using guid
const clientSocketId = Math.random().toString()

const SOCKET_ID_ADDING_OPERATION = [
  'pauseTimer',
  'resumeTimer',
  'updateRound',
  'updateTimerRounds',
  'setResetClientResponse',
  'addEvent',
  'updateEvent',
  'deleteEvent',
  'createPost',
  'deletePost',
]

const socketIdAddingMiddleware = {
  applyBatchMiddleware(req, next) {
    req.requests.forEach(operation => {
      if (SOCKET_ID_ADDING_OPERATION.includes(operation.operationName)){
        operation.variables.clientSocketId = clientSocketId
      }
    })

    req.options.headers['authorization'] = localStorage.getItem('jwt')
    next()
  },
}

const authMiddleware = {
  applyBatchMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {}
    }
    req.options.headers['authorization'] = localStorage.getItem('jwt')
    next()
  },
}

networkInterface.use([authMiddleware, socketIdAddingMiddleware])


const wsClient = new SubscriptionClient(`ws://${document.location.host}/subscriptions`, {
  reconnect: true,
  lazy: true,
  connectionParams: ()=> {
    return {
      jwt: localStorage.getItem('jwt'),
      clientSocketId,
    }
  },
})

const graphqlClient = new ApolloClient({
  networkInterface: addGraphQLSubscriptions(
    networkInterface,
    wsClient,
  ),
})

export const close = () => {
  wsClient.close()
}

export default graphqlClient
