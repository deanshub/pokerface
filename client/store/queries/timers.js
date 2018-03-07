import gql from 'graphql-tag'

export const timerQuery = gql`
  query timer{
    timer{
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
        type
      }
    }
  }
`
