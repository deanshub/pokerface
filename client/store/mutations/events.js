import gql from 'graphql-tag'
export const eventAttendanceUpdate = gql`mutation eventAttendanceUpdate($eventId: String!, $attendance: Boolean){
  eventAttendanceUpdate(eventId: $eventId, attendance: $attendance){
    id
    creator{
      username
      fullname
      avatar
    }
    title
    description
    type
    subtype
    location
    from
    to
    invited{
      username
      fullname
      avatar
    }
    accepted{
      username
      fullname
      avatar
    }
    declined{
      username
      fullname
      avatar
    }
    unresponsive{
      username
      fullname
      avatar
    }
    image
    updatedAt
    createdAt
  }
}
`

export const addEvent = gql`mutation addEvent($title: String!, $description: String, $type: String, $subtype: String, $location: String, $startDate: String!, $endDate: String, $players: String!, $isPublic: Boolean){
  addEvent(title:$title, description:$description, type:$type, subtype:$subtype, location:$location, from: $startDate, to:$endDate, invited: $players, isPublic: $isPublic){
    id
    creator{
      username
      fullname
      avatar
    }
    title
    description
    type
    subtype
    location
    from
    to
    invited{
      username
      fullname
      avatar
    }
    accepted{
      username
      fullname
      avatar
    }
    declined{
      username
      fullname
      avatar
    }
    unresponsive{
      username
      fullname
      avatar
    }
    image
    updatedAt
    createdAt
  }
}
`

export const updateEvent = gql`mutation updateEvent($id: String!, $title: String!, $description: String, $type: String, $subtype: String, $location: String, $startDate: String!, $endDate: String, $players: String!, $isPublic: Boolean){
  updateEvent(id:$id, title:$title, description:$description, type:$type, subtype:$subtype, location:$location, from: $startDate, to:$endDate, invited: $players, isPublic: $isPublic){
    id
    creator{
      username
      fullname
      avatar
    }
    title
    description
    type
    subtype
    location
    from
    to
    invited{
      username
      fullname
      avatar
    }
    accepted{
      username
      fullname
      avatar
    }
    declined{
      username
      fullname
      avatar
    }
    unresponsive{
      username
      fullname
      avatar
    }
    image
    updatedAt
    createdAt
  }
}
`

export const deleteEvent = gql`mutation deleteEvent($eventId: String!){
  deleteEvent(eventId: $eventId){
    id
  }
}
`
