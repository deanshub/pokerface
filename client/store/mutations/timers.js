import gql from 'graphql-tag'

// TODO use fragmentes

export const timerPause = gql`mutation pauseTimer(
  $currentTime: String!,
  $round: Int!,
  $offset: String!,
  $clientSocketId: String!,
){
  pauseTimer(
    currentTime: $currentTime,
    round: $round,
    offset: $offset,
    clientSocketId: $clientSocketId,
  ){
    paused
    round
    currentTime
    endTime
    offset
  }
}`

export const timerResume = gql`mutation resumeTimer(
  $currentTime: String!,
  $round: Int!,
  $endTime: String!,
  $clientSocketId: String!,
){
  resumeTimer(
    currentTime: $currentTime,
    round: $round,
    endTime: $endTime,
    clientSocketId: $clientSocketId,
  ){
    paused
    round
    currentTime
    endTime
    offset
  }
}`

export const timerUpdateRound = gql`mutation updateRound(
  $currentTime: String!,
  $round: Int!,
  $paused: Boolean!,
  $endTime: String,
  $clientSocketId: String!,
){
  updateRound(
    currentTime: $currentTime,
    round: $round,
    paused: $paused,
    endTime:$endTime,
    clientSocketId: $clientSocketId,
  ){
      paused
      round
      currentTime
      endTime
      offset
    }
}`

export const timerRoundsUpdate = gql`mutation updateTimerRounds(
  $currentTime: String!,
  $rounds: TimerRoundsInput!,
  $clientSocketId: String!,
){
  updateTimerRounds(
    currentTime: $currentTime,
    rounds: $rounds,
    clientSocketId: $clientSocketId,
  ){
    rounds{
      ante
      smallBlind
      bigBlind
      time
      key
      type
    }
  }
}`

export const timerResetResponseSetting = gql`mutation setResetClientResponse(
  $currentTime: String!,
  $reset: Boolean!,
  $clientSocketId: String!
){
  setResetClientResponse(
    currentTime: $currentTime,
    reset: $reset,
    clientSocketId: $clientSocketId,
  ){
    paused
    round
    currentTime
    endTime
    offset
    recovered
    rounds {
      ante
      smallBlind
      bigBlind
      time
      key
      type
    }
  }
}`
