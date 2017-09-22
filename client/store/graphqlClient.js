import ApolloClient, {createNetworkInterface} from 'apollo-client'
// import { createBatchingNetworkInterface  } from 'apollo-upload-client'
import {SubscriptionClient, addGraphQLSubscriptions} from 'subscriptions-transport-ws'
import {getCookieByName} from '../utils/cookies'

// TODO: make it works with subscription
// const networkInterface = createBatchingNetworkInterface ({
//   uri: '/graphql',
//   batchInterval: 10,  // in milliseconds
//   batchMax: 10,
//   opts: {
//     credentials: 'same-origin',
//   },
// })

const networkInterface = createNetworkInterface({
  uri: '/graphql',
  opts: {
    credentials: 'same-origin',
  },
})

const wsClient = new SubscriptionClient(`ws://${document.location.host}/subscriptions`, {
  reconnect: true,
  lazy: true,
  connectionParams: {
    jwt:getCookieByName('jwt'),
  },
})

const graphqlClient = new ApolloClient({
  networkInterface: addGraphQLSubscriptions(
  networkInterface,
     wsClient,
   ),
})

// const subscriptionClient = new ApolloClient({
//   networkInterface: addGraphQLSubscriptions({wsClient}),
// })
//

export default graphqlClient
