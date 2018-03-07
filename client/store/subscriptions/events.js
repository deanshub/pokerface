import gql from 'graphql-tag'
import {eventFields} from '../fragments/events'

export const eventChanged = gql`
  subscription _{
    eventChanged{
      changeType
      event{
        ...EventFields
      }
    }
  }
  ${eventFields}
`
