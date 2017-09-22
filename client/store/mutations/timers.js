import gql from 'graphql-tag'

// TODO use fragmentes

export const timerPause = gql`mutation pauseTimer($currentTime: String!, $round: Int!, $offset: String!){
  pauseTimer(currentTime: $currentTime, round: $round, offset: $offset){
    paused
    round
    currentTime
    endTime
    offset
  }
}`

export const timerResume = gql`mutation resumeTimer($currentTime: String!, $round: Int!, $endTime: String!){
  resumeTimer(currentTime: $currentTime, round: $round, endTime: $endTime){
    paused
    round
    currentTime
    endTime
    offset
  }
}`

export const timerUpdateRound = gql`mutation nextTimerRound(
  $currentTime: String!,
  $round: Int!,
  $paused: Boolean!,
  $endTime: String){
  updateRound(currentTime: $currentTime, round: $round, paused: $paused, endTime:$endTime){
      paused
      round
      currentTime
      endTime
      offset
    }
}`

export const timerRoundsUpdate = gql`mutation updateTimerRounds($currentTime: String!, $rounds: TimerRoundsInput!){
  updateTimerRounds(currentTime: $currentTime, rounds: $rounds){
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

export const timerResetResponseSetting = gql`mutation setResetClientResponse($currentTime: String!, $reset: Boolean!){
  setResetClientResponse(currentTime: $currentTime, reset: $reset){
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
