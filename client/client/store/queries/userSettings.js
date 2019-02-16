import gql from 'graphql-tag'

export const subscriptionTopicsQuery = gql`
  query subscriptionTopics($userKey: String){
    subscriptionTopics(userKey: $userKey){
      topic
      subscribe
    }
  }
  `
