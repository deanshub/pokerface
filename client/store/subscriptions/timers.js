import gql from 'graphql-tag'

export const timerChanged = gql`
  subscription _{
    timerChanged{
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
  }
`
