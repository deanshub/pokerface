import gql from 'graphql-tag'
import {eventFields} from '../fragments/events'

export const eventAttendanceUpdate = gql`mutation eventAttendanceUpdate($eventId: String!, $attendance: Boolean){
  eventAttendanceUpdate(eventId: $eventId, attendance: $attendance){
    ...EventFields
  }
}
${eventFields}
`

export const addEvent = gql`mutation addEvent($title: String!, $description: String, $type: String, $subtype: String, $location: String, $startDate: String!, $endDate: String, $players: String!, $isPublic: Boolean, $coverImage: Upload){
  addEvent(title:$title, description:$description, type:$type, subtype:$subtype, location:$location, from: $startDate, to:$endDate, invited: $players, isPublic: $isPublic, coverImage: $coverImage){
    ...EventFields
  }
}
${eventFields}
`

export const updateEvent = gql`mutation updateEvent($id: String!, $title: String!, $description: String, $type: String, $subtype: String, $location: String, $startDate: String!, $endDate: String, $players: String!, $isPublic: Boolean, $coverImage: Upload){
  updateEvent(id:$id, title:$title, description:$description, type:$type, subtype:$subtype, location:$location, from: $startDate, to:$endDate, invited: $players, isPublic: $isPublic, coverImage: $coverImage){
    ...EventFields
  }
}
${eventFields}
`

export const deleteEvent = gql`mutation deleteEvent($eventId: String!){
  deleteEvent(eventId: $eventId){
    id
  }
}
`
