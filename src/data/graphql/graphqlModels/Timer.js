import {PubSub, withFilter} from 'graphql-subscriptions'
import {timerActions} from '../../../utils/blindTimers'

const pubsub = new PubSub()

export const schema =  [`
  input TimerRoundInput {
    ante: Int
    smallBlind: Int
    bigBlind: Int
    time: Int!
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
      offset: String!,
      clientSocketId: String!
    ): Timer
    resumeTimer(
      currentTime: String!,
      round: Int!,
      endTime: String!,
      clientSocketId: String!
    ): Timer
    updateRound(
      currentTime: String!,
      round: Int!,
      paused: Boolean!
      endTime: String,
      clientSocketId: String!
    ): Timer
    updateTimerRounds(
      currentTime: String!,
      rounds: TimerRoundsInput!,
      clientSocketId: String!
    ): Timer
    setResetClientResponse(
      currentTime: String!,
      reset: Boolean!,
      clientSocketId: String!
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
    pauseTimer: (_, args , {user:{_id:userId}}) => {
      const {currentTime, round, offset, clientSocketId} = args
      const timer = timerActions.pause(userId, parseInt(currentTime), round, parseInt(offset))

      pubsub.publish('timerChanged', {timerChanged: timer, clientSocketId, userId})
      return timer
    },
    resumeTimer: (_, args, {user:{_id:userId}}) => {
      const {currentTime, round, endTime, clientSocketId} = args
      const timer = timerActions.resume(
        userId,
        parseInt(currentTime),
        round,
        parseInt(endTime)
      )

      pubsub.publish('timerChanged', {timerChanged: timer, clientSocketId, userId})
      return timer
    },
    updateRound: (_, args ,{user:{_id:userId}}) => {
      const {currentTime, round, paused, endTime, clientSocketId} = args
      const timer = timerActions.updateRound(
        userId,
        parseInt(currentTime),
        round,
        paused,
        parseInt(endTime)
      )

      pubsub.publish('timerChanged', {timerChanged: timer, clientSocketId, userId})
      return timer
    },
    updateTimerRounds: (_, args, {user:{_id:userId}}) => {
      const {currentTime, rounds:{rounds}, clientSocketId} = args
      const timer = timerActions.updateTimerRounds(userId, parseInt(currentTime), rounds)

      pubsub.publish('timerChanged', {timerChanged: timer, clientSocketId, userId})
      return timer
    },
    setResetClientResponse: (_, args, {user:{_id:userId}}) => {
      const {currentTime, reset, clientSocketId} = args
      const timer = timerActions.setResetClientResponse(userId, parseInt(currentTime), reset)

      pubsub.publish('timerChanged', {timerChanged: timer, clientSocketId, userId})
      return timer
    },
  },
  Subscription: {
    timerChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('timerChanged'),
        (payload ,_ ,{userId, clientSocketId}) => {
          const {userId:userIdPublisher, clientSocketId:socketIdPublisher} = payload
          return (userIdPublisher === userId && clientSocketId !== socketIdPublisher)
        },
      ),
    },
  },
}
