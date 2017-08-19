import ApolloClient from 'apollo-client'
import { createBatchingNetworkInterface  } from 'apollo-upload-client'

const client = new ApolloClient({
  networkInterface: createBatchingNetworkInterface ({
    uri: '/graphql',
    batchInterval: 10,  // in milliseconds
    batchMax: 10,
    opts: {
      credentials: 'same-origin',
    },
  }),
})


export default client
