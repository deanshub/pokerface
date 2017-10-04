import ApolloClient from 'apollo-client'
import { createBatchingNetworkInterface  } from 'apollo-upload-client'
import {SubscriptionClient, addGraphQLSubscriptions} from 'subscriptions-transport-ws'
import {getCookieByName} from '../utils/cookies'


const networkInterface = createBatchingNetworkInterface ({
  uri: '/graphql',
  batchInterval: 10,  // in milliseconds
  batchMax: 10,
  opts: {
    credentials: 'same-origin',
  },
})

const clientSocketId = Date.now().toString()

const SOCKET_ID_ADDING_OPERATION = [
  'pauseTimer',
  'resumeTimer',
  'updateRound',
  'updateTimerRounds',
  'setResetClientResponse',
]

const wsClient = new SubscriptionClient(`ws://${document.location.host}/subscriptions`, {
  reconnect: true,
  lazy: true,
  connectionParams: {
    jwt:getCookieByName('jwt'),
    clientSocketId,
  },
})

const socketIdAddingMiddleware = {
  applyBatchMiddleware(req, next) {
    req.requests.forEach(operation => {
      if (SOCKET_ID_ADDING_OPERATION.includes(operation.operationName)){
        operation.variables.clientSocketId = clientSocketId
      }
    })
    next()
  },
}

networkInterface.use([socketIdAddingMiddleware])

const graphqlClient = new ApolloClient({
  networkInterface: addGraphQLSubscriptions(
  networkInterface,
     wsClient,
   ),
})

export default graphqlClient
