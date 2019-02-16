import gql from 'graphql-tag'

export const updateTopicsMutation = gql`mutation updateTopics($userKey: String, $topics: SubscriptionTopicsInput!){
  updateTopics(userKey: $userKey, topics: $topics){
    topic
    subscribe
  }
}
`
