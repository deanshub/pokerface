export const gameAttendanceUpdate = `($gameId: String!, $attendance: Boolean!){
  gameAttendanceUpdate(gameId: $gameId, attendance: $attendance){
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
    updatedAt
    createdAt
  }
}`

export const addGame = `($title: String!, $description: String, $type: String, $subtype: String, $location: String, $startDate: String!, $endDate: String, $players: [String]!){
  addGame(title:$title, description:$description, type:$type, subtype:$subtype, location:$location, from: $startDate, to:$endDate, invited: $players){
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
    updatedAt
    createdAt
  }
}`

export const deleteGame = `($gameId: String!){
  deleteGame(gameId: $gameId){
    id
  }
}

`
