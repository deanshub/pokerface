import DB from '../../db'
import {encryptUsername, decryptUsername} from '../../../utils/authUtils'
const SUBSCRIPTION_TOPICS = ['Feed Notifitications', 'New Features', 'Events']

export const schema =  [`

  input SubscriptionTopicInput {
    topic: String
    subscribe: Boolean
  }

  input SubscriptionTopicsInput {
    topics: [SubscriptionTopicInput]
  }

  type SubscriptionTopic {
    topic: String
    subscribe: Boolean
  }

  type Query {
    subscriptionTopics(
      userKey: String
    ): [SubscriptionTopic]
  }

  type Mutation{
    updateTopics(
      userKey: String,
      topics: SubscriptionTopicsInput!
    ): [SubscriptionTopic]
  }
`]


export const resolvers = {
  Query:{
    subscriptionTopics: (_, {userKey}, {user}) => {
      const username = userKey?decryptUsername(userKey):user._id

      if (!username) {
        return Promise.reject(new Error('No such subsciption'))
      }
      return DB.models.UserSettings.findById(username).select('unsubscribe').then(topics => (
        SUBSCRIPTION_TOPICS.map(topic => ({topic, subscribe:!topics || !topics.unsubscribe || !topics.unsubscribe.includes(topic || [])}))
      ))
    },
  },
  Mutation:{
    updateTopics: (_, {userKey, topics:{topics}}, {user}) => {

      const id = userKey?decryptUsername(userKey):user._id

      if (!id){
        return topics
      }else{
        const unsubscribe = topics.reduce((topics, {topic, subscribe}) => {
          return subscribe?topics:[...topics, topic]
        }, [])

        return DB.models.UserSettings.findOneAndUpdate(
          {_id:id}, {_id:id, unsubscribe}, {upsert: true, new:true}
        ).then(userSettings => userSettings.unsubscribe)
      }
    },
  },
}
