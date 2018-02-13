import gql from 'graphql-tag'
import {eventFields} from '../fragments/events'

export const eventChanged = gql`
  subscription eventChanged{
    eventChanged{
        ...EventFields
        changeType
    }
  }
  ${eventFields}
`
