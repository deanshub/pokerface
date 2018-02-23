import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { errorLink, queryOrMutationLink, wsLink, closeWs } from './links'

const hasSubscriptionOperation = ({ query: { definitions } }) => {
  return definitions.some(
    ({ kind, operation }) =>
      kind === 'OperationDefinition' && operation === 'subscription',
  )
}

const hybridLink = ApolloLink.split(
  hasSubscriptionOperation,
  wsLink,
  queryOrMutationLink,
)

const graphqlClient = new ApolloClient({
  link: ApolloLink.from([errorLink, hybridLink]),
  cache: new InMemoryCache(),
})

export const close = () => {
  closeWs()
}

export default graphqlClient
