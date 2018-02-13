import gql from 'graphql-tag'
import {eventFields} from '../fragments/events'

export const eventsQuery = gql`
  query _{
    events{
      ...EventFields
    }
  }
  ${eventFields}
`

export const eventQuery = gql`
  query _($eventId: String!) {
    event(eventId: $eventId) {
      ...EventFields
    }
  }
  ${eventFields}
`

export const searchEventsQuery = gql`
  query _($title: String!){
    search(title: $title){
      id
      title
      location
    }
  }
`
