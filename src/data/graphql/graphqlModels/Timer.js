import {PubSub, withFilter} from 'graphql-subscriptions'
import {timerActions} from '../../../utils/blindTimers'

const pubsub = new PubSub()

export const schema =  [`
  input TimerRoundInput {
    ante: Int
    smallBlind: Int
    bigBlind: Int
    time: Int!
    key: Float!
    type: String
  }

  input TimerRoundsInput {
    rounds: [TimerRoundInput]!
  }

  type TimerRound {
    ante: Int
    smallBlind: Int
    bigBlind: Int
    time: Int!
    key: Float!
    type: String
  }

  type Timer {
    paused: Boolean
    round: Int
    rounds: [TimerRound]
    currentTime: String
    endTime: String
    offset: String
    recovered: Boolean
  }

  type Query {
    timer: Timer
  }

  type Mutation {
    pauseTimer(
      currentTime: String!,
      round: Int!,
      offset: String!
    ): Timer
    resumeTimer(
      currentTime: String!,
      round: Int!,
      endTime: String!
    ): Timer
    updateRound(
      currentTime: String!,
      round: Int!,
      paused: Boolean!
      endTime: String
    ): Timer
    updateTimerRounds(
      currentTime: String!,
      rounds: TimerRoundsInput!
    ): Timer
    setResetClientResponse(
      currentTime: String!,
      reset: Boolean!
    ): Timer

  }

  type Subscription {
    timerChanged: Timer
  }
  `]

export const resolvers = {
  Timer:{
    currentTime: ({currentTime}) => currentTime && currentTime.toString(),
    endTime: ({endTime}) => endTime && endTime.toString(),
    offset: ({offset}) => offset && offset.toString(),
  },
  Query: {
    timer: (_, __, {user:{_id:userId}}) => {
      return timerActions.getTimer(userId)
    },
  },
  Mutation: {
    pauseTimer: (_, {currentTime, round, offset}, {user:{_id:userId}}) => {
      const timer = timerActions.pause(userId, parseInt(currentTime), round, parseInt(offset))

      pubsub.publish('timerChanged', {timerChanged: timer, userId})
      return timer
    },
    resumeTimer: (_, {currentTime, round, endTime},{user:{_id:userId}}) => {
      const timer = timerActions.resume(userId, parseInt(currentTime), round, parseInt(endTime))

      pubsub.publish('timerChanged', {timerChanged: timer, userId})
      return timer
    },
    updateRound: (_, {currentTime, round, paused, endTime},{user:{_id:userId}}) => {
      const timer = timerActions.updateRound(userId, parseInt(currentTime), round, paused, parseInt(endTime))

      pubsub.publish('timerChanged', {timerChanged: timer, userId})
      return timer
    },
    updateTimerRounds: (_, {currentTime, rounds:{rounds}}, {user:{_id:userId}}) => {
      const timer = timerActions.updateTimerRounds(userId, parseInt(currentTime), rounds)

      pubsub.publish('timerChanged', {timerChanged: timer, userId})
      return timer
    },
    setResetClientResponse: (_, {currentTime, reset},{user:{_id:userId}}) => {
      const timer = timerActions.setResetClientResponse(userId, parseInt(currentTime), reset)

      pubsub.publish('timerChanged', {timerChanged: timer, userId})
      return timer
    },
  },

  Subscription: {
    timerChanged: {
      subscribe: withFilter(() => pubsub.asyncIterator('timerChanged'), (payload ,_ ,{userId}) => {
        const {userId:userIdSender}  = payload
        return userIdSender == userId
      }),
    },
  },
}
