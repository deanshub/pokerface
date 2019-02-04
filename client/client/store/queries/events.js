import gql from 'graphql-tag'
import {eventFields} from '../fragments/events'

export const eventsQuery = gql`
  query events{
    events{
      ...EventFields
    }
  }
  ${eventFields}
`

export const eventQuery = gql`
  query event($eventId: String!) {
    event(eventId: $eventId) {
      ...EventFields
    }
  }
  ${eventFields}
`

export const searchEventsQuery = gql`
  query searchEvents($title: String!){
    search(title: $title){
      id
      title
      location
    }
  }
`
