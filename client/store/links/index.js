import { ApolloLink } from 'apollo-link'
import { BatchHttpLink } from 'apollo-link-batch-http'
import { WebSocketLink } from 'apollo-link-ws'
import { onError } from 'apollo-link-error'
import {SubscriptionClient} from 'subscriptions-transport-ws'
import { setContext } from 'apollo-link-context'

export const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    )
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

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

const addSocketIdVariable = new ApolloLink((operation, forward) => {

  if (SOCKET_ID_ADDING_OPERATION.includes(operation.operationName)){
    operation.variables.clientSocketId = clientSocketId
  }

  return forward(operation)
})

const setAuthorizationLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: localStorage.getItem('jwt') || null,
    },
  }
})

// Add authorization jwt and socket id in the required operations
export const queryOrMutationLink = setAuthorizationLink.concat(
  addSocketIdVariable,
).concat(
  new BatchHttpLink({
    uri: '/graphql',
    credentials: 'same-origin',
  }),
)

// TODO create socket id using guid
const clientSocketId = Math.random().toString()

const subscriptionClient = new SubscriptionClient(`ws://${document.location.host}/subscriptions`, {
  reconnect: true,
  lazy: true,
  connectionParams: ()=> {
    return {
      jwt: localStorage.getItem('jwt'),
      clientSocketId,
    }
  },
})

export const wsLink = new WebSocketLink(subscriptionClient)

export const closeWs = () => {
  subscriptionClient.close()
}
